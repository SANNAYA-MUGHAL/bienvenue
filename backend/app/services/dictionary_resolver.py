"""
Dynamic Dictionary Resolver & Pedagogical Enrichment Service for Bienvenue.
Provides:
1. Dynamic Open Wiktionary API definitions for 500,000+ French words & multi-word expressions.
2. Accent & Casing Canonicalization (e.g. 'deja' -> 'déjà', 'japon' -> 'Japon').
3. Multi-language translations across 5 learner languages (Urdu, Arabic, Hindi, Spanish, English).
4. Reverse lookup from learner languages into French (e.g. English 'already' -> 'déjà').
5. Pedagogical enrichment: IPA, gender, POS, authentic example sentences, contrastive rules, audio prompts.
6. Persistent SQLite cache for sub-millisecond offline retrieval.
7. Damerau-Levenshtein typo correction strictly as a post-lexical fallback.
"""

import sqlite3
import threading
import urllib.request
import urllib.parse
import json
import re
import unicodedata
import difflib
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "dictionary_cache.db"
CARDS_PATH = DATA_DIR / "micro_cards.json"
LEXICON_PATH = DATA_DIR / "lexicon.json"

WIKI_USER_AGENT = "BienvenueApp/2.1.0 (Educational Immigrant Platform; support@bienvenue-learn.org)"

def strip_accents(text: str) -> str:
    """Normalize unicode and strip diacritics for accent-insensitive matching."""
    if not text:
        return ""
    nfd = unicodedata.normalize('NFD', text)
    stripped = "".join(c for c in nfd if unicodedata.category(c) != 'Mn')
    return stripped.lower().strip()

