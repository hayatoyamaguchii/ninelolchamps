import React from 'react';
import { type Champion, getChampionImageUrl } from '../lib/champions';
import { Plus, X } from 'lucide-react';

interface ChampionGridProps {
  champions: (Champion | null)[];
  onSlotClick: (index: number) => void;
  onRemove: (index: number) => void;
}

export const ChampionGrid: React.FC<ChampionGridProps> = ({ champions, onSlotClick, onRemove }) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 aspect-square w-full">
      {champions.map((champion, index) => (
        <div
          key={index}
          className={`relative group aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 
            ${champion 
              ? 'border-slate-700/50 hover:border-primary/50 shadow-lg' 
              : 'border-dashed border-slate-600/50 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800 flex items-center justify-center'
            }`}
          onClick={() => onSlotClick(index)}
        >
          {champion ? (
            <>
              <img
                src={getChampionImageUrl(champion.id)}
                alt={champion.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                crossOrigin="anonymous" // Required for html-to-image
              />
              {/* Overlay with name, hidden by default but shown on hover. Keep it minimal for the output image. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 flex items-end justify-center p-2">
                <span className="text-white text-xs md:text-sm font-bold text-center tracking-wide leading-tight drop-shadow-md">
                  {champion.name}
                </span>
              </div>
              
              {/* Remove button: Visible only on hover, ignored by html-to-image (handled later if needed, but usually easy to click slot to re-select) */}
               <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents opening the selector
                    onRemove(index);
                  }}
                  className="absolute top-1 right-1 md:top-2 md:right-2 p-1 md:p-1.5 bg-black/60 rounded-full text-slate-300 hover:text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100 z-10"
                  title="削除"
                >
                  <X size={16} />
                </button>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-slate-400 transition-colors">
               <Plus size={32} className="mb-2 opacity-50 group-hover:scale-110 transition-transform" />
               <span className="text-xs md:text-sm font-medium">選択</span>
             </div>
          )}
        </div>
      ))}
    </div>
  );
};
