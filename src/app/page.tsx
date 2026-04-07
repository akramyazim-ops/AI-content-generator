"use client";

import { Upload, Loader2, Copy, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    businessType: "F&B",
    productName: "",
    keyBenefits: "",
    targetAudience: "",
    contentType: "TikTok Script",
    tone: "Casual",
  });
  
  // Image State
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setOutput("");
    
    try {
      let base64Image = "";
      if (imagePreview) {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          imageBase64: base64Image ? base64Image : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setOutput(data.content || "No content generated.");
    } catch (error) {
      console.error(error);
      setOutput("An error occurred during generation. Please try again or check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.productName ? formData.productName.replace(/\s+/g, "-").toLowerCase() : "ai-content"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#000000] p-4 text-slate-300 font-sans">
      
      {/* Container echoing the mockup split layout */}
      <div className="w-full max-w-[1400px] h-[90vh] bg-[#000000] border border-[#1a1a1a] rounded-xl flex flex-col lg:flex-row overflow-hidden shadow-2xl">
        
        {/* === LEFT PANEL: PROJECT WORKSPACE === */}
        <section className="flex-[0.8] bg-[#0d0d0d] border-r border-[#1a1a1a] p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-black tracking-[0.2em] mb-2 uppercase">
              PROJECT WORKSPACE 
              <div className="h-[2px] w-12 bg-slate-700"></div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black italic tracking-wide text-white">
              AI CONTENT STUDIO
            </h1>
          </div>

          {/* Form Fields Section */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-blue-400 text-lg">📦</span>
            <h2 className="text-white text-sm font-bold tracking-wider">PRODUCT FOUNDATION</h2>
          </div>

          <div className="flex-1 space-y-4">
            
            {/* Field: Product Name & Business Type grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Product Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Volt Obsidian Sneakers"
                  className="w-full bg-[#161616] border border-[#222] text-slate-200 text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#6898ff] transition-colors placeholder:text-slate-600 font-medium shadow-inner"
                  value={formData.productName}
                  onChange={e => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Business Type</label>
                <select 
                  className="w-full bg-[#161616] border border-[#222] text-slate-200 text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#6898ff] transition-colors shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
                  value={formData.businessType}
                  onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option>F&B</option>
                  <option>Fashion</option>
                  <option>Beauty</option>
                  <option>Services</option>
                  <option>Others</option>
                </select>
              </div>
            </div>

            {/* Field: Brand Voice */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Brand Voice & Persona</label>
              <select 
                className="w-full bg-[#161616] border border-[#222] text-slate-200 text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#6898ff] transition-colors shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
                value={formData.tone}
                onChange={e => setFormData({ ...formData, tone: e.target.value })}
              >
                <option>High-Performance Technical</option>
                <option>Casual (Santai)</option>
                <option>Hard Sell (Promosi)</option>
                <option>Storytelling (Mendalam)</option>
                <option>Premium (Eksklusif)</option>
              </select>
            </div>

            {/* Field: Platform / Audience grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Platform Format</label>
                <select 
                  className="w-full bg-[#161616] border border-[#222] text-slate-200 text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#6898ff] transition-colors shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
                  value={formData.contentType}
                  onChange={e => setFormData({ ...formData, contentType: e.target.value })}
                >
                  <option>TikTok Script</option>
                  <option>Instagram Caption</option>
                  <option>Facebook Post</option>
                  <option>X / Twitter Thread</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Target Audience</label>
                <input 
                  type="text"
                  placeholder="e.g. Modern Minimalists"
                  className="w-full bg-[#161616] border border-[#222] text-slate-200 text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#6898ff] transition-colors placeholder:text-slate-600 font-medium shadow-inner"
                  value={formData.targetAudience}
                  onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>
            </div>

            {/* Field: Core Narrative */}
            <div className="space-y-1.5 min-h-[100px]">
              <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Core Narrative</label>
              <textarea 
                rows={3}
                placeholder="Describe the soul of this asset..."
                className="w-full bg-[#161616] border border-[#222] text-slate-200 text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#6898ff] transition-colors shadow-inner placeholder:text-slate-600 resize-none font-medium"
                value={formData.keyBenefits}
                onChange={e => setFormData({ ...formData, keyBenefits: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-8 mb-5">
            <div className="flex items-center gap-2">
               <span className="text-blue-400 text-lg">☁️</span>
               <h2 className="text-white text-sm font-bold tracking-wider">TECHNICAL ASSETS</h2>
            </div>
          </div>

          {/* Setup blocks matching mockup */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] rounded-xl border border-dashed border-[#2a2a2a] bg-[#0c0c0c] hover:bg-[#111] transition-colors flex flex-col items-center justify-center group overflow-hidden">
               <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
               {imagePreview ? (
                 <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" alt="Reference Frame" />
               ) : (
                 <>
                  <Upload className="w-5 h-5 text-slate-500 mb-3 group-hover:text-blue-400 transition-colors" />
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Reference Frame</p>
                 </>
               )}
            </div>

            {/* Placeholder inactive block from mockup */}
            <div className="relative aspect-[4/3] rounded-xl border border-dashed border-[#1a1a1a] bg-[#050505] flex flex-col items-center justify-center opacity-60 cursor-not-allowed">
                <svg className="w-5 h-5 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">3D Mesh Source</p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.productName}
              className="w-full bg-[#6898ff] hover:bg-[#8ebbff] text-[#001133] disabled:opacity-50 disabled:cursor-not-allowed font-black italic rounded-full py-3.5 px-4 flex items-center justify-center gap-2 transition-all shadow-[0px_0px_20px_rgba(104,152,255,0.25)] hover:shadow-[0px_0px_35px_rgba(104,152,255,0.4)] tracking-wide uppercase"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 text-[#001133] animate-spin" />
              ) : (
                <Zap className="w-4 h-4 text-[#001133] fill-[#001133]" />
              )}
              Synthesize Content
            </button>
          </div>
        </section>

        {/* === RIGHT PANEL: OUTPUT === */}
        <section className="flex-[1.2] bg-[#050505] p-6 lg:p-8 flex flex-col relative">
          
          {/* Header Tabs */}
          <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4 mb-6">
            <div className="flex items-center gap-6">
              <button className="text-[10px] text-white font-bold uppercase tracking-widest border-b-2 border-[#6898ff] pb-1">AI Rendering</button>
              <button className="text-[10px] text-slate-600 font-bold uppercase tracking-widest hover:text-slate-400">Technical Specs</button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={toggleFullscreen}
                className="h-8 w-8 flex items-center justify-center rounded-md bg-[#111] border border-[#222] text-slate-500 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              </button>
              <button 
                onClick={handleDownload}
                disabled={!output}
                className="h-8 w-8 flex items-center justify-center rounded-md bg-[#111] border border-[#222] text-slate-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download Content"
              >
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </button>
            </div>
          </div>

          {/* AI Banner Image */}
          <div className="relative w-full h-[240px] md:h-[300px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl mb-8 overflow-hidden group">
            {/* If no image uploaded, show a cool stylized abstract tech background */}
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover opacity-80" alt="Preview Output" />
            ) : (
               <div className="absolute inset-0 bg-gradient-to-tr from-[#050c18] via-[#0b172a] to-[#040810] flex items-center justify-center">
                 <div className="absolute w-[300px] h-[300px] bg-[#214b9b] opacity-20 blur-[100px] rounded-full"></div>
                 <span className="text-[#1e345e] font-black italic text-4xl opacity-50 tracking-tighter">RENDER VIEWPORT</span>
               </div>
            )}
            
            <div className="absolute bottom-4 left-4 flex gap-2">
               <span className="px-3 py-1 rounded-full bg-[#6898ff]/10 border border-[#6898ff]/30 text-[#6898ff] text-[8px] font-bold tracking-wider uppercase backdrop-blur-md">AI Generated • 0.4S</span>
               <span className="px-3 py-1 rounded-full bg-[#ffffff]/10 border border-[#ffffff]/20 text-white text-[8px] font-bold tracking-wider uppercase backdrop-blur-md">PB-ENGINE-V4</span>
            </div>
          </div>

          {/* Generated Result Container */}
          <div className="flex-1 flex flex-col min-h-0">
             
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                 <span className="text-[#ff78e8] text-lg">✨</span>
                 <h3 className="text-white text-sm font-black italic tracking-wider">GENERATED NARRATIVE</h3>
               </div>
               
               {output && !isGenerating && (
                 <div className="flex items-center gap-2">
                   <button onClick={handleGenerate} className="px-4 py-1.5 rounded-full bg-[#161616] border border-[#222] hover:bg-[#222] text-slate-300 text-[9px] font-bold uppercase tracking-wider transition-colors">
                     Regenerate
                   </button>
                   <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-1.5 rounded-full bg-[#161616] border border-[#222] hover:bg-[#222] text-slate-300 text-[9px] font-bold uppercase tracking-wider transition-colors">
                     Copy
                   </button>
                 </div>
               )}
            </div>

            <div className="flex-1 rounded-2xl bg-[#111] border border-[#1a1a1a] shadow-inner p-6 flex flex-col relative overflow-hidden">
               {isGenerating ? (
                 <div className="flex flex-col items-center justify-center h-full gap-4 relative z-10 w-full animate-pulse">
                    <Loader2 className="w-8 h-8 text-[#6898ff] animate-spin" />
                    <div className="space-y-3 w-2/3 mt-2">
                      <div className="h-2 bg-[#222] rounded w-full"></div>
                      <div className="h-2 bg-[#222] rounded w-5/6"></div>
                      <div className="h-2 bg-[#222] rounded w-4/6"></div>
                    </div>
                </div>
               ) : output ? (
                 <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {output}
                 </div>
               ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 text-sm opacity-50">
                  <span className="mb-2 italic font-medium">Awaiting parameter input...</span>
                </div>
               )}

               {/* GPU Active Status Footer */}
               <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#080808] border border-[#222] px-3 py-1.5 rounded-full z-20 shadow-md">
                 <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-[#6898ff]'}`}></div>
                 <span className="text-[8px] font-bold text-slate-400 tracking-wider">GPU ACTIVE: {isGenerating ? '99%' : '14%'}</span>
               </div>
               
               {/* decorative hashtags */}
               {!isGenerating && output && (
                 <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
                    <span className="bg-[#1a1a1a] text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded">#SYNTHESIZED</span>
                    <span className="bg-[#1a1a1a] text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded">#AI_COPY</span>
                 </div>
               )}
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `}</style>
    </main>
  );
}

