import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Core() {
  const [monedas, setmonedas] = useState([])
  const [codigomoneda, setcodigomoneda] = useState("")
  const [nombre, setnombre] = useState("")
  const [simbolo, setsimbolo] = useState("")

  const cargarmonedas = () => {
    fetch("/api/core/monedas")
      .then(res => res.json())
      .then(data => setmonedas(data))
  }

  useEffect(() => {
    cargarmonedas()
  }, [])

  const guardarmoneda = (e) => {
    e.preventDefault()
    const nuevamoneda = {
      codigo_moneda: codigomoneda,
      nombre: nombre,
      simbolo: simbolo
    }

    fetch("/api/core/monedas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevamoneda)
    })
    .then(res => {
      if (res.ok) {
        cargarmonedas()
        setcodigomoneda("")
        setnombre("")
        setsimbolo("")
      } else {
        alert("Error: Verifica que el código sea de 3 letras y no esté repetido.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 relative overflow-hidden">
      
      {/* EFECTOS DE FONDO: Orbes de luz desenfocados para eliminar la planicie */}
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[60%] w-[30rem] h-[30rem] bg-teal-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10">
        
        {/* Barra de Navegación superior Glassmorphism */}
        <nav className="bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(52,211,153,0.4)]">
                <span className="font-black text-neutral-950 text-xl tracking-tighter">ERP</span>
              </div>
              <div>
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Configuración Global</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Gestión de <span className="text-emerald-400">Divisas</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Formulario Glassmorphism 3D */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-16 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Brillo dinámico superior */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
            
            <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              Añadir Nueva Divisa
            </h2>

            <form onSubmit={guardarmoneda} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Código ISO</label>
                <input type="text" maxLength="3" value={codigomoneda} onChange={e => setcodigomoneda(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner placeholder-neutral-700" placeholder="Ej. COP" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Nombre de la Moneda</label>
                <input type="text" value={nombre} onChange={e => setnombre(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner placeholder-neutral-700" placeholder="Peso Colombiano" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Símbolo</label>
                <input type="text" value={simbolo} onChange={e => setsimbolo(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner placeholder-neutral-700" placeholder="$" required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] border border-emerald-300/50 flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                Registrar Divisa
              </button>
            </form>
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Catálogo de Operaciones</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {/* Cuadrícula de Tarjetas con efectos de rebote y luz */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {monedas.map((m) => (
              <div key={m.codigo_moneda} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-emerald-500/30 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:bg-white/[0.04] group relative overflow-hidden">
                
                {/* Resplandor interno on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{m.nombre}</h3>
                      <p className="text-xs text-neutral-500 font-medium">Divisa Comercial</p>
                    </div>
                    <div className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-inner">
                      <span className="text-lg font-black text-amber-400 tracking-widest">{m.codigo_moneda}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2">Símbolo Financiero</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                        {m.simbolo}
                      </span>
                    </div>
                    
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {monedas.length === 0 && (
            <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/[0.01] backdrop-blur-lg shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black/40 border border-white/10 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.1)] transform rotate-3">
                  <svg className="w-10 h-10 text-amber-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-white text-xl font-bold tracking-wide">Panel sin datos</h3>
                <p className="text-neutral-500 text-sm mt-3 max-w-sm mx-auto leading-relaxed">No hay divisas comerciales registradas. Utiliza el panel superior para inyectar datos al ecosistema.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Core