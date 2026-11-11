import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Impuestos() {
  const [impuestos, setimpuestos] = useState([])
  const [paises, setpaises] = useState([])
  const [idpais, setidpais] = useState("")
  const [nombre, setnombre] = useState("")
  const [porcentaje, setporcentaje] = useState("")

  const cargardatos = () => {
    fetch("/api/core/impuestos")
      .then(res => res.json())
      .then(data => setimpuestos(data))

    fetch("/api/core/paises")
      .then(res => res.json())
      .then(data => setpaises(data))
  }

  useEffect(() => {
    cargardatos()
  }, [])

  const guardarimpuesto = (e) => {
    e.preventDefault()
    const nuevoimpuesto = {
      id_pais: parseInt(idpais),
      nombre: nombre,
      porcentaje: parseFloat(porcentaje)
    }

    fetch("/api/core/impuestos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoimpuesto)
    })
    .then(res => {
      if (res.ok) {
        cargardatos()
        setidpais("")
        setnombre("")
        setporcentaje("")
      } else {
        alert("Error al registrar el impuesto. Verifica los datos.")
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
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Configuración Global</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Gestión de <span className="text-emerald-400">Impuestos</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Formulario de registro de impuestos */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-16 relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-8">Registrar Nuevo Impuesto</h2>

            <form onSubmit={guardarimpuesto} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">País</label>
                <select value={idpais} onChange={e => setidpais(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" required>
                  <option value="" disabled>Seleccione país</option>
                  {paises.map(p => (
                    <option key={p.id_pais} value={p.id_pais} className="bg-neutral-900 text-white">
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Nombre (ej. IVA, VAT)</label>
                <input type="text" value={nombre} onChange={e => setnombre(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="IVA" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Porcentaje (%)</label>
                <input type="number" step="0.01" min="0" value={porcentaje} onChange={e => setporcentaje(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="19.00" required />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Guardar Impuesto
              </button>
            </form>
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Catálogo de Impuestos</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {/* Cuadrícula de impuestos registrados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {impuestos.map((imp) => (
              <div key={imp.id_impuesto} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400">{imp.nombre}</h3>
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded-lg text-lg font-black text-amber-400">
                    {imp.porcentaje}%
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-2">ID País Asociado: <span className="text-white font-semibold">{imp.id_pais}</span></p>
              </div>
            ))}
          </div>

          {impuestos.length === 0 && (
            <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-neutral-500 text-sm">No hay impuestos registrados todavía.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Impuestos