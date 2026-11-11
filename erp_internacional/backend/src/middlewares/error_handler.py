import logging

from fastapi import Request
from fastapi.responses import JSONResponse


async def global_exception_handler(request: Request, exc: Exception):
    # El detalle va a los logs del pod, no al cliente
    logging.error("Error en %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"error": "Error interno del servidor"},
    )
