import os
from supabase import create_client, Client
from dotenv import load_dotenv
from sqlalchemy.orm import declarative_base

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Obavezni Supabase parametri nedostaju (SUPABASE_URL, SUPABASE_KEY) u .env datoteci")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Mocked out standard DB injection to prevent routing failures gracefully
def get_db():
    yield supabase

Base = declarative_base()
