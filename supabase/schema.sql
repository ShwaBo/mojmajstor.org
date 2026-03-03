-- Omogućavanje UUID ekstenzije
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Korisnici (Users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR UNIQUE, -- ID iz Clerk sistema za povezivanje
    ime_prezime VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    telefon VARCHAR,
    datum_registracije TIMESTAMP DEFAULT NOW()
);

-- 2. Kategorije (Categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    naziv VARCHAR NOT NULL,
    ikona_url VARCHAR
);

-- 3. Majstori (Profiles/Tradesmen)
CREATE TABLE tradesmen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    korisnik_id UUID REFERENCES users(id) ON DELETE CASCADE,
    naziv_firme_ili_obrta VARCHAR NOT NULL,
    kategorija_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    grad VARCHAR NOT NULL,
    opis TEXT,
    prosjecna_ocjena DECIMAL(3, 2) DEFAULT 0.00
);

-- 4. Usluge_Cjenovnik (Services)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    majstor_id UUID REFERENCES tradesmen(id) ON DELETE CASCADE,
    naziv_usluge VARCHAR NOT NULL,
    cijena DECIMAL(10, 2) NOT NULL,
    jedinica_mjere VARCHAR NOT NULL
);

-- 5. Recenzije (Reviews)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    majstor_id UUID REFERENCES tradesmen(id) ON DELETE CASCADE,
    korisnik_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ocjena INTEGER CHECK (ocjena >= 1 AND ocjena <= 5),
    komentar TEXT,
    datum_objave TIMESTAMP DEFAULT NOW()
);
