-- Enable the "uuid-ossp" extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR UNIQUE,
    ime_prezime VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    telefon VARCHAR,
    datum_registracije TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    naziv VARCHAR NOT NULL,
    ikona_url VARCHAR
);

-- Table: tradesmen (Majstori)
CREATE TABLE IF NOT EXISTS tradesmen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    korisnik_id UUID REFERENCES users(id) ON DELETE CASCADE,
    naziv_firme_ili_obrta VARCHAR NOT NULL,
    kategorija_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    grad VARCHAR NOT NULL,
    opis TEXT,
    prosjecna_ocjena DECIMAL(3, 2) DEFAULT 0.00
);

-- Table: services (Usluge)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    majstor_id UUID NOT NULL REFERENCES tradesmen(id) ON DELETE CASCADE,
    naziv_usluge VARCHAR NOT NULL,
    cijena DECIMAL(10, 2) NOT NULL,
    jedinica_mjere VARCHAR NOT NULL
);

-- Table: reviews (Recenzije)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    majstor_id UUID NOT NULL REFERENCES tradesmen(id) ON DELETE CASCADE,
    korisnik_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ocjena INTEGER NOT NULL CHECK (ocjena >= 1 AND ocjena <= 5),
    komentar TEXT,
    datum_objave TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Security: Enable Row Level Security (RLS) to block unauthorized direct Supabase API access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tradesmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
