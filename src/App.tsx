import { useState, useCallback, useMemo, useEffect } from 'react';
import { websites, CATEGORIES } from './data/websites';
import type { Website, Category } from './data/websites';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useClickSound } from './hooks/useSound';
import { BigButton } from './components/BigButton';
import { PreviewCard } from './components/PreviewCard';
import { Particles } from './components/Particles';
import { Sidebar } from './components/Sidebar';
import './App.css';

const DECORATIONS = ['✦', '⚡', '★', '✿', '◆', '❋', '➤', '◎', '✧', '♦', '⬥', '✸'];

function App() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [currentSite, setCurrentSite] = useState<Website | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('buw-favorites', []);
  const [history, setHistory] = useLocalStorage<string[]>('buw-history', []);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'favorites' | 'history'>('favorites');
  const [hue, setHue] = useState(0);
  const playSound = useClickSound();

  // Rotating background hue
  useEffect(() => {
    const interval = setInterval(() => setHue(h => (h + 0.5) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() =>
    activeCategory ? websites.filter(w => w.categories.includes(activeCategory)) : websites,
    [activeCategory]
  );

  const pickRandom = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : websites;
    const site = pool[Math.floor(Math.random() * pool.length)];
    setCurrentSite(site);
    setParticleTrigger(t => t + 1);
    playSound();
  }, [filtered, playSound]);

  const openSite = useCallback((site: Website) => {
    setHistory(prev => {
      const next = [site.url, ...prev.filter(u => u !== site.url)].slice(0, 200);
      return next;
    });
    window.open(site.url, '_blank');
    setCurrentSite(null);
  }, [setHistory]);

  const toggleFavorite = useCallback((url: string) => {
    setFavorites(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  }, [setFavorites]);

  const shareSite = useCallback((site: Website) => {
    const text = `I found "${site.name}" on The Better Useless Web! ${site.url}`;
    if (navigator.share) {
      navigator.share({ title: 'The Better Useless Web', text, url: site.url });
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    }
  }, []);

  const exploredCount = history.length;

  // Random decorations
  const decorations = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      char: DECORATIONS[i % DECORATIONS.length],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    })), []);

  return (
    <div className="app" style={{ '--bg-hue': hue } as React.CSSProperties}>
      <Particles trigger={particleTrigger} />

      {/* Floating decorations */}
      {decorations.map((d, i) => (
        <span
          key={i}
          className="decoration"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            fontSize: `${d.size}rem`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        >
          {d.char}
        </span>
      ))}

      {/* Header */}
      <header className="header">
        <h1 className="title">
          <span className="title-the">The</span>
          <span className="title-main">Better Useless Web</span>
        </h1>
        <p className="subtitle">150+ websites you didn't know you needed</p>
        <div className="header-actions">
          {exploredCount > 0 && (
            <span className="counter">🌍 You've explored <strong>{exploredCount}</strong> website{exploredCount !== 1 ? 's' : ''}!</span>
          )}
          <button className="sidebar-toggle" onClick={() => { setSidebarOpen(true); setSidebarTab('favorites'); }}>
            ❤️ {favorites.length}
          </button>
          <button className="sidebar-toggle" onClick={() => { setSidebarOpen(true); setSidebarTab('history'); }}>
            🕐 {history.length}
          </button>
        </div>
      </header>

      {/* Category pills */}
      <div className="categories">
        <button
          className={`pill ${activeCategory === null ? 'pill-active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          🎲 All ({websites.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`pill pill-${cat.toLowerCase()} ${activeCategory === cat ? 'pill-active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          >
            {cat} ({websites.filter(w => w.categories.includes(cat)).length})
          </button>
        ))}
      </div>

      {/* The Button */}
      <div className="button-area">
        <BigButton onClick={pickRandom} />
        <button className="surprise-btn" onClick={() => {
          const site = websites[Math.floor(Math.random() * websites.length)];
          setCurrentSite(site);
          setParticleTrigger(t => t + 1);
          playSound();
        }}>
          ✨ Surprise Me ✨
        </button>
      </div>

      {/* Preview Card */}
      {currentSite && (
        <PreviewCard
          site={currentSite}
          isFavorite={favorites.includes(currentSite.url)}
          onToggleFavorite={() => toggleFavorite(currentSite.url)}
          onOpen={() => openSite(currentSite)}
          onShare={() => shareSite(currentSite)}
          onClose={() => setCurrentSite(null)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        tab={sidebarTab}
        onTabChange={setSidebarTab}
        favorites={favorites}
        history={history}
        websites={websites}
        onSelect={(site) => { setCurrentSite(site); setSidebarOpen(false); }}
        onRemoveFavorite={(url) => toggleFavorite(url)}
        onClearHistory={() => setHistory([])}
      />

      <footer className="footer">
        made with chaos & ❤️ • not affiliated with theuselessweb.com
      </footer>
    </div>
  );
}

export default App;
