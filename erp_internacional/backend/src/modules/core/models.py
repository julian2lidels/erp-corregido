from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from src.config.database import Base

class Moneda(Base):
    __tablename__ = "moneda"

    codigo_moneda = Column(String(3), primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    simbolo = Column(String(5), nullable=False)

    # Relación inversa para saber qué países usan esta moneda
    paises = relationship("Pais", back_populates="moneda")

class Pais(Base):
    __tablename__ = "pais"

    id_pais = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre = Column(String(80), nullable=False)
    codigo_iso = Column(String(2), nullable=False, unique=True)
    codigo_moneda = Column(String(3), ForeignKey("moneda.codigo_moneda"), nullable=False)

    # Relación directa con la moneda
    moneda = relationship("Moneda", back_populates="paises")