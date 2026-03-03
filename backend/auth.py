import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx

security = HTTPBearer()

# Example: https://clerk.your-domain.com
CLERK_FRONTEND_API_URL = os.getenv("CLERK_FRONTEND_API_URL", "https://api.clerk.dev/v1")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
JWKS_URL = os.getenv("CLERK_JWKS_URL", "https://your-domain.clerk.accounts.dev/.well-known/jwks.json")

async def get_clerk_jwks():
    # In production, cache this!
    async with httpx.AsyncClient() as client:
        response = await client.get(JWKS_URL)
        if response.status_code == 200:
            return response.json()
        raise HTTPException(status_code=500, detail="Neuspješno dohvatanje JWKS od Clerka")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    jwks = await get_clerk_jwks()

    # Get the unverified header to extract kid
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
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
