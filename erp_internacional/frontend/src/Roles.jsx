import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Roles() {
  const [roles, setroles] = useState([])
  const [nombre, setnombre] = useState("")
  const [descripcion, setdescripcion] = useState("")

  const cargardatos = () => {
    fetch("/api/core/roles")
      .then(res => res.json())
      .then(data => setroles(data))
  }

  useEffect(() => {
    cargardatos()
  }, [])

  const guardarrol = (e) => {
    e.preventDefault()
    const nuevarol = {
      nombre: nombre,
      descripcion: descripcion
    }

    fetch("/api/core/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevarol)
    })
    .then(res => {
      if (res.ok) {
        cargardatos()
        setnombre("")
        setdescripcion("")
      } else {
        alert("Error al registrar el rol. El nombre debe ser único.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10">
        <nav className="bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(52,211,153,0.4)]">
                <span className="font-black text-neutral-950 text-xl tracking-tighter">ERP</span>
              </div>
              <div>
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Seguridad & Accesos</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Gestión de <span className="text-emerald-400">Roles</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Formulario de registro de roles */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-16 relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-8">Registrar Nuevo Rol</h2>

            <form onSubmit={guardarrol} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Nombre del Rol</label>
                <input type="text" value={nombre} onChange={e => setnombre(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Administrador" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Descripción</label>
                <input type="text" value={descripcion} onChange={e => setdescripcion(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Acceso total al sistema" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Guardar Rol
              </button>
            </form>
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Catálogo de Roles</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {/* Cuadrícula de roles registrados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((r) => (
              <div key={r.id_rol} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400">{r.nombre}</h3>
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded-lg text-sm font-black text-amber-400">
                    ID: {r.id_rol}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-2">{r.descripcion || "Sin descripción detallada."}</p>
              </div>
            ))}
          </div>

          {roles.length === 0 && (
            <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-neutral-500 text-sm">No hay roles registrados todavía.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Roles