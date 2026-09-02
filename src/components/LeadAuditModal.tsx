import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Flame,
  MessageCircle,
  Mail,
  Check,
  Copy,
  TrendingDown,
  PackageCheck,
  DollarSign,
  AlertTriangle,
  Calendar,
  Bot,
  SlidersHorizontal,
  Monitor,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Clock,
  Send,
  Loader2,
  Globe,
  Star,
  Settings
} from 'lucide-react';
import { Lead } from '../types';

interface LeadAuditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  initialTab?: 'diagnostic' | 'webPrompt';
}

export const LeadAuditModal: React.FC<LeadAuditModalProps> = ({
  lead,
  isOpen,
  onClose,
  isLoading,
  initialTab = 'diagnostic',
}) => {
  const [mainView, setMainView] = useState<'diagnostic' | 'webPrompt'>(initialTab);
  const [activeOutreachTab, setActiveOutreachTab] = useState<'whatsapp' | 'email' | 'package'>('whatsapp');
  const [activePromptTab, setActivePromptTab] = useState<'master' | 'calcom' | 'aiBot' | 'adminCms' | 'preview'>('master');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Interactive preview states
  const [previewAdminOpen, setPreviewAdminOpen] = useState(false);
  const [previewAiChatOpen, setPreviewAiChatOpen] = useState(false);
  const [previewSelectedDate, setPreviewSelectedDate] = useState('2025-05-15');
  const [previewSelectedSlot, setPreviewSelectedSlot] = useState('10:30 AM');
  const [previewBooked, setPreviewBooked] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([]);
  const [userChatInput, setUserChatInput] = useState('');

  // Sync initial tab when opening
  useEffect(() => {
    if (isOpen) {
      setMainView(initialTab);
      setPreviewBooked(false);
      setPreviewAdminOpen(false);
      setPreviewAiChatOpen(false);
      if (lead) {
        setAiChatMessages([
          {
            sender: 'bot',
            text: `¡Hola! 👋 Soy el Asistente Virtual 24/7 de ${lead.name}. Estamos ubicados en ${lead.address}. ¿Deseas consultar nuestros servicios de ${lead.category || lead.niche} o agendar una cita directamente?`,
          },
        ]);
      }
    }
  }, [isOpen, initialTab, lead]);

  if (!isOpen || !lead) return null;

  const audit = lead.aiAudit;
  const promptPkg = audit?.websitePrompt;
  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
  const slug = (lead.name || 'negocio').toLowerCase().replace(/[^a-z0-9]/g, '');

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const getPersonalizedWhatsAppUrl = () => {
    if (!audit?.whatsappPitch) return lead.whatsappUrl;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(audit.whatsappPitch)}`;
  };

  const handleSendAiChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userText = userChatInput;
    setUserChatInput('');
    setAiChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      let botResponse = `Con gusto te asesoramos sobre ${lead.name}. Nuestro equipo en ${lead.address} atiende de Lunes a Sábado. Te sugerimos agendar tu hora en el calendario de Cal.com aquí en la web o escribirnos directo al WhatsApp ${lead.phone}.`;
      if (userText.toLowerCase().includes('cita') || userText.toLowerCase().includes('horario')) {
        botResponse = `¡Perfecto! Puedes seleccionar libremente tu día y hora en nuestro módulo interactivo de Cal.com más abajo, o enviarnos un WhatsApp al ${lead.phone} para confirmar tu espacio de inmediato.`;
      } else if (userText.toLowerCase().includes('donde') || userText.toLowerCase().includes('direccion')) {
        botResponse = `Estamos ubicados en: ${lead.address}, ${lead.city}. ¡La dirección está siempre visible en la barra superior de nuestra web para tu comodidad!`;
      }
      setAiChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden text-slate-200 z-10 my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#818cf8] flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug line-clamp-1">
                  {lead.name}
                </h3>
                {lead.isHotLead && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f59e0b]/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1 shrink-0">
                    <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>Sin Web (Hot)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                <span>{lead.category || lead.niche}</span>
                <span>•</span>
                <span className="flex items-center text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                  {lead.rating} ({lead.reviewCount})
                </span>
                <span>•</span>
                <span className="truncate max-w-[200px]">{lead.city}, {lead.country}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-close-audit-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition border border-transparent hover:border-white/10 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Mode Navigation Switch: Diagnóstico vs Prompt Web Maestro */}
        <div className="px-5 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between shrink-0 gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10 space-x-1">
            <button
              id="btn-tab-diagnostic"
              type="button"
              onClick={() => setMainView('diagnostic')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                mainView === 'diagnostic'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnóstico & Cierre B2B</span>
            </button>

            <button
              id="btn-tab-web-prompt"
              type="button"
              onClick={() => setMainView('webPrompt')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                mainView === 'webPrompt'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-300" />
              <span>Prompt Web Maestro (IA + Cal.com + WhatsApp + Admin)</span>
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-400/40">
                PRO
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[260px] font-mono text-[11px]">{lead.address}</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-[#2563eb] animate-spin" />
                <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Sintetizando Ficha Real de Google Maps con Gemini 3.8 Flash...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Extrayendo dirección física permanente, reputación de reseñas, teléfono de WhatsApp y ensamblando prompts para landing page con Cal.com y CMS Admin.
                </p>
              </div>
            </div>
          ) : audit ? (
            <>
              {/* ======================================================== */}
              {/* VIEW 1: DIAGNÓSTICO ESTRATÉGICO & OUTREACH EN FRÍO      */}
              {/* ======================================================== */}
              {mainView === 'diagnostic' && (
                <div className="space-y-5">
                  {/* Summary & Lost Revenue */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5">
                    <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Diagnóstico Estratégico de Presencia Digital</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-normal">
                      {audit.summary}
                    </p>

                    <div className="mt-3 flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                      <TrendingDown className="w-4 h-4 shrink-0 text-rose-400" />
                      <div>
                        <span className="font-bold">Pérdida estimada de facturación: </span>
                        <span>{audit.lostRevenueEstimate} debido a la falta de canal web propio con reservas directas.</span>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Flaws */}
                  {audit.conversionFlaws && audit.conversionFlaws.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5">
                      <div className="flex items-center space-x-2 text-[#f59e0b] text-xs font-bold uppercase tracking-wider mb-2.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Fugas de Conversión Detectadas (Puntos Débiles)</span>
                      </div>
                      <ul className="space-y-2">
                        {audit.conversionFlaws.map((flaw, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
                            <span>{flaw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Outreach Tabs */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Estrategia de Prospección Directa
                      </span>
                      <div className="flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                        <button
                          type="button"
                          onClick={() => setActiveOutreachTab('whatsapp')}
                          className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                            activeOutreachTab === 'whatsapp'
                              ? 'bg-[#10b981] text-white shadow-md shadow-emerald-500/20'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveOutreachTab('email')}
                          className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                            activeOutreachTab === 'email'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveOutreachTab('package')}
                          className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                            activeOutreachTab === 'package'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Paquete & Cotización</span>
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp Pitch */}
                    {activeOutreachTab === 'whatsapp' && (
                      <div className="mt-3 bg-black/30 border border-white/10 rounded-2xl p-4 relative space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                            <MessageCircle className="w-4 h-4" />
                            <span>Mensaje Directo para WhatsApp (Baja Fricción)</span>
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">{lead.phone}</span>
                        </div>
                        <div className="bg-[#0f172a]/90 p-3.5 rounded-xl border border-white/10 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans font-normal">
                          {audit.whatsappPitch}
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(audit.whatsappPitch, 'whatsapp')}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center space-x-1.5 border border-white/10 transition"
                          >
                            {copiedField === 'whatsapp' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copiar Mensaje</span>
                              </>
                            )}
                          </button>
                          <a
                            href={getPersonalizedWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-emerald-950/40"
                          >
                            <Send className="w-3.5 h-3.5 fill-white" />
                            <span>Abrir Chat en WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email Pitch */}
                    {activeOutreachTab === 'email' && (
                      <div className="mt-3 bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="bg-[#0f172a]/90 p-3.5 rounded-xl border border-white/10 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {audit.emailPitch}
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleCopy(audit.emailPitch, 'email')}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center space-x-1.5 border border-white/10 transition"
                          >
                            {copiedField === 'email' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copiar Email</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Package & Pricing */}
                    {activeOutreachTab === 'package' && (
                      <div className="mt-3 bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Paquete de Cierre Sugerido
                          </span>
                          <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] border border-emerald-500/30 text-xs font-bold">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Cotización: {audit.recommendedQuote}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {audit.servicePackage?.map((service, idx) => (
                            <div key={idx} className="flex items-center space-x-2 p-2.5 rounded-xl bg-black/20 border border-white/10 text-xs text-slate-200">
                              <PackageCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                              <span>{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 2: GENERADOR DE PROMPT WEB MAESTRO (PROSPECTO REAL) */}
              {/* ======================================================== */}
              {mainView === 'webPrompt' && (
                <div className="space-y-4">
                  {/* Real Business Data Chips */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Domicilio Físico</div>
                        <div className="text-white font-medium truncate text-[11px]" title={lead.address}>
                          {lead.address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">WhatsApp Directo</div>
                        <div className="text-white font-mono text-[11px] truncate">
                          {lead.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Agendamiento</div>
                        <div className="text-white text-[11px] truncate">
                          Cal.com ({slug})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">IA Nativa + CMS</div>
                        <div className="text-white text-[11px] truncate">
                          Copiloto 24/7 & Admin
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub-tab Navigation */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 flex-wrap gap-2">
                    <div className="flex space-x-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => setActivePromptTab('master')}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition shrink-0 ${
                          activePromptTab === 'master'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                        <span>Prompt Maestro Completo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePromptTab('calcom')}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition shrink-0 ${
                          activePromptTab === 'calcom'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        <span>Cal.com Citas</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePromptTab('aiBot')}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition shrink-0 ${
                          activePromptTab === 'aiBot'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bot className="w-3.5 h-3.5 text-purple-300" />
                        <span>Asistente IA 24/7</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePromptTab('adminCms')}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition shrink-0 ${
                          activePromptTab === 'adminCms'
                            ? 'bg-slate-700 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
                        <span>Panel Admin CMS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePromptTab('preview')}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition shrink-0 ${
                          activePromptTab === 'preview'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Mockup Interactivo</span>
                      </button>
                    </div>

                    {/* Copy Current Tab Button */}
                    {activePromptTab !== 'preview' && (
                      <button
                        type="button"
                        onClick={() => {
                          const textToCopy =
                            activePromptTab === 'master'
                              ? promptPkg?.masterPrompt || ''
                              : activePromptTab === 'calcom'
                              ? promptPkg?.calComPrompt || ''
                              : activePromptTab === 'aiBot'
                              ? promptPkg?.aiBotPrompt || ''
                              : promptPkg?.adminCmsPrompt || '';
                          handleCopy(textToCopy, activePromptTab);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-md shadow-emerald-950/40"
                      >
                        {copiedField === activePromptTab ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Copiado al Portapapeles!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Prompt Listo para Pegar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* TAB CONTENT: MASTER PROMPT */}
                  {activePromptTab === 'master' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="flex items-center space-x-1.5 text-blue-300 font-semibold">
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                          <span>Listo para copiar y pegar en Google AI Studio, Cursor, Lovable, Bolt o v0</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {promptPkg?.masterPrompt ? `${promptPkg.masterPrompt.length} caracteres` : ''}
                        </span>
                      </div>

                      <div className="relative">
                        <textarea
                          readOnly
                          value={promptPkg?.masterPrompt}
                          rows={14}
                          className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 resize-y leading-relaxed shadow-inner"
                        />
                      </div>

                      {/* Sections Checklist */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Arquitectura y Módulos Incluidos en el Prompt</span>
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {promptPkg?.sectionsBreakdown?.map((sec, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-black/20 border border-white/10">
                              <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400" />
                                <span>{sec.title}</span>
                              </div>
                              <p className="text-slate-400 text-[11px] mt-0.5">{sec.description}</p>
                              <div className="text-[10px] text-indigo-300 mt-1 font-mono">
                                ↳ {sec.keyFeature}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: CAL.COM */}
                  {activePromptTab === 'calcom' && (
                    <div className="space-y-3">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200">
                        <div className="font-bold flex items-center space-x-1.5 text-amber-300 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Integración Cal.com con Libertad de Fecha y Hora</span>
                        </div>
                        <p>
                          Este módulo instruye a la IA a implementar un componente de reserva donde el paciente o cliente puede seleccionar con total libertad cualquier día del calendario y los horarios de 30 o 60 minutos disponibles, recibiendo confirmación directa vía WhatsApp.
                        </p>
                      </div>
                      <textarea
                        readOnly
                        value={promptPkg?.calComPrompt}
                        rows={8}
                        className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  {/* TAB CONTENT: AI BOT */}
                  {activePromptTab === 'aiBot' && (
                    <div className="space-y-3">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-xs text-purple-200">
                        <div className="font-bold flex items-center space-x-1.5 text-purple-300 text-sm mb-1">
                          <Bot className="w-4 h-4" />
                          <span>Asistente Virtual IA Nativo 24/7 (Embedded Copilot)</span>
                        </div>
                        <p>
                          Define el rol, tono y base de conocimiento del chatbot interactivo embebido en la web de {lead.name}. Responde dudas frecuentes sobre {lead.category || lead.niche} y canaliza a los clientes para agendar cita en Cal.com o chatear en WhatsApp.
                        </p>
                      </div>
                      <textarea
                        readOnly
                        value={promptPkg?.aiBotPrompt}
                        rows={8}
                        className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  {/* TAB CONTENT: ADMIN CMS */}
                  {activePromptTab === 'adminCms' && (
                    <div className="space-y-3">
                      <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-xs text-slate-300">
                        <div className="font-bold flex items-center space-x-1.5 text-white text-sm mb-1">
                          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                          <span>Panel de Administración CMS (Sin Tocar Código)</span>
                        </div>
                        <p>
                          Instruye a la IA a generar una ruta modal protegida (/admin) donde el dueño del negocio puede editar en tiempo real: Domicilio físico, teléfono de WhatsApp, link de Cal.com, servicios y precios con guardado inmediato en el navegador.
                        </p>
                      </div>
                      <textarea
                        readOnly
                        value={promptPkg?.adminCmsPrompt}
                        rows={8}
                        className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  {/* TAB CONTENT: INTERACTIVE LIVE PREVIEW MOCKUP */}
                  {activePromptTab === 'preview' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs flex items-center justify-between">
                        <span className="text-slate-300">
                          🖥️ Simulación interactiva de la web que construirá el prompt para <strong>{lead.name}</strong>:
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setPreviewAdminOpen(!previewAdminOpen)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center space-x-1 border border-white/10"
                          >
                            <Settings className="w-3 h-3 text-blue-400" />
                            <span>{previewAdminOpen ? 'Cerrar Modo Admin' : 'Probar Modo Admin'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Mockup Container with Browser Frame */}
                      <div className="rounded-2xl border border-white/15 overflow-hidden bg-[#090d16] shadow-2xl relative">
                        {/* Browser Top Bar */}
                        <div className="bg-black/60 px-4 py-2 border-b border-white/10 flex items-center space-x-2 text-xs">
                          <div className="flex space-x-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          </div>
                          <div className="flex-1 text-center font-mono text-[11px] text-slate-400 bg-white/5 rounded-md py-0.5 border border-white/5 truncate px-2">
                            https://www.{slug}.com (Landing & Homepage)
                          </div>
                        </div>

                        {/* 1. STICKY TOP ANNOUNCEMENT BAR (DOMICILIO SIEMPRE VISIBLE) */}
                        <div className="bg-blue-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between sticky top-0 z-20 shadow-md">
                          <div className="flex items-center space-x-2 truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                            <span className="truncate">
                              <strong>Domicilio:</strong> {lead.address}, {lead.city}
                            </span>
                          </div>
                          <a
                            href={lead.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] underline hover:text-amber-200 shrink-0 ml-2"
                          >
                            Ver en Google Maps
                          </a>
                        </div>

                        {/* Navigation inside mockup */}
                        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#0f172a]/80 backdrop-blur-md">
                          <div className="font-bold text-white tracking-tight flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                              {lead.name.charAt(0)}
                            </div>
                            <span className="text-sm">{lead.name}</span>
                          </div>
                          <div className="hidden sm:flex items-center space-x-4 text-xs text-slate-300 font-medium">
                            <span className="text-blue-400">Inicio</span>
                            <span>Servicios</span>
                            <span>Ubicación</span>
                            <span>Citas Cal.com</span>
                          </div>
                          <a
                            href={lead.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-xl bg-[#10b981] hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {/* Admin Panel Simulation overlay if toggled */}
                        {previewAdminOpen && (
                          <div className="bg-slate-900/95 border-b border-amber-500/30 p-4 text-xs space-y-3">
                            <div className="flex items-center justify-between text-amber-300 font-bold">
                              <span className="flex items-center space-x-1.5">
                                <Settings className="w-3.5 h-3.5" />
                                <span>Panel de Control Admin CMS (Simulación en Vivo)</span>
                              </span>
                              <span className="text-[10px] text-slate-400">Autenticado como: admin@negocio.com</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Nombre Comercial</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={lead.name}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Dirección Física</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={lead.address}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Teléfono WhatsApp</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={lead.phone}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                                />
                              </div>
                            </div>
                            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>El cliente puede editar todo el sitio web sin tocar una sola línea de código.</span>
                            </div>
                          </div>
                        )}

                        {/* Mockup Hero Section */}
                        <div className="p-6 text-center space-y-4 max-w-2xl mx-auto py-8">
                          {/* Google Stars Pill */}
                          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{lead.rating} de 5.0 en Google</span>
                            <span className="text-slate-400 font-normal">({lead.reviewCount} opiniones de pacientes/clientes)</span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                            Atención Premium de {lead.category || lead.niche} en {lead.city}
                          </h2>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                            Visítanos en <strong>{lead.address}</strong> o agenda tu cita directamente en nuestro calendario online con confirmación inmediata.
                          </p>

                          {/* Action CTAs */}
                          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <a
                              href={lead.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-950/40"
                            >
                              <MessageCircle className="w-4 h-4 fill-white" />
                              <span>Escribir por WhatsApp Directo</span>
                            </a>
                            <a
                              href="#calcom-booking-mock"
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('calcom-booking-mock')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-500/20"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>Agendar Cita en Cal.com</span>
                            </a>
                          </div>
                        </div>

                        {/* 2. CAL.COM INTEGRATED BOOKING MODULE */}
                        <div id="calcom-booking-mock" className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Agendamiento Libre con Cal.com</span>
                              </span>
                              <h4 className="text-base font-bold text-white mt-0.5">
                                Escoge con libertad la fecha y hora de tu cita
                              </h4>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              cal.com/{slug}/consulta
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
                            {/* Date Selector */}
                            <div>
                              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                                1. Selecciona el Día
                              </label>
                              <input
                                type="date"
                                value={previewSelectedDate}
                                onChange={(e) => setPreviewSelectedDate(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">
                                Días disponibles de Lunes a Sábado.
                              </p>
                            </div>

                            {/* Time Slots */}
                            <div>
                              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                                2. Selecciona la Hora Disponible
                              </label>
                              <div className="grid grid-cols-3 gap-1.5">
                                {['09:00 AM', '10:30 AM', '12:00 PM', '03:00 PM', '04:30 PM', '06:00 PM'].map(
                                  (slot) => (
                                    <button
                                      key={slot}
                                      type="button"
                                      onClick={() => {
                                        setPreviewSelectedSlot(slot);
                                        setPreviewBooked(false);
                                      }}
                                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                                        previewSelectedSlot === slot
                                          ? 'bg-[#2563eb] text-white border-blue-400'
                                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                                      }`}
                                    >
                                      {slot}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Booking confirmation action */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="text-xs text-slate-300">
                              Cita seleccionada: <strong>{previewSelectedDate}</strong> a las <strong>{previewSelectedSlot}</strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPreviewBooked(true)}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md"
                            >
                              <Check className="w-4 h-4" />
                              <span>Confirmar Agendamiento</span>
                            </button>
                          </div>

                          {previewBooked && (
                            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>
                                ¡Cita agendada para {previewSelectedDate} a las {previewSelectedSlot}! Se enviará notificación al WhatsApp {lead.phone} y la cita se registrará en Google Calendar.
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 3. PHYSICAL LOCATION & DIRECTIONS SECTION */}
                        <div className="p-6 border-t border-white/10 space-y-3 bg-[#0a0f1d]">
                          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Ubicación Exacta & Cómo Llegar</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div>
                              <div className="text-sm font-bold text-white">{lead.name}</div>
                              <div className="text-xs text-slate-300 mt-0.5">{lead.address}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{lead.city}, {lead.country}</div>
                            </div>
                            <a
                              href={lead.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-1.5 border border-white/10 transition shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                              <span>Abrir Navegación GPS</span>
                            </a>
                          </div>
                        </div>

                        {/* 4. FLOATING NATIVE AI ASSISTANT WIDGET (SIMULATION) */}
                        <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end">
                          {previewAiChatOpen && (
                            <div className="w-72 sm:w-80 bg-[#1e293b] border border-white/20 rounded-2xl shadow-2xl p-3 mb-2 space-y-2 text-xs backdrop-blur-xl">
                              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                                <div className="flex items-center space-x-1.5 text-white font-bold">
                                  <Bot className="w-4 h-4 text-indigo-400" />
                                  <span>Asistente Virtual 24/7</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPreviewAiChatOpen(false)}
                                  className="text-slate-400 hover:text-white"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="max-h-44 overflow-y-auto space-y-2 p-1 font-sans">
                                {aiChatMessages.map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-2 rounded-xl text-xs leading-relaxed ${
                                      msg.sender === 'bot'
                                        ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20'
                                        : 'bg-white/10 text-white ml-6 text-right'
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                ))}
                              </div>

                              <form onSubmit={handleSendAiChatMessage} className="flex gap-1 pt-1">
                                <input
                                  type="text"
                                  placeholder="Pregunta sobre servicios o citas..."
                                  value={userChatInput}
                                  onChange={(e) => setUserChatInput(e.target.value)}
                                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </form>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setPreviewAiChatOpen(!previewAiChatOpen)}
                            className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#818cf8] text-white shadow-xl shadow-blue-500/40 flex items-center justify-center border border-white/20 hover:scale-105 transition"
                            title="Probar Asistente IA Embebido"
                          >
                            <Bot className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hay auditoría generada aún para este prospecto.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Datos en tiempo real de Google Maps • Gemini 3.8 Flash Engine</span>
          </div>

          <div className="flex items-center space-x-2">
            {promptPkg && (
              <button
                type="button"
                onClick={() => handleCopy(promptPkg.masterPrompt, 'footer-master')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-md shadow-blue-500/20"
              >
                {copiedField === 'footer-master' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Prompt Maestro Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Prompt Maestro Web</span>
                  </>
                )}
              </button>
            )}

            <button
              id="btn-footer-close"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
