from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from decimal import Decimal

# ==== Category ====
class CategoryBase(BaseModel):
    naziv: str
    ikona_url: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# ==== Service ====
class ServiceBase(BaseModel):
    naziv_usluge: str
    cijena: Decimal
    jedinica_mjere: str

class ServiceCreate(ServiceBase):
    majstor_id: UUID

class ServiceResponse(ServiceBase):
    id: UUID
    majstor_id: UUID
    model_config = ConfigDict(from_attributes=True)

# ==== Review ====
class ReviewBase(BaseModel):
    ocjena: int
    komentar: Optional[str] = None

class ReviewCreate(ReviewBase):
    majstor_id: UUID
    korisnik_id: UUID

class ReviewResponse(ReviewBase):
    id: UUID
    majstor_id: UUID
    korisnik_id: UUID
    datum_objave: datetime
    model_config = ConfigDict(from_attributes=True)

# ==== Tradesman ====
class TradesmanBase(BaseModel):
    naziv_firme_ili_obrta: str
    grad: str
    opis: Optional[str] = None
    kategorija_id: Optional[UUID] = None

class TradesmanCreate(TradesmanBase):
    korisnik_id: Optional[UUID] = None

class TradesmanResponse(TradesmanBase):
    id: UUID
    korisnik_id: Optional[UUID]
    prosjecna_ocjena: Decimal
    category: Optional[CategoryResponse] = None
    
    model_config = ConfigDict(from_attributes=True)

class TradesmanDetailResponse(TradesmanResponse):
    services: List[ServiceResponse] = []
    reviews: List[ReviewResponse] = []
