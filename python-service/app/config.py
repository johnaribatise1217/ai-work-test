from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    postgres_db: str
    postgres_user: str
    postgres_pass: str
    postgres_port: int

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_pass}"
            f"@localhost:{self.postgres_port}/{self.postgres_db}"
        )
    app_env: str = "development"
    app_port: int = 8000

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
