from jose import jwt, JWTError

from config import EnvConfig

class AuthService:
    SHARED_SECRET = EnvConfig.JWT_SECRET
    ALGORITHM = "HS256"
    EXPECTED_ISSUER = "http://localhost:5072"
    EXPECTED_AUDIENCE = "http://127.0.0.1:5000"

    @classmethod
    def authenticate(cls, token: str):
        if not token:
            raise JWTError()
        
        user = cls.get_user_from_token(token)

        if not user:
            raise JWTError()
        
        return user
        

    @classmethod
    def get_user_from_token(cls, token: str):
        try:
            payload = jwt.decode(
                token, 
                cls.SHARED_SECRET, 
                algorithms=[cls.ALGORITHM],
                issuer=cls.EXPECTED_ISSUER,
                audience=cls.EXPECTED_AUDIENCE
            )
            return payload
        except JWTError as e:
            print(f"JWT Validation Error: {e}")
            return None