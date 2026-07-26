import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, User as UserIcon, ShoppingBag, ArrowRight, Trash2, Database, ShieldCheck, Zap } from 'lucide-react';
import { Product, UserProfile, AIConversationMessage } from '../types';
import { getAIConciergeHistory, saveAIConciergeMessage } from '../lib/firebase';

interface AIConciergeViewProps {
  user: UserProfile | null;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const AIConciergeView: React.FC<AIConciergeViewProps> = ({
  user,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [messages, setMessages] = useState<AIConversationMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Which AI hardware rig is best for 3D neural rendering and deep learning?",
    "Compare Noor AI Neural Pods Pro against standard studio equipment.",
    "I need a complete AI setup for acoustic audio engineering under $350.",
    "What makes the Quantum Neural Processing Chip different from traditional CPUs?",
  ];

  useEffect(() => {
    let isMounted = true;
    setSyncing(true);
    const userId = user?.uid || 'guest-session';
    
    getAIConciergeHistory(userId).then((history) => {
      if (!isMounted) return;
      if (history.length === 0) {
        const welcomeMsg: AIConversationMessage = {
          role: 'assistant',
          text: `👋 Welcome to your personal **Noor AI Neural Concierge**!\n\nI am powered live by **Google Gemini 3 Flash** and synced directly with our Cloud Firestore catalog. Whether you need hardware sizing for deep learning models, custom acoustic studio pairings, or spec comparisons, I am here to guide you.\n\nHow may I optimize your tech ecosystem today?`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([welcomeMsg]);
        if (user?.uid) {
          saveAIConciergeMessage(user.uid, welcomeMsg).catch(console.error);
        }
      } else {
        setMessages(history);
      }
      setSyncing(false);
    });

    return () => { isMounted = false; };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: AIConversationMessage = {
      role: 'user',
      text: messageText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const userId = user?.uid || 'guest-session';
    if (user?.uid) {
      saveAIConciergeMessage(user.uid, userMsg).catch(console.error);
    }

    try {
      const response = await fetch('/api/ai-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          history: messages,
          catalog: products,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: AIConversationMessage = {
        role: 'assistant',
        text: data.reply,
        recommendedProductIds: data.recommendedIds || [],
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (user?.uid) {
        saveAIConciergeMessage(user.uid, assistantMsg).catch(console.error);
      }
    } catch (error: any) {
      console.error('Concierge error:', error);
      const fallbackMsg: AIConversationMessage = {
        role: 'assistant',
        text: `⚠️ **Offline/Demo Neural Response (${error.message})**\n\nBased on your query regarding our high-performance catalog, I strongly recommend examining the **Noor AI Neural Pods Pro** and **Quantum Neural Processing Chip**. Both are engineered with aerospace-grade acoustics and ultra-low latency architecture tailored for advanced developers!`,
        recommendedProductIds: ['noor-pod-pro', 'noor-ai-chip'],
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Live Neural Advisor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <span>Noor AI Shopping Concierge</span>
          </h1>
          <p className="text-indigo-200 text-sm max-w-xl leading-relaxed">
            Talk directly to our AI Neural Advisor powered by Google Gemini 3 Flash. Get personalized hardware sizing, studio acoustics pairings, and instant interactive product cards synced to Cloud Firestore!
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <Database className="w-4 h-4" />
            <span>Firestore Persistent Logs Active</span>
          </div>
          <div className="text-[11px] text-indigo-200">
            Session: <code className="bg-black/30 px-1.5 py-0.5 rounded text-indigo-100 font-mono">{user?.displayName || 'Guest User'}</code>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <span>Noor Concierge AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-neutral-500">Google Gemini 3 Flash • E-Commerce Advisor</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {syncing && (
              <span className="text-xs text-neutral-400 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-neutral-200">
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Syncing Firestore...</span>
              </span>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-neutral-50/50 to-white">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const matchedProducts = msg.recommendedProductIds
              ? products.filter(p => msg.recommendedProductIds?.includes(p.id))
              : [];

            return (
              <div key={msg.id || idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-3`}>
                <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                    isUser 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm'
                  }`}>
                    {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-none shadow-2xs'
                  }`}>
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>
                    {msg.createdAt && (
                      <div className={`text-[10px] mt-2 ${isUser ? 'text-indigo-200 text-right' : 'text-neutral-400'}`}>
                        {msg.createdAt}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Product Cards inside AI message */}
                {!isUser && matchedProducts.length > 0 && (
                  <div className="pl-11 w-full max-w-2xl space-y-2 pt-1 animate-in fade-in duration-300">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Recommended Catalog Matches:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchedProducts.map(prod => (
                        <div key={prod.id} className="p-3 rounded-2xl bg-white border border-indigo-100 hover:border-indigo-300 shadow-2xs transition-all flex flex-col justify-between gap-3 group">
                          <div className="flex items-center space-x-3">
                            <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-100 shrink-0" />
                            <div className="overflow-hidden">
                              <h4 className="font-bold text-xs text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">{prod.name}</h4>
                              <div className="text-xs font-extrabold text-indigo-600">${prod.price.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                            <button
                              onClick={() => onSelectProduct(prod)}
                              className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <span>View Specs</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onAddToCart(prod, 1)}
                              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-2xs flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-neutral-500 rounded-tl-none shadow-2xs text-xs flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Noor Concierge AI is synthesizing neural recommendations...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Starters */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">Ask Noor:</span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-neutral-200/80 hover:border-indigo-300 text-xs font-medium text-neutral-700 transition-all shrink-0 whitespace-nowrap shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Noor Concierge for hardware sizing, specs, or custom studio pairings..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm bg-neutral-50/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="hidden sm:inline text-sm">Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
