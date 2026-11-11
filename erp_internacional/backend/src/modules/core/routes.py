from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.config.database import get_db
from .models import Moneda
from .schemas import MonedaCreate, MonedaResponse

router = APIRouter(prefix="/api/core", tags=["Core"])

@router.get("/monedas", response_model=List[MonedaResponse])
def obtener_monedas(db: Session = Depends(get_db)):
    """Obtiene el listado de todas las monedas configuradas en el ERP."""
    return db.query(Moneda).all()

@router.post("/monedas", response_model=MonedaResponse)
def crear_moneda(moneda: MonedaCreate, db: Session = Depends(get_db)):
    """Registra una nueva moneda."""
    db_moneda = db.query(Moneda).filter(Moneda.codigo_moneda == moneda.codigo_moneda).first()
    if db_moneda:
        raise HTTPException(status_code=400, detail="La moneda ya existe")
    
    nueva_moneda = Moneda(**moneda.model_dump())
    db.add(nueva_moneda)
    db.commit()
    db.refresh(nueva_moneda)
    return nueva_moneda