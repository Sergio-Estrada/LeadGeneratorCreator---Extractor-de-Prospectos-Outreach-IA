import React from 'react';
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  ExternalLink,
  Instagram,
  Facebook,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  Monitor
} from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onAnalyzeLead: (lead: Lead, initialTab?: 'diagnostic' | 'webPrompt') => void;
  onStatusChange: (leadId: string, status: Lead['status']) => void;
  isAnalyzing: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onAnalyzeLead,
  onStatusChange,
  isAnalyzing,
}) => {
  const isHot = lead.isHotLead;

  const statusColors: Record<Lead['status'], string> = {
    nuevo: 'bg-slate-700/60 text-slate-300 border-slate-600',
    contactado: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    en_negociacion: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    cerrado: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    descartado: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  const statusLabels: Record<Lead['status'], string> = {
    nuevo: 'Nuevo',
    contactado: 'Contactado',
    en_negociacion: 'En Negociación',
    cerrado: 'Cliente Cerrado',
    descartado: 'Descartado',
  };

  return (
    <div
      id={`lead-card-${lead.id}`}
      className={`bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl p-5 border hover-card-elevation flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl ${
        isHot
          ? 'border-amber-500/40 shadow-lg shadow-amber-950/20'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top Accent Line for Hot Leads */}
      {isHot && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
      )}

      <div>
        {/* Header Tags */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Hot Lead Badge or Regular */}
          {isHot ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#f59e0b]/20 text-amber-300 border border-amber-500/40">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>PROSPECTO HOT (SIN WEB)</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Tiene Sitio Web</span>
            </span>
          )}

          {/* Rating Badge */}
          <div className="flex items-center space-x-1 bg-black/30 px-2 py-0.5 rounded-lg border border-white/10 text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{lead.rating}</span>
            <span className="text-slate-500 font-normal">({lead.reviewCount})</span>
          </div>
        </div>

        {/* Business Title & Category */}
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug line-clamp-1">
          {lead.name}
        </h3>
        <p className="text-xs text-indigo-400 font-medium mt-0.5">
          {lead.category || lead.niche}
        </p>

        {/* Location & Address */}
        <div className="mt-2.5 flex items-start space-x-1.5 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{lead.address}</span>
        </div>

        {/* Phone & Direct Info */}
        <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-slate-300">
          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-mono text-slate-200">{lead.phone}</span>
        </div>

        {/* Social & Maps Links */}
        <div className="mt-3 flex items-center space-x-2 pt-2.5 border-t border-white/10 text-xs">
          <a
            href={lead.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition px-2 py-1 rounded-lg bg-white/5 border border-white/10"
            title="Ver en Google Maps"
          >
            <MapPin className="w-3 h-3 text-red-400" />
            <span>Maps</span>
          </a>

          {lead.websiteUrl ? (
            <a
              href={lead.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20"
              title="Abrir sitio web actual"
            >
              <Globe className="w-3 h-3" />
              <span>Web</span>
            </a>
          ) : (
            <span className="text-[11px] text-amber-400/90 font-medium px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Sin URL Web</span>
            </span>
          )}

          {lead.instagramUrl && (
            <a
              href={lead.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition p-1.5 rounded-lg bg-white/5 border border-white/10"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          )}

          {lead.facebookUrl && (
            <a
              href={lead.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition p-1.5 rounded-lg bg-white/5 border border-white/10"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
        {/* WhatsApp Direct Action Button (Success Neon Green #10b981) */}
        <a
          id={`btn-whatsapp-${lead.id}`}
          href={lead.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (lead.status === 'nuevo') {
              onStatusChange(lead.id, 'contactado');
            }
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-[#10b981] hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-950/40 whatsapp-glow active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Enviar WhatsApp Directo (wa.me)</span>
        </a>

        {/* AI Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`btn-ai-audit-${lead.id}`}
            type="button"
            onClick={() => onAnalyzeLead(lead, 'diagnostic')}
            disabled={isAnalyzing}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition border ${
              lead.aiAudit
                ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-400/30'
                : 'bg-[#2563eb] hover:bg-blue-600 text-white border-white/10 shadow-md shadow-blue-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span className="truncate">{lead.aiAudit ? 'Auditoría' : 'Auditar IA'}</span>
          </button>

          <button
            id={`btn-web-prompt-${lead.id}`}
            type="button"
            onClick={() => onAnalyzeLead(lead, 'webPrompt')}
            disabled={isAnalyzing}
            className="py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition border bg-gradient-to-r from-emerald-600/25 to-teal-600/25 hover:from-emerald-600/35 hover:to-teal-600/35 text-emerald-300 border-emerald-500/30 shadow-md shadow-emerald-950/20"
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Prompt Web</span>
          </button>
        </div>

        {/* Pipeline Stage Selector */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400 text-[11px]">Estado:</span>
          <select
            id={`select-status-${lead.id}`}
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
            className={`text-xs px-2.5 py-1 rounded-lg border focus:outline-none bg-[#0f172a]/80 ${statusColors[lead.status]}`}
          >
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="en_negociacion">En Negociación</option>
            <option value="cerrado">Cerrado ✓</option>
            <option value="descartado">Descartado</option>
          </select>
        </div>
      </div>
    </div>
  );
};
