from pydantic import BaseModel, Field

# Esquema base con las propiedades comunes
class MonedaBase(BaseModel):
    codigo_moneda: str = Field(..., min_length=3, max_length=3, description="Código ISO de la moneda (ej. COP)")
    nombre: str = Field(..., max_length=50, description="Nombre completo de la moneda")
    simbolo: str = Field(..., max_length=5, description="Símbolo de la moneda (ej. $)")

# Esquema para crear una moneda (hereda del base)
class MonedaCreate(MonedaBase):
    pass

# Esquema para responder al frontend (incluye configuración ORM)
class MonedaResponse(MonedaBase):
    class Config:
        from_attributes = True # Permite que Pydantic lea el modelo de SQLAlchemy