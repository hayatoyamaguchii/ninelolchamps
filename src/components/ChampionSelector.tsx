import React, { useState, useMemo } from 'react';
import { type Champion, getChampionImageUrl } from '../lib/champions';
import { Search, X, Loader2 } from 'lucide-react';

interface ChampionSelectorProps {
  champions: Champion[];
  isLoading: boolean;
  onSelect: (champion: Champion) => void;
  onClose: () => void;
}

export const ChampionSelector: React.FC<ChampionSelectorProps> = ({ champions, isLoading, onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChampions = useMemo(() => {
    if (!searchQuery) return champions;
    const lowerQuery = searchQuery.toLowerCase();
    return champions.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.id.toLowerCase().includes(lowerQuery)
    );
  }, [champions, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="glass-panel w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-700 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-surface/90">
          <h2 className="text-xl font-bold">チャンピオンを選択</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
             <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-surface/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="チャンピオンを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-primary">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p className="text-slate-400 font-medium tracking-widest">LOADING...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredChampions.map((champion) => (
                <div
                  key={champion.id}
                  onClick={() => onSelect(champion)}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-slate-700/50 hover:border-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                >
                   <img
                     src={getChampionImageUrl(champion.id)}
                     alt={champion.name}
                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                     loading="lazy"
                   />
                   <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-center pointer-events-none">
                     <span className="text-white text-xs font-bold leading-tight drop-shadow-sm block truncate w-full">
                       {champion.name}
                     </span>
                   </div>
                </div>
              ))}
              
              {!isLoading && filteredChampions.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400">
                  <p>「{searchQuery}」に一致するチャンピオンが見つかりません。</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
