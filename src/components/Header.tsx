import React from 'react';
import { Sparkles, Activity, ShieldCheck, Download, Flame, Database } from 'lucide-react';
import { ExtractionStats, Lead } from '../types';

interface HeaderProps {
  stats: ExtractionStats;
  leads: Lead[];
  onExportCsv: () => void;
  filterHotOnly: boolean;
  onToggleFilterHot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  leads,
  onExportCsv,
  filterHotOnly,
  onToggleFilterHot,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md bg-[#1e293b]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563eb] to-[#818cf8] flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Lead<span className="text-blue-400">Pulse</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-blue-400 border border-white/10 font-bold uppercase tracking-wider">
                SaaS B2B
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Extractor & Outreach con Inteligencia Artificial
            </p>
          </div>
        </div>

        {/* Live System Status Badges */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
            <Activity className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Motor Scraping Activo</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>API Gemini 3.8 Activa</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            id="btn-filter-hot-header"
            onClick={onToggleFilterHot}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 ${
              filterHotOnly
                ? 'bg-[#f59e0b] text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-300'
                : 'bg-white/5 text-amber-400 border border-white/10 hover:bg-white/10'
            }`}
            title="Mostrar solo empresas sin página web"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Prospectos Hot</span>
            {stats.hotLeadsCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${filterHotOnly ? 'bg-black/20 text-slate-950 font-black' : 'bg-[#f59e0b]/20 text-amber-300'}`}>
                {stats.hotLeadsCount}
              </span>
            )}
          </button>

          <button
            id="btn-export-csv"
            onClick={onExportCsv}
            disabled={leads.length === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
