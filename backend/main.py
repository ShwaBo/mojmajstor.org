from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

import models
import schemas
import crud
from database import get_db

# Create tables if they don't exist (useful for MVP, though Supabase is already initialized)
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="mojmajstor.org API",
    description="API za pronalaženje majstora u BiH",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
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
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return crud.get_tradesmen(db, grad=grad, kategorija_id=kategorija_id, skip=skip, limit=limit)

@app.post("/tradesmen/", response_model=schemas.TradesmanResponse)
def create_tradesman(tradesman: schemas.TradesmanCreate, db: Session = Depends(get_db)):
    return crud.create_tradesman(db=db, tradesman=tradesman)

@app.get("/tradesmen/{tradesman_id}", response_model=schemas.TradesmanDetailResponse)
def read_tradesman(tradesman_id: UUID, db: Session = Depends(get_db)):
    db_tradesman = crud.get_tradesman(db, tradesman_id=tradesman_id)
    if db_tradesman is None:
        raise HTTPException(status_code=404, detail="Majstor nije pronađen")
    return db_tradesman

from auth import require_auth

@app.post("/reviews/", response_model=schemas.ReviewResponse)
def create_review(review: schemas.ReviewCreate, clerk_id: str = Depends(require_auth), db: Session = Depends(get_db)):
    # Verify the user making the request actually exists via clerk_id or just insert
    return crud.create_review(db=db, review=review)
