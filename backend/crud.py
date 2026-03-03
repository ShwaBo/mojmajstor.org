from sqlalchemy.orm import Session
import models
import schemas
from uuid import UUID

def get_tradesmen(db: Session, grad: str = None, kategorija_id: UUID = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Tradesman)
    if grad:
        query = query.filter(models.Tradesman.grad.ilike(f"%{grad}%"))
    if kategorija_id:
        query = query.filter(models.Tradesman.kategorija_id == kategorija_id)
    return query.offset(skip).limit(limit).all()

def get_tradesman(db: Session, tradesman_id: UUID):
    return db.query(models.Tradesman).filter(models.Tradesman.id == tradesman_id).first()

def create_tradesman(db: Session, tradesman: schemas.TradesmanCreate):
    db_tradesman = models.Tradesman(**tradesman.model_dump())
    db.add(db_tradesman)
    db.commit()
    db.refresh(db_tradesman)
    return db_tradesman

def get_categories(db: Session):
    return db.query(models.Category).all()

def create_category(db: Session, category: schemas.CategoryBase):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def create_review(db: Session, review: schemas.ReviewCreate):
    db_review = models.Review(**review.model_dump())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_services_for_tradesman(db: Session, tradesman_id: UUID):
    return db.query(models.Service).filter(models.Service.majstor_id == tradesman_id).all()
