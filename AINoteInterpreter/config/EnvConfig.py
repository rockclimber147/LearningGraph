import os
from dotenv import load_dotenv

load_dotenv()

class EnvConfig:
    JWT_SECRET = os.getenv("SECRET")
