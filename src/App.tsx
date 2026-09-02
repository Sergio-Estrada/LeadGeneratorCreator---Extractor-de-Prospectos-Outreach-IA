import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { StatsBanner } from './components/StatsBanner';
import { LeadCard } from './components/LeadCard';
import { LeadAuditModal } from './components/LeadAuditModal';
import { FloatingAiDock } from './components/FloatingAiDock';
import { FilterToolbar } from './components/FilterToolbar';
import { ExtractionStats, Lead, SearchParams } from './types';
import { Sparkles, AlertCircle, RefreshCw, Flame } from 'lucide-react';

const INITIAL_PARAMS: SearchParams = {
  niche: 'Clínica Dental',
  location: 'Madrid, España',
  filterHotOnly: false,
  minRating: 3.5,
  limit: 12,
  apifyApiKey: '',
};

const INITIAL_STATS: ExtractionStats = {
  totalScraped: 0,
  hotLeadsCount: 0,
  whatsappReadyCount: 0,
  averageRating: 0,
  conversionOpportunityUSD: 0,
};

export default function App() {
  const [searchParams, setSearchParams] = useState<SearchParams>(INITIAL_PARAMS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<ExtractionStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // In-table filters & sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('hot_first');

  // Audit Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [auditModalInitialTab, setAuditModalInitialTab] = useState<'diagnostic' | 'webPrompt'>('diagnostic');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Perform search / extraction
  const fetchLeads = async (paramsToUse = searchParams) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paramsToUse),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Error al rastrear prospectos');
      }

      setLeads(data.leads || []);
      setStats(data.stats || INITIAL_STATS);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMessage(err.message || 'No se pudieron extraer los datos. Por favor verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  // Immediate first load: show working app right away
  useEffect(() => {
    fetchLeads(INITIAL_PARAMS);
  }, []);

  // Handle lead status updates
  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Estado actualizado a: ${newStatus}`);
  };

  // Trigger AI audit or Web Prompt Generator
  const handleAnalyzeLead = async (leadToAnalyze: Lead, initialTab: 'diagnostic' | 'webPrompt' = 'diagnostic') => {
    setSelectedLead(leadToAnalyze);
    setAuditModalInitialTab(initialTab);
    setIsAuditModalOpen(true);

    // If already analyzed, no need to re-query unless forced
    if (leadToAnalyze.aiAudit) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/leads/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: leadToAnalyze }),
      });

      const data = await res.json();
      if (data.success && data.audit) {
        const updatedLead: Lead = {
          ...leadToAnalyze,
          aiAudit: data.audit,
        };

        setSelectedLead(updatedLead);
        setLeads(prev =>
          prev.map(l => (l.id === leadToAnalyze.id ? updatedLead : l))
        );
      } else {
        throw new Error(data.error || 'No se pudo generar la auditoría');
      }
    } catch (err: any) {
      console.error('Audit generation error:', err);
      showToast('Error al auditar con IA: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    if (leads.length === 0) return;
    try {
      const res = await fetch('/api/leads/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leadpulse_${searchParams.niche.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Archivo CSV exportado exitosamente');
    } catch (err) {
      showToast('Error al exportar el archivo CSV');
    }
  };

  // Toggle filter Hot Leads
  const handleToggleFilterHot = () => {
    const nextVal = !searchParams.filterHotOnly;
    setSearchParams(prev => ({ ...prev, filterHotOnly: nextVal }));
    fetchLeads({ ...searchParams, filterHotOnly: nextVal });
  };

  // Filtered and Sorted Leads calculation
  const displayedLeads = useMemo(() => {
    return leads
      .filter(l => {
        // Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = l.name.toLowerCase().includes(q);
          const matchAddr = l.address.toLowerCase().includes(q);
          const matchPhone = l.phone.includes(q);
          if (!matchName && !matchAddr && !matchPhone) return false;
        }

        // Status filter
        if (statusFilter !== 'todos' && l.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'hot_first') {
          if (a.isHotLead && !b.isHotLead) return -1;
          if (!a.isHotLead && b.isHotLead) return 1;
          return b.rating - a.rating;
        }
        if (sortBy === 'rating_desc') {
          return b.rating - a.rating;
        }
        if (sortBy === 'reviews_desc') {
          return b.reviewCount - a.reviewCount;
        }
        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [leads, searchQuery, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Frosted Glass Ambient Glow Background Orbs */}
      <div className="fixed top-[-100px] left-[-100px] w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-50px] right-[-50px] w-[350px] h-[350px] bg-indigo-600/20 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="fixed top-[35%] right-[-120px] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e293b]/90 backdrop-blur-xl border border-white/15 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SaaS Navigation Header */}
      <Header
        stats={stats}
        leads={leads}
        onExportCsv={handleExportCsv}
        filterHotOnly={searchParams.filterHotOnly}
        onToggleFilterHot={handleToggleFilterHot}
      />

      <main className="flex-1 pb-24 relative z-10">
        {/* Search & Extraction Hero */}
        <SearchHero
          searchParams={searchParams}
          onSearchChange={(updated) => setSearchParams(prev => ({ ...prev, ...updated }))}
          onExecuteSearch={() => fetchLeads()}
          isLoading={isLoading}
        />

        {/* Global Extraction Stats */}
        <StatsBanner stats={stats} />

        {/* Filtering & Sorting Toolbar */}
        <FilterToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          totalLeads={leads.length}
          filteredCount={displayedLeads.length}
          filterHotOnly={searchParams.filterHotOnly}
          onToggleFilterHot={handleToggleFilterHot}
        />

        {/* Error message banner */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-4 rounded-2xl bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 text-rose-300 flex items-center justify-between text-xs shadow-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => fetchLeads()}
                className="px-3 py-1 rounded-lg bg-rose-800/60 hover:bg-rose-700 text-white font-medium flex items-center space-x-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reintentar</span>
              </button>
            </div>
          </div>
        )}

        {/* Leads Results Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {isLoading ? (
            <div className="py-24 text-center space-y-4">
              <div className="inline-block relative">
                <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <Flame className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm font-semibold text-slate-300">
                Rastreando fichas de Google Places y enriqueciendo prospectos...
              </p>
              <p className="text-xs text-slate-500">
                Extrayendo teléfonos de WhatsApp directos y auditando presencia de sitio web.
              </p>
            </div>
          ) : displayedLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onAnalyzeLead={handleAnalyzeLead}
                  onStatusChange={handleStatusChange}
                  isAnalyzing={isAnalyzing && selectedLead?.id === lead.id}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-lg mx-auto mt-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No se encontraron prospectos con estos filtros</h3>
              <p className="text-xs text-slate-400 mt-1">
                Prueba relajando los filtros de búsqueda o buscando otro nicho/ciudad.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('todos');
                  if (searchParams.filterHotOnly) {
                    handleToggleFilterHot();
                  }
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Agent Dock Panel */}
      <FloatingAiDock
        leads={leads}
        searchParams={searchParams}
        onFilterHotOnly={handleToggleFilterHot}
      />

      {/* AI Lead Audit & Outreach Modal */}
      <LeadAuditModal
        lead={selectedLead}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        isLoading={isAnalyzing}
        initialTab={auditModalInitialTab}
      />
    </div>
  );
}
