import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { ChampionGrid } from './components/ChampionGrid';
import { ChampionSelector } from './components/ChampionSelector';
import { type Champion, fetchChampions } from './lib/champions';
import { toPng } from 'html-to-image';

function App() {
  const [champions, setChampions] = React.useState<Champion[]>([]);
  const [selectedChampions, setSelectedChampions] = React.useState<(Champion | null)[]>(Array(9).fill(null));
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const loadChampions = async () => {
      setIsLoading(true);
      const data = await fetchChampions();
      setChampions(data);
      setIsLoading(false);
    };
    loadChampions();
  }, []);

  const handleSlotClick = (index: number) => {
    setCurrentSlotIndex(index);
    setIsSelectorOpen(true);
  };

  const handleSelectChampion = (champion: Champion) => {
    if (currentSlotIndex !== null) {
      const newSelected = [...selectedChampions];
      // Check if perfectly duplicate exists? Allow duplicates or not? Usually "9 champs" might be unique.
      // Let's allow it for flexibility, or maybe enforce uniqueness later.
      newSelected[currentSlotIndex] = champion;
      setSelectedChampions(newSelected);
      setIsSelectorOpen(false);
      setCurrentSlotIndex(null);
    }
  };

  const handleRemoveChampion = (index: number) => {
    const newSelected = [...selectedChampions];
    newSelected[index] = null;
    setSelectedChampions(newSelected);
  };

  const handleDownload = async () => {
    if (gridRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(gridRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'my-9-lol-champs.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('画像の生成に失敗しました。');
    }
  };

  const handleShareOnX = () => {
    const text = encodeURIComponent('私を作ったLoLチャンプ9体を選びました！\nhttps://ninelolchamps.pages.dev/\n#私を作ったLoLチャンプ9体 #LoL\n');
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    if (confirm('すべてリセットしますか？')) {
      setSelectedChampions(Array(9).fill(null));
    }
  };

  const isComplete = selectedChampions.every(c => c !== null);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <header className="mb-10 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            私を作った<span className="text-primary">LoL</span>チャンプ<span className="text-accent">9</span>体
          </h1>
          <p className="text-slate-400 text-lg">
            あなたを構成するお気に入りのチャンピオンを選んで、画像をシェアしよう！
          </p>
        </header>

        <main className="flex flex-col items-center gap-8">
          <div className="glass-panel p-6 md:p-8 rounded-2xl w-full max-w-2xl mx-auto shadow-2xl relative animate-scale-in">
            {/* The actual element that will be captured */}
            <div ref={gridRef} className="bg-background/90 p-4 rounded-xl">
               <ChampionGrid 
                 champions={selectedChampions} 
                 onSlotClick={handleSlotClick}
                 onRemove={handleRemoveChampion}
               />
               <div className="text-center mt-4 text-slate-500 text-sm font-medium tracking-wide">
                 #私を作ったLoLチャンプ9体
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mt-4 w-full">
            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
              <button
                onClick={handleDownload}
                disabled={!isComplete}
                className={`btn-primary text-lg px-8 py-3 ${!isComplete ? 'opacity-50 cursor-not-allowed saturate-0' : 'hover:animate-none'}`}
              >
                <Download size={24} />
                {isComplete ? '画像を保存する' : '9体すべて選んでください'}
              </button>

              {isComplete && (
                <button
                  onClick={handleShareOnX}
                  className="bg-black hover:bg-neutral-800 border border-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.150h-1.91z" />
                  </svg>
                  Xでシェア
                </button>
              )}

              <button
                onClick={handleReset}
                className="btn-secondary py-3 px-4"
                title="リセット"
              >
                <RefreshCw size={24} />
              </button>
            </div>
            {isComplete && (
              <p className="text-slate-400 text-sm mt-2">
                ※Xでシェアする際は、先に画像を保存してからポストに手動で添付してください。
              </p>
            )}
          </div>
        </main>

        <footer className="mt-20 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} 9 LoL Champs That Made Me.</p>
          <p className="mt-2 text-xs text-slate-600 max-w-lg mx-auto">
            This site isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
          </p>
        </footer>
      </div>

      {/* Champion Selector Modal */}
      {isSelectorOpen && (
        <ChampionSelector
          champions={champions}
          isLoading={isLoading}
          onSelect={handleSelectChampion}
          onClose={() => setIsSelectorOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
