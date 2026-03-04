import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx

security = HTTPBearer()

# Your clerk publishable key (useful if needed for JWKS URL building in dynamic setups)
CLERK_FRONTEND_API_URL = os.getenv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

# For Clerk, the JWKS URL is your frontend API URL + /.well-known/jwks.json generally, 
# but for DEV instances, it's often https://api.clerk.dev/v1/jwks or built from the secret. 
# The most reliable for modern Clerk is https://<YOUR_CLERK_DOMAIN>/.well-known/jwks.json
JWKS_URL = os.getenv("CLERK_JWKS_URL", "https://api.clerk.com/v1/jwks")

async def get_clerk_jwks():
    # In production, cache this!
    headers = {}
    if CLERK_SECRET_KEY:
        headers["Authorization"] = f"Bearer {CLERK_SECRET_KEY}"
        
    async with httpx.AsyncClient() as client:
        response = await client.get(JWKS_URL, headers=headers)
        if response.status_code == 200:
            return response.json()
        raise HTTPException(status_code=500, detail=f"Neuspješno dohvatanje JWKS od Clerka: {response.text}")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    jwks = await get_clerk_jwks()

    # Get the unverified header to extract kid
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Nevažeći format tokena.")
        
    rsa_key = {}
    if "keys" in jwks:
        for key in jwks["keys"]:
            if key.get("kid") == unverified_header.get("kid"):
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                # Add audience / issuer validation in production
                options={"verify_aud": False}
            )
            # The payload contains clerk user id in `sub` (subject)
            return payload.get("sub")
        except JWTError as e:
            raise HTTPException(status_code=401, detail="Nevažeći token.")
    raise HTTPException(status_code=401, detail="Token autentifikacija neuspješna.")

def require_auth(clerk_id: str = Depends(get_current_user)):
    return clerk_id
