import React from 'react';
import { Search, Flame, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import { Lead } from '../types';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  totalLeads: number;
  filteredCount: number;
  filterHotOnly: boolean;
  onToggleFilterHot: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  totalLeads,
  filteredCount,
  filterHotOnly,
  onToggleFilterHot,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
        {/* Search within leads */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-filter-leads-name"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Filtrar por nombre o dirección..."
            className="w-full bg-[#0f172a]/80 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Filters and Sorts */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-[#0f172a]/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-300">
            <Filter className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-400 font-medium">Estado:</span>
            <select
              id="select-pipeline-filter"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="todos" className="bg-slate-900">Todos los estados</option>
              <option value="nuevo" className="bg-slate-900">Nuevos</option>
              <option value="contactado" className="bg-slate-900">Contactados</option>
              <option value="en_negociacion" className="bg-slate-900">En Negociación</option>
              <option value="cerrado" className="bg-slate-900">Cerrados ✓</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 bg-[#0f172a]/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-300">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-400 font-medium">Ordenar:</span>
            <select
              id="select-sort-leads"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="hot_first" className="bg-slate-900">🔥 Hot (Sin web primero)</option>
              <option value="rating_desc" className="bg-slate-900">Mayor Puntuación ★</option>
              <option value="reviews_desc" className="bg-slate-900">Más Reseñas</option>
              <option value="name_asc" className="bg-slate-900">Nombre (A - Z)</option>
            </select>
          </div>

          {/* Hot Only Quick Toggle */}
          <button
            id="btn-toolbar-toggle-hot"
            type="button"
            onClick={onToggleFilterHot}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              filterHotOnly
                ? 'bg-[#f59e0b] text-slate-950 ring-1 ring-amber-300 shadow-md shadow-amber-500/25'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:text-[#f59e0b] hover:bg-white/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Solo Hot</span>
          </button>
        </div>

        {/* Counter */}
        <div className="text-[11px] text-slate-400 font-medium ml-auto">
          Mostrando <span className="text-white font-bold">{filteredCount}</span> de <span className="text-white font-bold">{totalLeads}</span> prospectos
        </div>
      </div>
    </div>
  );
};
