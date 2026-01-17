
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Icons } from '../constants';

interface AnalysisViewProps {
  result: AnalysisResult;
  imageUrl: string;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, imageUrl, onReset }) => {
  const [activeTab, setActiveTab] = useState<'tech' | 'offer' | 'email'>('tech');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Sticky Image Preview */}
        <div className="lg:w-1/3 space-y-4">
          <div className="sticky top-8 space-y-4">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Analyzed content" 
                className="w-full h-auto max-h-[500px] object-cover rounded-xl"
              />
            </div>
            <button 
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold py-3 rounded-xl transition-all"
            >
              <Icons.Upload className="w-5 h-5" />
              Wgraj nową dokumentację
            </button>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <p className="text-[10px] text-amber-800 leading-tight">
                {result.klauzula_bezpieczenstwa}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Content Section */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('tech')}
                className={`flex-1 py-4 px-6 text-sm font-bold transition-all ${activeTab === 'tech' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Analiza Techniczna
              </button>
              <button 
                onClick={() => setActiveTab('offer')}
                className={`flex-1 py-4 px-6 text-sm font-bold transition-all ${activeTab === 'offer' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Oferta i Ceny
              </button>
              <button 
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-4 px-6 text-sm font-bold transition-all ${activeTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Wiadomość E-mail
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'tech' && (
                <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">{result.tytul}</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">{result.opis}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-blue-600 mb-4">
                        <Icons.Check className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Ocena Techniczna</h3>
                      </div>
                      <p className="text-slate-700 font-medium">{result.ocena_techniczna}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-blue-600 mb-4">
                        <Icons.Alert className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Normy i Zgodność</h3>
                      </div>
                      <p className="text-slate-700 font-medium">{result.zgodnosc_z_normami}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Zidentyfikowane komponenty</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="py-3 font-semibold text-slate-500 text-sm">Nazwa/Model</th>
                            <th className="py-3 font-semibold text-slate-500 text-sm">Typ</th>
                            <th className="py-3 font-semibold text-slate-500 text-sm">Funkcja/Stan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {result.komponenty.map((comp, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 font-semibold text-slate-800">{comp.nazwa}</td>
                              <td className="py-4 text-slate-600">{comp.typ}</td>
                              <td className="py-4 text-slate-500 text-sm">{comp.opis}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'offer' && (
                <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">Nasza Oferta</h3>
                      <ul className="space-y-4">
                        {result.oferta.punkty_kluczowe.map((p, i) => (
                          <li key={i} className="flex gap-3 text-slate-700">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center">
                              <Icons.Check className="w-4 h-4" />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-3 text-sm uppercase">Rekomendacje inżynierskie</h4>
                        <ul className="space-y-2">
                          {result.oferta.rekomendacje.map((r, i) => (
                            <li key={i} className="text-blue-700 text-sm flex gap-2">
                              <span>•</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Icons.Tag className="w-6 h-6 text-blue-600" />
                        Szacunkowe Ceny
                      </h3>
                      <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                        {result.ceny_szacunkowe.map((item, idx) => (
                          <div key={idx} className="p-4 flex justify-between items-center border-b border-slate-200 last:border-0">
                            <span className="text-slate-700 font-medium">{item.element}</span>
                            <span className="font-bold text-slate-900 text-lg">{item.cena}</span>
                          </div>
                        ))}
                        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Suma szacunkowa</span>
                          <span className="text-xl font-bold">Wycena indywidualna</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">Ceny mają charakter poglądowy i mogą ulec zmianie w zależności od dostępności i dystrybutora.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Icons.Mail className="w-6 h-6 text-blue-600" />
                      Gotowy szkic wiadomości
                    </h3>
                    <button 
                      onClick={() => navigator.clipboard.writeText(result.email_draft)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Kopiuj treść
                    </button>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {result.email_draft}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
