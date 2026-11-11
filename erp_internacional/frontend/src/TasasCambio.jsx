import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function TasasCambio() {
  const [tasas, settasas] = useState([])
  const [monedas, setmonedas] = useState([])
  const [monedaorigen, setmonedaorigen] = useState("")
  const [monedadestino, setmonedadestino] = useState("")
  const [tasa, settasa] = useState("")
  const [fechavigencia, setfechavigencia] = useState("")
  const [fuente, setfuente] = useState("")

  const cargardatos = () => {
    fetch("/api/core/tasas-cambio")
      .then(res => res.json())
      .then(data => settasas(data))

    fetch("/api/core/monedas")
      .then(res => res.json())
      .then(data => setmonedas(data))
  }

  useEffect(() => {
    cargardatos()
  }, [])

  const guardartasa = (e) => {
    e.preventDefault()
    const nuevatasa = {
      moneda_origen: monedaorigen,
      moneda_destino: monedadestino,
      tasa: parseFloat(tasa),
      fecha_vigencia: fechavigencia,
      fuente: fuente || "Banco Central"
    }

    fetch("/api/core/tasas-cambio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevatasa)
    })
    .then(res => {
      if (res.ok) {
        cargardatos()
        setmonedaorigen("")
        setmonedadestino("")
        settasa("")
        setfechavigencia("")
        setfuente("")
      } else {
        alert("Error al registrar la tasa de cambio. Verifica los datos.")
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
                <h1 className="text-xl font-bold tracking-wide text-white">Tasas de <span className="text-emerald-400">Cambio</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Formulario de registro de tasas */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-16 relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-8">Registrar Nueva Tasa de Cambio</h2>

            <form onSubmit={guardartasa} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Origen</label>
                <select value={monedaorigen} onChange={e => setmonedaorigen(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" required>
                  <option value="" disabled>Moneda Origen</option>
                  {monedas.map(m => (
                    <option key={m.codigo_moneda} value={m.codigo_moneda} className="bg-neutral-900 text-white">
                      {m.codigo_moneda}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Destino</label>
                <select value={monedadestino} onChange={e => setmonedadestino(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" required>
                  <option value="" disabled>Moneda Destino</option>
                  {monedas.map(m => (
                    <option key={m.codigo_moneda} value={m.codigo_moneda} className="bg-neutral-900 text-white">
                      {m.codigo_moneda}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Tasa</label>
                <input type="number" step="0.000001" value={tasa} onChange={e => settasa(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="0.0000" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Vigencia</label>
                <input type="date" value={fechavigencia} onChange={e => setfechavigencia(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Fuente</label>
                <input type="text" value={fuente} onChange={e => setfuente(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Ej. Bloomberg" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Guardar
              </button>
            </form>
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Historial de Conversiones</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {/* Cuadrícula de tasas registradas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasas.map((t) => (
              <div key={t.id_tasa} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-amber-400">{t.moneda_origen}</span>
                    <span className="text-neutral-500">➔</span>
                    <span className="text-lg font-black text-emerald-400">{t.moneda_destino}</span>
                  </div>
                  <span className="text-xs text-neutral-400">{t.fecha_vigencia}</span>
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {t.tasa}
                </div>
                {t.fuente && <p className="text-[11px] text-neutral-500 mt-2">Fuente: {t.fuente}</p>}
              </div>
            ))}
          </div>

          {tasas.length === 0 && (
            <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-neutral-500 text-sm">No hay tasas de cambio registradas todavía.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default TasasCambio