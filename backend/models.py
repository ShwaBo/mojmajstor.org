from sqlalchemy import Column, String, Integer, Decimal, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String, unique=True, nullable=True)
    ime_prezime = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    telefon = Column(String, nullable=True)
    datum_registracije = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tradesmen = relationship("Tradesman", back_populates="user", cascade="all, delete")
    reviews = relationship("Review", back_populates="user", cascade="all, delete")

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    naziv = Column(String, nullable=False)
    ikona_url = Column(String, nullable=True)

    # Relationships
    tradesmen = relationship("Tradesman", back_populates="category", cascade="all, delete-orphan")

class Tradesman(Base):
    __tablename__ = "tradesmen"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    korisnik_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    naziv_firme_ili_obrta = Column(String, nullable=False)
    kategorija_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    grad = Column(String, nullable=False)
    opis = Column(Text, nullable=True)
    prosjecna_ocjena = Column(Decimal(3, 2), default=0.00)

    # Relationships
    user = relationship("User", back_populates="tradesmen")
    category = relationship("Category", back_populates="tradesmen")
    services = relationship("Service", back_populates="tradesman", cascade="all, delete")
    reviews = relationship("Review", back_populates="tradesman", cascade="all, delete")

class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    majstor_id = Column(UUID(as_uuid=True), ForeignKey("tradesmen.id", ondelete="CASCADE"), nullable=False)
    naziv_usluge = Column(String, nullable=False)
    cijena = Column(Decimal(10, 2), nullable=False)
    jedinica_mjere = Column(String, nullable=False)

    # Relationships
    tradesman = relationship("Tradesman", back_populates="services")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    majstor_id = Column(UUID(as_uuid=True), ForeignKey("tradesmen.id", ondelete="CASCADE"), nullable=False)
    korisnik_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ocjena = Column(Integer, nullable=False)
    komentar = Column(Text, nullable=True)
    datum_objave = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tradesman = relationship("Tradesman", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
