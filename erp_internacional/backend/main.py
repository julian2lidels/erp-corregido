import os
from datetime import date
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.middlewares.error_handler import global_exception_handler
from src.modules.core.routes import router as core_router

app = FastAPI(
    title="ERP Internacional API",
    description="Backend del framework ERP con FastAPI y MySQL",
    version="1.0.0",
)

# CORS: en OpenShift el frontend usa el mismo origen (Nginx hace proxy a /api),
# así que normalmente no hace falta. Para otros orígenes, define CORS_ORIGINS
# separados por coma, ej: "https://mi-frontend.apps.example.com"
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)
app.include_router(core_router)


# ---------- Health check ----------
@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Framework ERP Internacional operativo y conectado.",
    }


# ---------- Países ----------
class PaisCreate(BaseModel):
    codigo_pais: str  # código ISO de 2 letras (columna codigo_iso)
    nombre: str
    codigo_moneda: str


@app.get("/api/core/paises")
def listar_paises(db: Session = Depends(get_db)):
    filas = db.execute(
        text("SELECT id_pais, codigo_iso, nombre, codigo_moneda FROM pais")
    ).fetchall()
    return [
        {"id_pais": r[0], "codigo_pais": r[1], "nombre": r[2], "codigo_moneda": r[3]}
        for r in filas
    ]


@app.post("/api/core/paises")
def crear_pais(pais: PaisCreate, db: Session = Depends(get_db)):
    try:
        db.execute(
            text("INSERT INTO pais (codigo_iso, nombre, codigo_moneda) VALUES (:cp, :n, :cm)"),
            {"cp": pais.codigo_pais, "n": pais.nombre, "cm": pais.codigo_moneda},
        )
        db.commit()
        return {"message": "Pais registrado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Tasas de cambio ----------
class TasaCambioCreate(BaseModel):
    moneda_origen: str
    moneda_destino: str
    tasa: float
    fecha_vigencia: date
    fuente: Optional[str] = None


@app.get("/api/core/tasas-cambio")
def listar_tasas(db: Session = Depends(get_db)):
    filas = db.execute(
        text("SELECT id_tasa, moneda_origen, moneda_destino, tasa, fecha_vigencia, fuente FROM tasa_cambio")
    ).fetchall()
    return [
        {
            "id_tasa": r[0],
            "moneda_origen": r[1],
            "moneda_destino": r[2],
            "tasa": float(r[3]),
            "fecha_vigencia": str(r[4]),
            "fuente": r[5],
        }
        for r in filas
    ]


@app.post("/api/core/tasas-cambio")
def crear_tasa(tasa: TasaCambioCreate, db: Session = Depends(get_db)):
    try:
        db.execute(
            text(
                """INSERT INTO tasa_cambio (moneda_origen, moneda_destino, tasa, fecha_vigencia, fuente)
                   VALUES (:mo, :md, :t, :fv, :f)"""
            ),
            {
                "mo": tasa.moneda_origen,
                "md": tasa.moneda_destino,
                "t": tasa.tasa,
                "fv": tasa.fecha_vigencia,
                "f": tasa.fuente,
            },
        )
        db.commit()
        return {"message": "Tasa de cambio registrada exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Sucursales ----------
class SucursalCreate(BaseModel):
    nombre: str
    id_pais: int
    direccion: Optional[str] = None
    codigo_moneda_base: str


@app.get("/api/core/sucursales")
def listar_sucursales(db: Session = Depends(get_db)):
    filas = db.execute(
        text("SELECT id_sucursal, nombre, id_pais, direccion, codigo_moneda_base FROM sucursal")
    ).fetchall()
    return [
        {
            "id_sucursal": r[0],
            "nombre": r[1],
            "id_pais": r[2],
            "direccion": r[3],
            "codigo_moneda_base": r[4],
        }
        for r in filas
    ]


@app.post("/api/core/sucursales")
def crear_sucursal(sucursal: SucursalCreate, db: Session = Depends(get_db)):
    try:
        db.execute(
            text(
                """INSERT INTO sucursal (nombre, id_pais, direccion, codigo_moneda_base)
                   VALUES (:n, :ip, :dir, :cmb)"""
            ),
            {
                "n": sucursal.nombre,
                "ip": sucursal.id_pais,
                "dir": sucursal.direccion,
                "cmb": sucursal.codigo_moneda_base,
            },
        )
        db.commit()
        return {"message": "Sucursal registrada exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Impuestos ----------
class ImpuestoCreate(BaseModel):
    id_pais: int
    nombre: str
    porcentaje: float


@app.get("/api/core/impuestos")
def listar_impuestos(db: Session = Depends(get_db)):
    filas = db.execute(
        text("SELECT id_impuesto, id_pais, nombre, porcentaje FROM impuesto")
    ).fetchall()
    return [
        {"id_impuesto": r[0], "id_pais": r[1], "nombre": r[2], "porcentaje": float(r[3])}
        for r in filas
    ]


@app.post("/api/core/impuestos")
def crear_impuesto(impuesto: ImpuestoCreate, db: Session = Depends(get_db)):
    try:
        db.execute(
            text("INSERT INTO impuesto (id_pais, nombre, porcentaje) VALUES (:ip, :n, :p)"),
            {"ip": impuesto.id_pais, "n": impuesto.nombre, "p": impuesto.porcentaje},
        )
        db.commit()
        return {"message": "Impuesto registrado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Roles ----------
class RolCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None


@app.get("/api/core/roles")
def listar_roles(db: Session = Depends(get_db)):
    filas = db.execute(text("SELECT id_rol, nombre, descripcion FROM rol")).fetchall()
    return [{"id_rol": r[0], "nombre": r[1], "descripcion": r[2]} for r in filas]


@app.post("/api/core/roles")
def crear_rol(rol: RolCreate, db: Session = Depends(get_db)):
    try:
        db.execute(
            text("INSERT INTO rol (nombre, descripcion) VALUES (:n, :d)"),
            {"n": rol.nombre, "d": rol.descripcion},
        )
        db.commit()
        return {"message": "Rol registrado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
