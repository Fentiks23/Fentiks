
import React, { useState, useCallback, useRef } from 'react';
import { AnalysisResult, AnalysisStatus, ImageFile } from './types';
import { analyzeImage } from './services/geminiService';
import { Button } from './components/Button';
import { AnalysisView } from './components/AnalysisView';
import { Icons } from './constants';

const Logo: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="flex flex-col leading-none">
      <span className="text-white text-lg font-medium tracking-tight">Asystent</span>
      <span className="text-white text-lg font-bold tracking-tight">Elektryka</span>
    </div>
    <div className="bg-white text-slate-900 w-10 h-10 flex items-center justify-center rounded-sm">
      <span className="font-black text-xl tracking-tighter">AI</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage({ file, preview });
      setResult(null);
      setError(null);
      setStatus(AnalysisStatus.IDLE);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) resolve(base64String);
        else reject(new Error("Błąd konwersji pliku."));
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!image) return;

    try {
      setStatus(AnalysisStatus.LOADING);
      setError(null);
      
      const base64 = await convertToBase64(image.file);
      const analysis = await analyzeImage(base64, image.file.type);
      
      setResult(analysis);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Wystąpił nieoczekiwany błąd podczas analizy technicznej.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setStatus(AnalysisStatus.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 py-5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Logo />
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right border-l border-slate-700 pl-6">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Standardy Techniczne</p>
              <p className="text-xs text-blue-400 font-medium">PN-HD 60364-4-41</p>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg text-slate-400">
              <Icons.Camera className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-12">
        
        {status === AnalysisStatus.SUCCESS && result && image ? (
          <AnalysisView result={result} imageUrl={image.preview} onReset={reset} />
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-16 border border-slate-100 text-center animate-in zoom-in-95 duration-500">
            {!image ? (
              <div 
                className="group relative border-2 border-dashed border-slate-200 rounded-[2rem] p-12 transition-all hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 bg-slate-50 rounded-full text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-inner">
                    <Icons.Upload className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Analiza Dokumentacji Obrazowej</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto">Prześlij zdjęcie rozdzielnicy elektrycznej, aby otrzymać audyt techniczny, wycenę i gotową ofertę.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="relative inline-block group">
                  <img 
                    src={image.preview} 
                    alt="Preview" 
                    className="max-h-[400px] w-auto rounded-3xl shadow-2xl border-8 border-white"
                  />
                  <button 
                    onClick={reset}
                    className="absolute -top-4 -right-4 p-1 bg-white rounded-full shadow-xl text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Icons.XCircle className="w-10 h-10" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Icons.Check className="w-4 h-4" />
                    Plik gotowy do audytu
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                    <Button 
                      onClick={handleAnalyze} 
                      isLoading={status === AnalysisStatus.LOADING}
                      className="w-full sm:w-auto min-w-[240px] text-lg py-4 bg-slate-900 hover:bg-black"
                    >
                      Generuj Raport AI
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-700 animate-in slide-in-from-top-4">
                <Icons.Alert className="w-6 h-6 flex-shrink-0" />
                <p className="text-sm font-bold text-left">{error}</p>
              </div>
            )}
            
            {status === AnalysisStatus.LOADING && (
              <div className="mt-12 space-y-6">
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-900">Asystent AI analizuje zabezpieczenia...</p>
                  <p className="text-slate-400 text-sm italic">Weryfikacja typów aparatury i generowanie dokumentacji technicznej</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center mb-4">
             <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex flex-col leading-none text-right">
                  <span className="text-slate-900 text-[10px] font-medium tracking-tight">Asystent</span>
                  <span className="text-slate-900 text-[10px] font-bold tracking-tight">Elektryka</span>
                </div>
                <div className="bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-sm">
                  <span className="font-black text-[10px]">AI</span>
                </div>
             </div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Platforma Wsparcia Technicznego Elektryków</p>
          <p className="text-slate-300 text-xs italic">Narzędzie wspiera procesy inżynierskie, ofertowanie i kontrolę zgodności z normami.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
