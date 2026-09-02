import React from 'react';
import { Flame, MessageCircle, DollarSign, Star, Target } from 'lucide-react';
import { ExtractionStats } from '../types';

interface StatsBannerProps {
  stats: ExtractionStats;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Extraídos */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-white/20 transition">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Prospectos</p>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-white/10">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight">{stats.totalScraped}</h3>
          <p className="text-[#10b981] text-xs mt-2 flex items-center gap-1 font-semibold">
            <span>Promedio Google:</span>
            <span className="text-amber-400 font-bold flex items-center ml-0.5">
              {stats.averageRating} <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-0.5" />
            </span>
          </p>
        </div>

        {/* Prospectos Hot (Sin Web) */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-amber-500/30 p-5 rounded-2xl shadow-xl relative overflow-hidden group hot-lead-glow hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Prospectos Hot</p>
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center border border-amber-500/30">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#f59e0b] tracking-tight">{stats.hotLeadsCount}</h3>
          <p className="text-slate-400 text-xs mt-2 font-medium">
            {stats.totalScraped > 0 ? `${Math.round((stats.hotLeadsCount / stats.totalScraped) * 100)}% sin sitio web detectado` : 'Sin sitio web detectado'}
          </p>
        </div>

        {/* Listos para WhatsApp */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-white/20 transition">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">WhatsApp Directo</p>
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 text-[#10b981] flex items-center justify-center border border-emerald-500/30">
              <MessageCircle className="w-4 h-4 text-[#10b981]" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#10b981] tracking-tight">{stats.whatsappReadyCount}</h3>
          <p className="text-slate-400 text-xs mt-2 font-medium">
            Listos para contacto wa.me
          </p>
        </div>

        {/* Oportunidad Comercial */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-white/20 transition">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pipeline Estimado</p>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            ${stats.conversionOpportunityUSD.toLocaleString()}
          </h3>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
            <div
              className="bg-[#2563eb] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(15, (stats.hotLeadsCount / Math.max(1, stats.totalScraped)) * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
