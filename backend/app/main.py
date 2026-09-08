"""
Main FastAPI Application Entrypoint for Bienvenue.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import search, pedagogy, survival, progress

app = FastAPI(
    title="Bienvenue API",
    description="French in the language you understand — Contrastive Multilingual Engine",
    version="1.0.0"
)

# Enable CORS for local web client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(search.router)
app.include_router(pedagogy.router)
app.include_router(survival.router)
app.include_router(progress.router)

@app.get("/")
def read_root():
    return {
        "app": "Bienvenue",
        "tagline": "French in the language you understand",
        "status": "healthy",
        "supported_languages": ["ur", "ar", "hi", "es", "en"],
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