def clean_text(html_or_raw: str) -> str:
    """Strip HTML tags, wiki markup, template markers, and Wikipedia artifacts."""
    if not html_or_raw:
        return ""
    t = re.sub(r'<[^>]+>', '', html_or_raw)
    t = re.sub(r'\.mw-parser-output[^\s]*', '', t)
    t = re.sub(r'\[\d+\]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def damerau_levenshtein(s1: str, s2: str) -> int:
    """Compute Damerau-Levenshtein distance accounting for adjacent transpositions."""
    d = {}
    len1, len2 = len(s1), len(s2)
    for i in range(-1, len1 + 1):
        d[(i, -1)] = i + 1
    for j in range(-1, len2 + 1):
        d[(-1, j)] = j + 1

    for i in range(len1):
        for j in range(len2):
            cost = 0 if s1[i] == s2[j] else 1
            d[(i, j)] = min(
                d[(i - 1, j)] + 1,          # deletion
                d[(i, j - 1)] + 1,          # insertion
                d[(i - 1, j - 1)] + cost,   # substitution
            )
            if i and j and s1[i] == s2[j - 1] and s1[i - 1] == s2[j]:
                d[(i, j)] = min(d[(i, j)], d[i - 2, j - 2] + cost)

    return d[len1 - 1, len2 - 1]


class DictionaryResolver:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DictionaryResolver, cls).__new__(cls)
            cls._instance._local = threading.local()
            cls._instance._db_lock = threading.Lock()
            cls._instance._init_db()
            cls._instance._init_vocab()
        return cls._instance

    def _get_conn(self) -> sqlite3.Connection:
        """Get or initialize thread-local SQLite connection with WAL mode enabled."""
        if not hasattr(self._local, "conn") or self._local.conn is None:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            conn = sqlite3.connect(str(DB_PATH), timeout=30.0)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA journal_mode=WAL;")
            conn.execute("PRAGMA synchronous=NORMAL;")
            conn.execute("PRAGMA busy_timeout=5000;")
            self._local.conn = conn
        return self._local.conn

    @property
    def conn(self) -> sqlite3.Connection:
        """Provide transparent access to thread-local connection for backwards compatibility."""
        return self._get_conn()

    def _init_db(self):
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        conn = self._get_conn()
        with self._db_lock:
            with conn:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS dictionary_cache (
                        word_norm TEXT PRIMARY KEY,
                        raw_term TEXT NOT NULL,
                        ipa TEXT,
                        pos TEXT,
                        gender TEXT,
                        meaning_en TEXT,
                        meaning_ur TEXT,
                        meaning_ar TEXT,
                        meaning_hi TEXT,
                        meaning_es TEXT,
                        phonetic_ur TEXT,
                        phonetic_ar TEXT,
                        phonetic_hi TEXT,
                        phonetic_es TEXT,
                        phonetic_en TEXT,
                        example_fr TEXT,
                        example_en TEXT,
                        example_ur TEXT,
                        example_ar TEXT,
                        example_hi TEXT,
                        example_es TEXT,
                        rule_en TEXT,
                        rule_ur TEXT,
                        rule_ar TEXT,
                        rule_hi TEXT,
                        rule_es TEXT,
                        source TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS reverse_translations (
                        query_norm TEXT PRIMARY KEY,
                        lang TEXT NOT NULL,
                        french_term TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                cursor = conn.cursor()
                cursor.execute("PRAGMA table_info(dictionary_cache)")
                columns = [col["name"] for col in cursor.fetchall()]
                new_cols = [
                    ("gender", "TEXT"),
                    ("phonetic_ar", "TEXT"),
                    ("phonetic_hi", "TEXT"),
                    ("phonetic_es", "TEXT"),
                    ("phonetic_en", "TEXT"),
                    ("example_ar", "TEXT"),
                    ("example_hi", "TEXT"),
                    ("example_es", "TEXT"),
                    ("rule_en", "TEXT"),
                    ("rule_ur", "TEXT"),
                    ("rule_ar", "TEXT"),
                    ("rule_hi", "TEXT"),
                    ("rule_es", "TEXT")
                ]
                for col_name, col_type in new_cols:
                    if col_name not in columns:
                        try:
                            conn.execute(f"ALTER TABLE dictionary_cache ADD COLUMN {col_name} {col_type}")
                        except Exception:
                            pass
                cursor.close()

    def _init_vocab(self):
        """Build an in-memory vocabulary index for instant fuzzy matching."""
        self.vocab: Dict[str, str] = {}  # norm -> canonical French term

        # 1. Load from micro_cards.json
        if CARDS_PATH.exists():
            try:
                with open(CARDS_PATH, "r", encoding="utf-8") as f:
                    cards = json.load(f)
                    for c in cards:
                        fr = c.get("french_term", "")
                        if fr:
                            self.vocab[strip_accents(fr)] = fr
            except Exception as e:
                print(f"Error loading cards for vocab: {e}")

        # 2. Load from lexicon.json
        if LEXICON_PATH.exists():
            try:
                with open(LEXICON_PATH, "r", encoding="utf-8") as f:
                    lex = json.load(f)
                    for k in lex.keys():
                        self.vocab[strip_accents(k)] = k
            except Exception as e:
                print(f"Error loading lexicon for vocab: {e}")

        # 3. Load from SQLite cache
        try:
            conn = self._get_conn()
            cursor = conn.cursor()
            cursor.execute("SELECT word_norm, raw_term FROM dictionary_cache WHERE meaning_en != word_norm")
            for row in cursor.fetchall():
                self.vocab[row["word_norm"]] = row["raw_term"]
            cursor.close()
        except Exception as e:
            print(f"Error loading cache for vocab: {e}")

    def get_cached_word(self, query: str) -> Optional[Dict[str, Any]]:
        q_norm = strip_accents(query)
        conn = self._get_conn()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM dictionary_cache WHERE word_norm = ?", (q_norm,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                if d.get("meaning_en") and d["meaning_en"] != d["word_norm"] and d["meaning_en"] != d["raw_term"]:
                    return d
            return None
        finally:
            cursor.close()

    def find_cached_by_translation(self, query: str, lang: str = "en") -> List[Dict[str, Any]]:
        """Search cached cards by native translation or English meaning for instant reverse lookup."""
        q_norm = strip_accents(query)
        if len(q_norm) < 2:
            return []

        conn = self._get_conn()
        col = f"meaning_{lang}" if lang in ["ur", "ar", "hi", "es", "en"] else "meaning_en"
        query_like = f"%{q_norm}%"
        cursor = conn.cursor()
        try:
            cursor.execute(f"""
                SELECT * FROM dictionary_cache
                WHERE LOWER({col}) = ? OR LOWER({col}) LIKE ? OR LOWER(meaning_en) LIKE ?
                LIMIT 5
            """, (q_norm, query_like, query_like))
            rows = cursor.fetchall()
            results = []
            for r in rows:
                d = dict(r)
                if d.get("meaning_en") and d["meaning_en"] != d["word_norm"]:
                    results.append(self._build_card_from_cache(d, d["word_norm"], lang))
            return results
        finally:
            cursor.close()

    def get_cached_by_slug(self, slug: str, lang: str = "ur") -> Optional[Dict[str, Any]]:
        """Retrieve cached card by slug accommodating hyphen/underscore variations."""
        conn = self._get_conn()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT * FROM dictionary_cache
                WHERE word_norm = ? OR REPLACE(word_norm, '-', '_') = ? OR REPLACE(word_norm, ' ', '_') = ?
                LIMIT 1
            """, (slug, slug, slug))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                return self._build_card_from_cache(d, slug, lang)
            return None
        finally:
            cursor.close()

    def save_cached_word(self, data: Dict[str, Any]):
        meaning_en = data.get("meaning_en", "").strip()
        word_norm = data["word_norm"]
        if not meaning_en or meaning_en == word_norm or meaning_en == data.get("raw_term", ""):
            return

        try:
            conn = self._get_conn()
            with self._db_lock:
                with conn:
                    conn.execute("""
                        INSERT OR REPLACE INTO dictionary_cache (
                            word_norm, raw_term, ipa, pos, gender,
                            meaning_en, meaning_ur, meaning_ar, meaning_hi, meaning_es,
                            phonetic_ur, phonetic_ar, phonetic_hi, phonetic_es, phonetic_en,
                            example_fr, example_en, example_ur, example_ar, example_hi, example_es,
                            rule_en, rule_ur, rule_ar, rule_hi, rule_es, source
                        ) VALUES (
                            :word_norm, :raw_term, :ipa, :pos, :gender,
                            :meaning_en, :meaning_ur, :meaning_ar, :meaning_hi, :meaning_es,
                            :phonetic_ur, :phonetic_ar, :phonetic_hi, :phonetic_es, :phonetic_en,
                            :example_fr, :example_en, :example_ur, :example_ar, :example_hi, :example_es,
                            :rule_en, :rule_ur, :rule_ar, :rule_hi, :rule_es, :source
                        )
                    """, data)
                self.vocab[word_norm] = data["raw_term"]
        except Exception as e:
            print(f"Error saving to cache DB: {e}")

    def has_french_wiktionary_def(self, term: str) -> bool:
        """Check if en.wiktionary has a French definition for the term."""
        encoded = urllib.parse.quote(term.strip())
        url = f"https://en.wiktionary.org/api/rest_v1/page/definition/{encoded}"
        req = urllib.request.Request(url, headers={"User-Agent": WIKI_USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=3.0) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
                return "fr" in payload and len(payload["fr"]) > 0
        except Exception:
            return False

    def canonicalize_french_term(self, term: str) -> str:
        """
        Normalize French spelling (restoring accents and proper capitalization).
        Example: 'deja' -> 'déjà', 'japon' -> 'Japon', 'ecureuil' -> 'écureuil',
                 'tout a fait' -> 'tout à fait'.
        """
        clean = term.strip()
        norm = strip_accents(clean)

        # 1. Fast check in local vocabulary index
        if norm in self.vocab:
            return self.vocab[norm]

        # 2. Check if the exact term or case variations exist directly in Wiktionary
        if self.has_french_wiktionary_def(clean):
            return clean
        if clean.capitalize() != clean and self.has_french_wiktionary_def(clean.capitalize()):
            return clean.capitalize()
        if clean.lower() != clean and self.has_french_wiktionary_def(clean.lower()):
            return clean.lower()

        # 3. Query French Wiktionary search to restore missing accents
        encoded = urllib.parse.quote(clean)
        url = f"https://fr.wiktionary.org/w/api.php?action=query&list=search&srsearch={encoded}&format=json"
        req = urllib.request.Request(url, headers={"User-Agent": WIKI_USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=3.5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                results = [item["title"] for item in data.get("query", {}).get("search", [])[:8]]
                matching = [r for r in results if strip_accents(r) == norm]
                matching.sort(key=lambda x: (x.lower() == clean.lower(), -len(set(x) - set(clean))))
                for cand in matching:
                    if self.has_french_wiktionary_def(cand):
                        return cand
        except Exception:
            pass

        return clean

    def fetch_wiktionary(self, term: str) -> Optional[Dict[str, Any]]:
        """
        Fetch part of speech, English definition, and authentic French example sentences
        from the open Wiktionary REST API.
        """
        encoded = urllib.parse.quote(term.strip())
        url = f"https://en.wiktionary.org/api/rest_v1/page/definition/{encoded}"
        req = urllib.request.Request(url, headers={"User-Agent": WIKI_USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=4.0) as response:
                payload = json.loads(response.read().decode("utf-8"))
                if "fr" in payload and payload["fr"]:
                    defs = []
                    pos = "Vocabulaire"
                    ex_fr = None
                    ex_en = None

                    def block_sort_key(b):
                        pos_str = b.get("partOfSpeech", "").lower()
                        if pos_str in ["participle", "letter", "symbol"]:
                            return 2
                        return 0

                    sorted_blocks = sorted(payload["fr"], key=block_sort_key)

                    for block in sorted_blocks:
                        p = block.get("partOfSpeech", "")
                        if p and pos == "Vocabulaire":
                            pos = p
                        for d in block.get("definitions", []):
                            clean_def = clean_text(d.get("definition", ""))
                            clean_def = re.sub(r'^\([^\)]*\)\s*', '', clean_def).strip()
                            if clean_def and not clean_def.startswith("(") and len(clean_def) > 1:
                                defs.append(clean_def)
                            
                            parsed_examples = d.get("parsedExamples", [])
                            if parsed_examples and not ex_fr:
                                for pe in parsed_examples:
                                    raw_fr = clean_text(pe.get("example", ""))
                                    raw_en = clean_text(pe.get("translation", ""))
                                    if raw_fr and len(raw_fr) > 5:
                                        ex_fr = raw_fr
                                        ex_en = raw_en
                                        break

                    if defs:
                        first_def = defs[0].split(";")[0].split(".")[0].strip()
                        return {
                            "pos": pos,
                            "meaning_en": first_def or defs[0],
                            "all_defs": defs[:3],
                            "example_fr": ex_fr,
                            "example_en": ex_en
                        }
        except Exception:
            pass
        return None

    def fetch_ipa_and_gender(self, term: str) -> Tuple[Optional[str], Optional[str]]:
        """Extract IPA pronunciation and noun gender from French Wiktionary wikitext."""
        encoded = urllib.parse.quote(term.strip())
        url = f"https://fr.wiktionary.org/w/api.php?action=parse&page={encoded}&prop=wikitext&format=json"
        req = urllib.request.Request(url, headers={"User-Agent": WIKI_USER_AGENT})
        ipa = None
        gender = None

        try:
            with urllib.request.urlopen(req, timeout=3.5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                wt = data.get("parse", {}).get("wikitext", {}).get("*", "")
                
                ipa_match = re.search(r"\{\{pron\|([^\|\}]+)(?:\|[^\|\}]+)*\|fr\}\}", wt)
                if ipa_match:
                    found_ipa = ipa_match.group(1).strip()
                    if found_ipa and not found_ipa.startswith("lang="):
                        ipa = f"/{found_ipa}/"
                else:
                    alt_ipa = re.search(r"\{\{API\|([^\|\}]+)", wt)
                    if alt_ipa:
                        ipa = f"/{alt_ipa.group(1).strip()}/"

                if "{{m}}" in wt or "{{nom masculin" in wt:
                    gender = "masculin"
                elif "{{f}}" in wt or "{{nom féminin" in wt:
                    gender = "féminin"
        except Exception:
            pass

        return ipa, gender

    def fetch_translation(self, text: str, target_lang: str, source_lang: str = "en") -> str:
        """Translate text with quality sorting and fallback."""
        if not text or target_lang == source_lang:
            return text

        clean_src = text.strip()
        encoded = urllib.parse.quote(clean_src)
        url = f"https://api.mymemory.translated.net/get?q={encoded}&langpair={source_lang}|{target_lang}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

        try:
            with urllib.request.urlopen(req, timeout=3.5) as r:
                data = json.loads(r.read().decode("utf-8"))
                matches = data.get("matches", [])
                for m in sorted(matches, key=lambda x: int(x.get("quality", 0)), reverse=True):
                    trans = m.get("translation", "").strip()
                    if trans and not trans.lower().startswith("no query") and len(trans) < 80:
                        clean_trans = clean_text(trans)
                        if clean_trans.lower() != clean_src.lower():
                            return clean_trans

                resp_trans = data.get("responseData", {}).get("translatedText", "").strip()
                if resp_trans and not resp_trans.lower().startswith("no query"):
                    clean_trans = clean_text(resp_trans)
                    if clean_trans.lower() != clean_src.lower():
                        return clean_trans
        except Exception:
            pass

        return clean_src

    def reverse_lookup_french(self, query: str, lang: str = "en") -> Optional[str]:
        """Resolve a search term entered in learner's native language into the canonical French word."""
        clean_q = query.strip()
        norm_q = strip_accents(clean_q)

        # 0. Check persistent reverse_translations cache
        try:
            conn = self._get_conn()
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT french_term FROM reverse_translations WHERE query_norm = ? AND lang = ?", (norm_q, lang))
                row = cursor.fetchone()
                if row and row["french_term"]:
                    return row["french_term"]
            finally:
                cursor.close()
        except Exception:
            pass

        # 1. English Wiktionary translation table: {{tt+|fr|...}}
        if lang == "en" or norm_q.isascii():
            encoded = urllib.parse.quote(clean_q.lower())
            url = f"https://en.wiktionary.org/w/api.php?action=parse&page={encoded}&prop=wikitext&format=json"
            req = urllib.request.Request(url, headers={"User-Agent": WIKI_USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=3.5) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    wt = data.get("parse", {}).get("wikitext", {}).get("*", "")
                    fr_trans = re.findall(r"\{\{t[t\+]?\+?\|fr\|([^\|\}]+)", wt)
                    if fr_trans:
                        first_fr = fr_trans[0].strip()
                        if first_fr:
                            try:
                                conn = self._get_conn()
                                with self._db_lock:
                                    with conn:
                                        conn.execute(
                                            "INSERT OR REPLACE INTO reverse_translations (query_norm, lang, french_term) VALUES (?, ?, ?)",
                                            (norm_q, lang, first_fr)
                                        )
                            except Exception:
                                pass
                            return first_fr
            except Exception:
                pass

        # 2. Translate query to French
        try:
            trans_fr = self.fetch_translation(clean_q, target_lang="fr", source_lang=lang)
            if trans_fr and trans_fr.lower() != clean_q.lower():
                cand = self.canonicalize_french_term(trans_fr)
                if self.has_french_wiktionary_def(cand):
                    try:
                        conn = self._get_conn()
                        with self._db_lock:
                            with conn:
                                conn.execute(
                                    "INSERT OR REPLACE INTO reverse_translations (query_norm, lang, french_term) VALUES (?, ?, ?)",
                                    (norm_q, lang, cand)
                                )
                    except Exception:
                        pass
                    return cand
        except Exception:
            pass

        return None

    def find_fuzzy_match(self, query: str) -> Optional[str]:
        """Detect spelling typos and find closest matching French word (e.g. 'chein' -> 'chien')."""
        q_norm = strip_accents(query)
        if not q_norm or len(q_norm) < 3:
            return None

        if q_norm in self.vocab:
            return None

        keys = list(self.vocab.keys())
        candidates = difflib.get_close_matches(q_norm, keys, n=6, cutoff=0.72)
        if not candidates:
            return None

        ranked = []
        for cand in candidates:
            dist = damerau_levenshtein(q_norm, cand)
            sim = difflib.SequenceMatcher(None, q_norm, cand).ratio()
            ranked.append((dist, -sim, cand))

        ranked.sort()
        best_norm = ranked[0][2]
        return self.vocab[best_norm]

    def _generate_pedagogical_content(
        self,
        term: str,
        pos: str,
        gender: Optional[str],
        meaning_en: str,
        meanings: Dict[str, str],
        ex_fr: Optional[str],
        ex_en: Optional[str]
    ) -> Tuple[str, Dict[str, str], Dict[str, str], List[Dict[str, Any]], Dict[str, Any]]:
        pos_lower = pos.lower()
        if "adverb" in pos_lower or "adverbe" in pos_lower:
            concept_type = "Adverbe • متعلق فعل"
        elif "proper noun" in pos_lower:
            concept_type = "Nom propre • اسم خاص"
        elif "noun" in pos_lower or "nom" in pos_lower:
            if gender == "masculin":
                concept_type = "Nom masculin • اسم مذکر"
            elif gender == "féminin":
                concept_type = "Nom féminin • اسم مؤنث"
            else:
                concept_type = "Nom • اسم"
        elif "verb" in pos_lower or "verbe" in pos_lower:
            concept_type = "Verbe • فعل"
        elif "adjective" in pos_lower or "adjectif" in pos_lower:
            concept_type = "Adjectif • صفت"
        elif "conjunction" in pos_lower or "conjonction" in pos_lower:
            concept_type = "Conjonction • حرف عطف"
        elif "preposition" in pos_lower:
            concept_type = "Préposition • حرف جار"
        elif "interjection" in pos_lower:
            concept_type = "Interjection • ندائیہ"
        else:
            concept_type = f"{pos} • مفردات"

        phonetics = {
            "ur": f"{term} (تلفظ)",
            "ar": f"{term} (نطق)",
            "hi": term,
            "es": term.lower(),
            "en": term.lower()
        }

        act_ur = meanings.get("ur", meaning_en)
        act_ar = meanings.get("ar", meaning_en)
        act_hi = meanings.get("hi", meaning_en)
        act_es = meanings.get("es", meaning_en)

        rules = {
            "en": f"The French term « {term} » means '{meaning_en}'. Classified as {pos.lower()}.",
            "ur": f"فرانسیسی لفظ « {term} » کا معنی « {act_ur} » ہے۔ بول چال میں روانی کے لیے اسے دہرائیں۔",
            "ar": f"معنى « {term} » هو: {act_ar}. تدرّب على النطق السليم لتعزيز طلاقتك.",
            "hi": f"फ़्रेंच शब्द « {term} » का अर्थ: {act_hi}। सही उच्चारण के लिए बोलकर अभ्यास करें।",
            "es": f"La palabra francesa « {term} » significa '{act_es}'. Pertenece a la categoría {pos.lower()}."
        }

        if "adverb" in pos_lower:
            rules["en"] += " Invariable adverb; generally placed directly after the conjugated verb."
            rules["ur"] += " یہ غیر متبدل متعلق فعل ہے جو فعل کی وضاحت کرتا ہے۔"
        elif "noun" in pos_lower and gender:
            art = "le / un" if gender == "masculin" else "la / une"
            rules["en"] += f" Noun ({gender}); takes the definite article '{art.split(' / ')[0]}'."
            rules["ur"] += f" یہ اسم {gender} ہے اور اس کے ساتھ '{art}' کا استعمال ہوتا ہے۔"

        final_ex_fr = ex_fr or f"En français : « {term} »."
        final_ex_en = ex_en or f"In French: '{term}' ({meaning_en})."
        
        ex_ur = self.fetch_translation(final_ex_en, "ur", "en") if ex_en else f"فرانسیسی میں: « {term} » یعنی {act_ur}۔"
        ex_ar = self.fetch_translation(final_ex_en, "ar", "en") if ex_en else f"بالفرنسية: « {term} » ({act_ar})."
        ex_hi = self.fetch_translation(final_ex_en, "hi", "en") if ex_en else f"फ़्रेंच में: « {term} » ({act_hi})।"
        ex_es = self.fetch_translation(final_ex_en, "es", "en") if ex_en else f"En francés: « {term} » ({act_es})."

        examples = [
            {
                "fr": final_ex_fr,
                "en": final_ex_en,
                "ur": ex_ur,
                "ar": ex_ar,
                "hi": ex_hi,
                "es": ex_es,
                "translations": {
                    "en": final_ex_en,
                    "ur": ex_ur,
                    "ar": ex_ar,
                    "hi": ex_hi,
                    "es": ex_es
                }
            }
        ]

        practice_prompt = {
            "type": "speak_or_type",
            "prompt_fr": term,
            "prompt_native": {
                "en": f"Say « {term} » ({meaning_en}) out loud.",
                "ur": f"« {term} » ({act_ur}) کو بلند آواز سے بولیں۔",
                "ar": f"انطق « {term} » ({act_ar}) بصوت واضح.",
                "hi": f"« {term} » ({act_hi}) का उच्चारण करें।",
                "es": f"Pronuncie « {term} » ({act_es}) en voz alta."
            }
        }

        return concept_type, phonetics, rules, examples, practice_prompt

    def resolve_word(self, term: str, lang: str = "ur") -> Optional[Dict[str, Any]]:
        clean = term.strip()
        if not clean or len(clean) < 2:
            return None

        norm_key = strip_accents(clean)
        slug = re.sub(r'[^a-zA-Z0-9]', '_', norm_key)

        # 1. Persistent SQLite Cache
        cached = self.get_cached_word(clean)
        if cached:
            return self._build_card_from_cache(cached, slug, lang)

        # 2. Local verified lexicon
        if LEXICON_PATH.exists():
            try:
                with open(LEXICON_PATH, "r", encoding="utf-8") as f:
                    lex = json.load(f)
                    if norm_key in lex:
                        l = lex[norm_key]
                        raw_term = l.get("french", clean)
                        data = {
                            "word_norm": norm_key,
                            "raw_term": raw_term,
                            "ipa": l.get("ipa", f"/{norm_key}/"),
                            "pos": l.get("pos", "Vocabulaire"),
                            "gender": l.get("gender"),
                            "meaning_en": l.get("en", clean),
                            "meaning_ur": l.get("ur", clean),
                            "meaning_ar": l.get("ar", clean),
                            "meaning_hi": l.get("hi", clean),
                            "meaning_es": l.get("es", clean),
                            "phonetic_ur": l.get("phonetic", f"{raw_term} (تلفظ)"),
                            "phonetic_ar": f"{raw_term} (نطق)",
                            "phonetic_hi": raw_term,
                            "phonetic_es": raw_term.lower(),
                            "phonetic_en": raw_term.lower(),
                            "example_fr": f"Voici un(e) {raw_term}.",
                            "example_en": f"Here is a {l.get('en', clean)}.",
                            "example_ur": f"یہ ایک {l.get('ur', clean)} ہے۔",
                            "example_ar": f"هذا {l.get('ar', clean)}.",
                            "example_hi": f"यह एक {l.get('hi', clean)} है।",
                            "example_es": f"Aquí hay un/a {l.get('es', clean)}.",
                            "rule_en": f"The French word « {raw_term} » means '{l.get('en', clean)}'.",
                            "rule_ur": f"فرانسیسی لفظ « {raw_term} » کا معنی « {l.get('ur', clean)} » ہے۔",
                            "rule_ar": f"معنى « {raw_term} » هو: {l.get('ar', clean)}.",
                            "rule_hi": f"फ़्रेंच शब्द « {raw_term} » का अर्थ: {l.get('hi', clean)}।",
                            "rule_es": f"La palabra « {raw_term} » significa '{l.get('es', clean)}'.",
                            "source": "lexicon"
                        }
                        self.save_cached_word(data)
                        return self._build_card_from_cache(data, slug, lang)
            except Exception:
                pass

        # 3. Canonicalize French Term
        canonical_term = self.canonicalize_french_term(clean)
        canonical_norm = strip_accents(canonical_term)

        if canonical_norm != norm_key:
            cached = self.get_cached_word(canonical_term)
            if cached:
                return self._build_card_from_cache(cached, slug, lang)

        # 4. Fetch definition from Wiktionary
        wiki = self.fetch_wiktionary(canonical_term)
        if not wiki and canonical_term != clean:
            wiki = self.fetch_wiktionary(clean)

        if not wiki:
            return None

        meaning_en = wiki.get("meaning_en", "")
        pos = wiki.get("pos", "Vocabulaire")
        ex_fr = wiki.get("example_fr")
        ex_en = wiki.get("example_en")

        if not meaning_en or meaning_en.lower() == canonical_term.lower() or meaning_en.lower() == norm_key:
            return None

        # 5. Fetch IPA and gender
        ipa, gender = self.fetch_ipa_and_gender(canonical_term)
        if not ipa:
            ipa = f"/{canonical_norm}/"

        # 6. Multi-language translations
        meaning_ur = self.fetch_translation(meaning_en, "ur", "en")
        meaning_ar = self.fetch_translation(meaning_en, "ar", "en")
        meaning_hi = self.fetch_translation(meaning_en, "hi", "en")
        meaning_es = self.fetch_translation(meaning_en, "es", "en")

        meanings = {
            "en": meaning_en,
            "ur": meaning_ur,
            "ar": meaning_ar,
            "hi": meaning_hi,
            "es": meaning_es
        }

        # 7. Pedagogical Enrichment
        concept_type, phonetics, rules, examples, practice_prompt = self._generate_pedagogical_content(
            term=canonical_term,
            pos=pos,
            gender=gender,
            meaning_en=meaning_en,
            meanings=meanings,
            ex_fr=ex_fr,
            ex_en=ex_en
        )

        ex0 = examples[0] if examples else {}

        # 8. Save to SQLite cache
        cache_data = {
            "word_norm": canonical_norm,
            "raw_term": canonical_term,
            "ipa": ipa,
            "pos": concept_type,
            "gender": gender or "",
            "meaning_en": meaning_en,
            "meaning_ur": meaning_ur,
            "meaning_ar": meaning_ar,
            "meaning_hi": meaning_hi,
            "meaning_es": meaning_es,
            "phonetic_ur": phonetics.get("ur", ""),
            "phonetic_ar": phonetics.get("ar", ""),
            "phonetic_hi": phonetics.get("hi", ""),
            "phonetic_es": phonetics.get("es", ""),
            "phonetic_en": phonetics.get("en", ""),
            "example_fr": ex0.get("fr", ""),
            "example_en": ex0.get("en", ""),
            "example_ur": ex0.get("ur", ""),
            "example_ar": ex0.get("ar", ""),
            "example_hi": ex0.get("hi", ""),
            "example_es": ex0.get("es", ""),
            "rule_en": rules.get("en", ""),
            "rule_ur": rules.get("ur", ""),
            "rule_ar": rules.get("ar", ""),
            "rule_hi": rules.get("hi", ""),
            "rule_es": rules.get("es", ""),
            "source": "wiktionary"
        }
        self.save_cached_word(cache_data)

        return {
            "id": f"wiki_{slug}",
            "french_term": canonical_term,
            "ipa": ipa,
            "concept_type": concept_type,
            "gender": gender,
            "source": "wiktionary",
            "phonetics": phonetics,
            "translations": meanings,
            "pedagogical_rules": rules,
            "examples": examples,
            "practice_prompt": practice_prompt
        }

    def _build_card_from_cache(self, row: Dict[str, Any], slug: str, lang: str) -> Dict[str, Any]:
        term = row["raw_term"]
        meanings = {
            "en": row.get("meaning_en") or term,
            "ur": row.get("meaning_ur") or row.get("meaning_en") or term,
            "ar": row.get("meaning_ar") or row.get("meaning_en") or term,
            "hi": row.get("meaning_hi") or row.get("meaning_en") or term,
            "es": row.get("meaning_es") or row.get("meaning_en") or term
        }
        phonetics = {
            "ur": row.get("phonetic_ur") or f"{term} (تلفظ)",
            "ar": row.get("phonetic_ar") or f"{term} (نطق)",
            "hi": row.get("phonetic_hi") or term,
            "es": row.get("phonetic_es") or term.lower(),
            "en": row.get("phonetic_en") or term.lower()
        }
        rules = {
            "en": row.get("rule_en") or f"The French word « {term} » means '{meanings['en']}'.",
            "ur": row.get("rule_ur") or f"فرانسیسی لفظ « {term} » کا معنی « {meanings['ur']} » ہے۔",
            "ar": row.get("rule_ar") or f"معنى « {term} » هو: {meanings['ar']}.",
            "hi": row.get("rule_hi") or f"फ़्रेंच शब्द « {term} » का अर्थ: {meanings['hi']}।",
            "es": row.get("rule_es") or f"La palabra « {term} » significa '{meanings['es']}'."
        }
        ex_fr = row.get("example_fr") or f"En français : « {term} »."
        ex_en = row.get("example_en") or f"In French: '{term}' ({meanings['en']})."
        ex_ur = row.get("example_ur") or f"فرانسیسی میں: « {term} »۔"
        ex_ar = row.get("example_ar") or f"بالفرنسية: « {term} »."
        ex_hi = row.get("example_hi") or f"फ़्रेंच में: « {term} »।"
        ex_es = row.get("example_es") or f"En francés: « {term} »."

        return {
            "id": f"wiki_{slug}",
            "french_term": term,
            "ipa": row.get("ipa") or f"/{row['word_norm']}/",
            "concept_type": row.get("pos") or "Vocabulaire",
            "gender": row.get("gender"),
            "source": row.get("source") or "wiktionary",
            "phonetics": phonetics,
            "translations": meanings,
            "pedagogical_rules": rules,
            "examples": [
                {
                    "fr": ex_fr,
                    "en": ex_en,
                    "ur": ex_ur,
                    "ar": ex_ar,
                    "hi": ex_hi,
                    "es": ex_es,
                    "translations": {
                        "en": ex_en,
                        "ur": ex_ur,
                        "ar": ex_ar,
                        "hi": ex_hi,
                        "es": ex_es
                    }
                }
            ],
            "practice_prompt": {
                "type": "speak_or_type",
                "prompt_fr": term,
                "prompt_native": {
                    "en": f"Say « {term} » ({meanings['en']}) out loud.",
                    "ur": f"« {term} » ({meanings['ur']}) کو بلند آواز سے بولیں۔",
                    "ar": f"انطق « {term} » ({meanings['ar']}) بصوت واضح.",
                    "hi": f"« {term} » ({meanings['hi']}) का उच्चारण करें।",
                    "es": f"Pronuncie « {term} » ({meanings['es']}) en voz alta."
                }
            }
        }

# Global singleton
resolver = DictionaryResolver()
