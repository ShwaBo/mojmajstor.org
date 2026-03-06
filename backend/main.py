from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

import models
import schemas
import crud
from database import get_db
from scraper import run_scraper

# Create tables if they don't exist (useful for MVP, though Supabase is already initialized)
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="mojmajstor.org API",
    description="API za pronalaženje majstora u BiH",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Dobrodošli na mojmajstor.org API"}

@app.get("/categories/", response_model=List[schemas.CategoryResponse])
def read_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

@app.post("/categories/", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryBase, db: Session = Depends(get_db)):
    return crud.create_category(db=db, category=category)

@app.get("/tradesmen/", response_model=List[schemas.TradesmanResponse])
def read_tradesmen(
    grad: str = None, 
    kategorija_id: UUID = None, 
    verified: bool = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return crud.get_tradesmen(db, grad=grad, kategorija_id=kategorija_id, verified=verified, skip=skip, limit=limit)

@app.post("/tradesmen/", response_model=schemas.TradesmanResponse)
def create_tradesman(tradesman: schemas.TradesmanCreate, db: Session = Depends(get_db)):
    return crud.create_tradesman(db=db, tradesman=tradesman)

@app.get("/tradesmen/{tradesman_id}", response_model=schemas.TradesmanDetailResponse)
def read_tradesman(tradesman_id: UUID, db: Session = Depends(get_db)):
    db_tradesman = crud.get_tradesman(db, tradesman_id=tradesman_id)
    if db_tradesman is None:
        raise HTTPException(status_code=404, detail="Majstor nije pronađen")
    return db_tradesman

@app.post("/tradesmen/{tradesman_id}/click")
def increment_tradesman_clicks(tradesman_id: UUID, db: Session = Depends(get_db)):
    result = crud.increment_tradesman_clicks(db, tradesman_id=tradesman_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Majstor nije pronađen")
    return {"message": "Click recorded successfully", "new_clicks": result.get("broj_klikova")}

from auth import require_auth

@app.post("/reviews/", response_model=schemas.ReviewResponse)
def create_review(review: schemas.ReviewCreate, clerk_id: str = Depends(require_auth), db: Session = Depends(get_db)):
    # Verify the user making the request actually exists via clerk_id or just insert
    return crud.create_review(db=db, review=review)

@app.post("/admin/scrape")
def trigger_scraper(background_tasks: BackgroundTasks, test_mode: bool = True):
    from scraper import run_scraper
    # This endpoint simply triggers the scraping job in the background and returns immediately
    background_tasks.add_task(run_scraper, test_mode)
    return {"message": "Scraping task started in the background", "test_mode": test_mode}
