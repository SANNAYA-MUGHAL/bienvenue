export const KNOWLEDGE_GRAPH = {
  "cefr_level": "A1",
  "overall_progress": 48,
  "total_nodes": 9,
  "mastered_nodes": 4,
  "nodes": [
    {
      "id": "node_greetings",
      "cefr_level": "A1",
      "title_fr": "Les Salutations & La Politesse",
      "category": "Foundations",
      "status": "mastered",
      "mastery_percentage": 100,
      "prerequisites": []
    },
    {
      "id": "node_tu_vs_vous",
      "cefr_level": "A1",
      "title_fr": "Tu vs Vous (Formes d'Adresse)",
      "category": "Social Pragmatics",
      "status": "mastered",
      "mastery_percentage": 100,
      "prerequisites": ["node_greetings"]
    },
    {
      "id": "node_etre_copula",
      "cefr_level": "A1",
      "title_fr": "Le Verbe Être (Identité & État)",
      "category": "Verbs",
      "status": "in_progress",
      "mastery_percentage": 75,
      "prerequisites": ["node_greetings"]
    },
    {
      "id": "node_avoir_possession_age",
      "cefr_level": "A1",
      "title_fr": "Le Verbe Avoir (Âge & Faim)",
      "category": "Verbs",
      "status": "review_due",
      "mastery_percentage": 60,
      "prerequisites": ["node_etre_copula"]
    },
    {
      "id": "node_articles_gender",
      "cefr_level": "A1",
      "title_fr": "Les Articles & Le Genre",
      "category": "Grammar",
      "status": "mastered",
      "mastery_percentage": 90,
      "prerequisites": ["node_etre_copula"]
    },
    {
      "id": "node_survival_boulangerie",
      "cefr_level": "A1",
      "title_fr": "La Boulangerie (Commander)",
      "category": "Survival",
      "status": "mastered",
      "mastery_percentage": 85,
      "prerequisites": ["node_greetings"]
    },
    {
      "id": "node_survival_pharmacie",
      "cefr_level": "A1",
      "title_fr": "La Pharmacie (Santé)",
      "category": "Survival",
      "status": "in_progress",
      "mastery_percentage": 40,
      "prerequisites": ["node_avoir_possession_age"]
    },
    {
      "id": "node_survival_transport",
      "cefr_level": "A1",
      "title_fr": "Le Métro & Les Billets",
      "category": "City Navigation",
      "status": "in_progress",
      "mastery_percentage": 30,
      "prerequisites": ["node_greetings"]
    },
    {
      "id": "node_survival_admin_caf",
      "cefr_level": "A1",
      "title_fr": "L'Administration & La CAF",
      "category": "Bureaucracy",
      "status": "in_progress",
      "mastery_percentage": 25,
      "prerequisites": ["node_articles_gender"]
    }
  ]
};
