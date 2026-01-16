from jose import jwt, JWTError

from config import EnvConfig

class AuthService:
    SHARED_SECRET = EnvConfig.JWT_SECRET
    ALGORITHM = "HS256"

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
            print("decoding with " + cls.SHARED_SECRET)
            payload = jwt.decode(token, cls.SHARED_SECRET, algorithms=[cls.ALGORITHM])
            return payload
        except JWTError as e:
            print(e)
            return None