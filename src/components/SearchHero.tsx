import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Flame, KeyRound, Loader2, Sparkles } from 'lucide-react';
import { SearchParams } from '../types';

interface SearchHeroProps {
  searchParams: SearchParams;
  onSearchChange: (params: Partial<SearchParams>) => void;
  onExecuteSearch: () => void;
  isLoading: boolean;
}

const PRESET_NICHES = [
  "Clínica Dental",
  "Restaurante",
  "Reformas & Construcción",
  "Taller Mecánico",
  "Gimnasio & Fitness",
  "Inmobiliaria",
  "Estética & Belleza",
  "Veterinaria",
];

const PRESET_LOCATIONS = [
  "Madrid, España",
  "Ciudad de México",
  "Bogotá, Colombia",
  "Buenos Aires, Argentina",
  "Barcelona, España",
  "Monterrey, México",
  "Miami, FL",
];

export const SearchHero: React.FC<SearchHeroProps> = ({
  searchParams,
  onSearchChange,
  onExecuteSearch,
  isLoading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteSearch();
  };

  return (
    <section className="relative pt-6 pb-4">
      {/* Background ambient subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3 text-xs font-semibold text-slate-300 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Extracción Inteligente de Google Places + Auditoría con IA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Rastrea Negocios Locales y Encuentra <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Prospectos Hot Sin Web</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
            Extrae datos directos de Google Places, perfiles de redes, números de WhatsApp y genera mensajes de cierre en segundos con IA.
          </p>
        </div>

        {/* Main Search Box */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-2xl shadow-2xl max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Niche Input */}
            <div className="md:col-span-5 relative">
              <label htmlFor="input-niche" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                Nicho / Sector
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-niche"
                  type="text"
                  value={searchParams.niche}
                  onChange={(e) => onSearchChange({ niche: e.target.value })}
                  placeholder="Ej: Clínica Dental, Restaurante, Reformas..."
                  className="w-full bg-[#0f172a]/80 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="md:col-span-4 relative">
              <label htmlFor="input-location" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                Ciudad / Región
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-location"
                  type="text"
                  value={searchParams.location}
                  onChange={(e) => onSearchChange({ location: e.target.value })}
                  placeholder="Ej: Madrid, Ciudad de México, Bogotá..."
                  className="w-full bg-[#0f172a]/80 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Action Search Button */}
            <div className="md:col-span-3 flex items-end">
              <div className="w-full">
                <div className="block text-[11px] font-semibold text-transparent mb-1 hidden md:block select-none">
                  Acción
                </div>
                <button
                  id="btn-execute-scrape"
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[42px] rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 active:scale-[0.99] transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Extrayendo...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Rastrear Prospectos</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Hot Leads Filter Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={searchParams.filterHotOnly}
                onChange={(e) => onSearchChange({ filterHotOnly: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f59e0b] border border-white/10 relative" />
              <span className="font-bold text-slate-300 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Solo Prospectos Hot (Sin Web)</span>
              </span>
            </label>

            {/* Min Rating Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Puntuación mínima:</span>
              <select
                id="select-min-rating"
                value={searchParams.minRating}
                onChange={(e) => onSearchChange({ minRating: parseFloat(e.target.value) })}
                className="bg-[#0f172a]/80 border border-white/10 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="3.5">★ 3.5 o más</option>
                <option value="4.0">★ 4.0 o más</option>
                <option value="4.5">★ 4.5 (Recomendado Hot)</option>
              </select>
            </div>

            {/* Advanced Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition ml-auto"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Configuración Avanzada / Apify</span>
            </button>
          </div>

          {/* Collapsible Advanced Config (Apify Integration) */}
          {showAdvanced && (
            <div className="mt-3 p-3.5 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 text-xs">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold mb-2">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Configuración de Extracción & Apify Actor (Opcional)</span>
              </div>
              <p className="text-slate-400 mb-2">
                Por defecto, LeadPulse utiliza su motor nativo optimizado sin costos adicionales. Si deseas conectar tu cuenta de Apify para rastreo directo de Google Places Actor:
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  value={searchParams.apifyApiKey || ''}
                  onChange={(e) => onSearchChange({ apifyApiKey: e.target.value })}
                  placeholder="Ingresa tu Apify API Token (ej: apify_api_...)"
                  className="w-full bg-[#0f172a]/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </form>

        {/* Preset Chips */}
        <div className="mt-3 max-w-4xl mx-auto flex flex-wrap items-center gap-1.5 justify-center">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Sugerencias rápidas:</span>
          {PRESET_NICHES.map((niche) => (
            <button
              key={niche}
              type="button"
              onClick={() => {
                onSearchChange({ niche });
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition backdrop-blur-sm"
            >
              {niche}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
