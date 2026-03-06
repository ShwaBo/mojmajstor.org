from pydantic import BaseModel, ConfigDict, Field
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
    adresa: Optional[str] = None
    telefon: Optional[str] = None
    website: Optional[str] = None
    google_maps_url: Optional[str] = None
    verified: Optional[bool] = False
    lat: Optional[float] = None
    lng: Optional[float] = None

class TradesmanCreate(TradesmanBase):
    korisnik_id: Optional[UUID] = None

class TradesmanResponse(TradesmanBase):
    id: UUID
    korisnik_id: Optional[UUID]
    prosjecna_ocjena: Decimal
    category: Optional[CategoryResponse] = Field(None, alias="category_id")
    
    model_config = ConfigDict(from_attributes=True)

class TradesmanDetailResponse(TradesmanResponse):
    services: List[ServiceResponse] = []
    reviews: List[ReviewResponse] = []
