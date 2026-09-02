export interface Lead {
  id: string;
  name: string;
  category: string;
  niche: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  whatsappUrl: string;
  hasWebsite: boolean;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleMapsUrl: string;
  isHotLead: boolean;
  status: 'nuevo' | 'contactado' | 'en_negociacion' | 'cerrado' | 'descartado';
  contactDate?: string;
  notes?: string;
  aiAudit?: LeadAiAudit;
}

export interface LeadAiAudit {
  summary: string;
  conversionFlaws: string[];
  lostRevenueEstimate: string;
  whatsappPitch: string;
  emailPitch: string;
  servicePackage: string[];
  recommendedQuote: string;
  analyzedAt: string;
  websitePrompt?: WebsitePromptPackage;
}

export interface WebsitePromptPackage {
  businessName: string;
  address: string;
  rating: number;
  reviewCount: number;
  phone: string;
  category: string;
  city: string;
  country: string;
  masterPrompt: string;
  calComPrompt: string;
  aiBotPrompt: string;
  adminCmsPrompt: string;
  sectionsBreakdown: {
    title: string;
    description: string;
    keyFeature: string;
  }[];
  palette: {
    name: string;
    primary: string;
    accent: string;
    background: string;
    description: string;
  };
  generatedAt: string;
}

export interface SearchParams {
  niche: string;
  location: string;
  filterHotOnly: boolean;
  minRating: number;
  limit: number;
  apifyApiKey?: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'filter_hot' | 'generate_pitches' | 'search_niche' | 'export';
    label: string;
    payload?: any;
  };
}

export interface ExtractionStats {
  totalScraped: number;
  hotLeadsCount: number;
  whatsappReadyCount: number;
  averageRating: number;
  conversionOpportunityUSD: number;
}
