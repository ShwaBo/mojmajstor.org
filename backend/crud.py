import schemas
from uuid import UUID
from supabase import Client

def get_tradesmen(db: Client, grad: str = None, kategorija_id: UUID = None, verified: bool = None, skip: int = 0, limit: int = 100):
    query = db.table('tradesmen').select('*, category_id:categories(*)')
    if grad:
        query = query.ilike('grad', f"%{grad}%")
    if kategorija_id:
        query = query.eq('kategorija_id', str(kategorija_id))
    if verified is not None:
        query = query.eq('verified', verified)
        
    response = query.order('prosjecna_ocjena', desc=True).range(skip, skip + limit - 1).execute()
    return response.data

def get_tradesman(db: Client, tradesman_id: UUID):
    response = db.table('tradesmen').select('*, category_id:categories(*)').eq('id', str(tradesman_id)).single().execute()
    return response.data if hasattr(response, 'data') else None

def increment_tradesman_clicks(db: Client, tradesman_id: UUID):
    # Fetch current value
    tradesman = db.table('tradesmen').select('broj_klikova').eq('id', str(tradesman_id)).single().execute()
    if not hasattr(tradesman, 'data') or not tradesman.data:
        return None
    
    current_clicks = tradesman.data.get('broj_klikova') or 0
    new_clicks = current_clicks + 1
    
    response = db.table('tradesmen').update({"broj_klikova": new_clicks}).eq('id', str(tradesman_id)).execute()
    return response.data[0] if response.data else None

def create_tradesman(db: Client, tradesman: schemas.TradesmanCreate):
    response = db.table('tradesmen').insert(tradesman.model_dump()).execute()
    return response.data[0] if response.data else None

def get_categories(db: Client):
    response = db.table('categories').select('*').execute()
    return response.data

def create_category(db: Client, category: schemas.CategoryBase):
    response = db.table('categories').insert(category.model_dump()).execute()
    return response.data[0] if response.data else None

def create_review(db: Client, review: schemas.ReviewCreate):
    response = db.table('reviews').insert(review.model_dump()).execute()
    return response.data[0] if response.data else None

def get_services_for_tradesman(db: Client, tradesman_id: UUID):
    response = db.table('services').select('*').eq('majstor_id', str(tradesman_id)).execute()
    return response.data
