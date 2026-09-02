import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  ChevronDown,
  Send,
  Loader2,
  HelpCircle,
  Flame,
  Zap,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { AgentChatMessage, Lead, SearchParams } from '../types';

interface FloatingAiDockProps {
  leads: Lead[];
  searchParams: SearchParams;
  onFilterHotOnly: () => void;
}

const DEFAULT_MESSAGES: AgentChatMessage[] = [
  {
    id: 'msg-init',
    role: 'assistant',
    content: '¡Hola! Soy tu Agente IA de Ventas. Estoy analizando los prospectos extraídos. Te ayudo a priorizar empresas sin web, personalizar mensajes de WhatsApp y rebatir objeciones para cerrar más clientes.',
    timestamp: 'Ahora mismo',
  },
];

export const FloatingAiDock: React.FC<FloatingAiDockProps> = ({
  leads,
  searchParams,
  onFilterHotOnly,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AgentChatMessage[]>(DEFAULT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const hotCount = leads.filter(l => l.isHotLead).length;

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: AgentChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            niche: searchParams.niche,
            location: searchParams.location,
            totalLeads: leads.length,
            hotLeads: hotCount,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const aiMsg: AgentChatMessage = {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: data.suggestedAction,
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Error al procesar mensaje');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'No pude conectar con el servidor temporalmente. Por favor intenta de nuevo en unos segundos.',
          timestamp: 'Error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(DEFAULT_MESSAGES);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Dock Panel */}
      {isOpen && (
        <div
          id="ai-agent-dock-panel"
          className="w-[92vw] sm:w-[380px] md:w-[420px] h-[520px] max-h-[82vh] rounded-2xl frosted-dock flex flex-col mb-3 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 border border-white/10"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#818cf8] flex items-center justify-center shadow-md border border-white/10">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-white">Agente IA de Ventas</h4>
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400">Gemini 3.8 Flash • Copiloto B2B</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                title="Reiniciar conversación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-close-ai-dock"
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                title="Minimizar panel"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Pill */}
          <div className="px-3.5 py-1.5 bg-black/20 border-b border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center space-x-1 truncate max-w-[240px]">
              <Zap className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate font-medium">{searchParams.niche} en {searchParams.location}</span>
            </div>
            <div className="flex items-center space-x-1 text-[#f59e0b] font-bold shrink-0">
              <Flame className="w-3 h-3" />
              <span>{hotCount} Hot</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#2563eb] text-white shadow-md'
                      : 'bg-white/5 text-slate-200 border border-white/10 shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Suggested Action inside AI message */}
                {msg.suggestedAction && (
                  <button
                    type="button"
                    onClick={() => {
                      if (msg.suggestedAction?.type === 'filter_hot') {
                        onFilterHotOnly();
                      }
                    }}
                    className="mt-2 text-[11px] px-2.5 py-1 rounded-xl bg-[#f59e0b]/20 text-amber-300 border border-amber-500/40 hover:bg-[#f59e0b]/30 transition flex items-center space-x-1 font-semibold"
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{msg.suggestedAction.label}</span>
                  </button>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Generando respuesta estratégica...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-black/20 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleSendMessage('¿Cómo usar los Prompts de Web Maestro generados para crear la página en Google AI Studio o Cursor con Cal.com y WhatsApp?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap transition"
            >
              🚀 ¿Cómo usar los Prompts Web?
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('¿Cuáles son los mejores prospectos para contactar hoy de esta lista?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap transition"
            >
              🎯 ¿Cuáles priorizar hoy?
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('¿Cómo rebatir la objeción: "ya tenemos Facebook e Instagram, no necesitamos web"?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap transition"
            >
              🛡️ Rebatir objeción Instagram
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Dame 3 consejos clave para no ser ignorado en WhatsApp frío')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap transition"
            >
              💬 Tips WhatsApp frío
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white/5 border-t border-white/10 flex items-center space-x-2"
          >
            <input
              id="input-ai-agent-chat"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregúntale a tu Agente IA de Ventas..."
              disabled={isLoading}
              className="flex-1 bg-[#0f172a]/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              id="btn-send-ai-agent"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white disabled:opacity-40 transition shadow-md shadow-blue-500/25"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Dock Button */}
      <button
        id="btn-toggle-ai-dock"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="frosted-trigger px-4 py-2.5 rounded-full flex items-center space-x-2.5 text-white font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/10"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2563eb] to-[#818cf8] flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] absolute -top-1 -right-1 ring-2 ring-slate-900 animate-pulse" />
        </div>
        <span>{isOpen ? 'Ocultar Agente IA' : 'Agente IA Ventas'}</span>
        {hotCount > 0 && !isOpen && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#f59e0b]/20 text-amber-300 font-extrabold border border-amber-500/30">
            {hotCount} Hot
          </span>
        )}
      </button>
    </div>
  );
};
