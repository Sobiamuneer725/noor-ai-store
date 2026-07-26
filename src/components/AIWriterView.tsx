import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, Store, RefreshCw, Wand2 } from 'lucide-react';
import { Product } from '../types';

interface AIWriterViewProps {
  products: Product[];
  initialProductName?: string;
}

export const AIWriterView: React.FC<AIWriterViewProps> = ({ products, initialProductName }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>(
    initialProductName || (products[0] ? products[0].name : 'Noor AI Neural Pods Pro')
  );
  const [contentType, setContentType] = useState<'SEO Description' | 'Social Media Post' | 'Ad Campaign Hook'>('SEO Description');
  const [tone, setTone] = useState<'Futuristic & High-Tech' | 'Warm & Engaging' | 'Direct & Persuasive'>('Futuristic & High-Tech');
  
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);

    try {
      const response = await fetch('/api/ai-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct,
          contentType,
          tone
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setGeneratedOutput(data.output);
    } catch (error: any) {
      console.error('Error generating AI copy:', error);
      let sampleText = `⚠️ **Notice: Offline/Demo Fallback (${error.message})**\n\n✨ **Elevate Your Tech Ecosystem with ${selectedProduct}**\n\nExperience the pinnacle of intelligent craftsmanship designed for modern innovators. Engineered with custom neural processing, ${selectedProduct} seamlessly integrates into your daily workflow to deliver zero-latency performance and unmatched reliability.\n\n🔥 **Key Benefits:**\n• **Adaptive Neural Processing:** Automatically optimizes according to your usage patterns.\n• **Studio-Grade Quality:** Built with premium aerospace-inspired materials.\n• **Always Connected:** Instant sync with your Google workspace and smart home devices.\n\n*Upgrade to ${selectedProduct} today and experience tomorrow's technology.*`;
      setGeneratedOutput(sampleText);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-neutral-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden border border-indigo-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Powered by Gemini AI Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Noor AI Marketing Writer
          </h1>
          <p className="text-indigo-100 text-base">
            Generate high-converting SEO descriptions, Instagram hooks, and email marketing copy for any product in your catalog in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center space-x-2 border-b border-neutral-100 pb-3">
            <Wand2 className="w-5 h-5 text-indigo-600" />
            <span>Generation Parameters</span>
          </h3>

          {/* Select Product */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-2">
              Select Product Target
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Content Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-2">
              Content Format
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(['SEO Description', 'Social Media Post', 'Ad Campaign Hook'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className={`p-3 rounded-xl text-left text-sm font-semibold transition-all border ${
                    contentType === type
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-2xs'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Select Brand Tone */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-2">
              Brand Tone & Voice
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Futuristic & High-Tech">Futuristic & High-Tech</option>
              <option value="Warm & Engaging">Warm & Engaging</option>
              <option value="Direct & Persuasive">Direct & Persuasive</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Synthesizing Copy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Marketing Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Output Canvas */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Generated Result Canvas
            </span>
            {generatedOutput && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 p-6 bg-neutral-50 rounded-2xl border border-neutral-200 whitespace-pre-line text-neutral-800 text-base leading-relaxed font-sans overflow-y-auto max-h-[450px]">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-neutral-400 animate-pulse">
                <Sparkles className="w-8 h-8 text-indigo-500" />
                <span className="text-sm font-medium">Gemini AI is crafting your {contentType.toLowerCase()}...</span>
              </div>
            ) : generatedOutput ? (
              generatedOutput
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-2 py-16 text-neutral-400 text-center">
                <Store className="w-10 h-10 text-neutral-300" />
                <p className="text-sm font-medium">Select a product and click generate to create instant marketing campaigns.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between shadow-xs">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>⚡ Step 4 Complete: Powered live by Google Gemini 3 Flash & Full-Stack Express Server!</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
