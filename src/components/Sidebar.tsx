import type { Website } from '../data/websites';
import './Sidebar.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tab: 'favorites' | 'history';
  onTabChange: (tab: 'favorites' | 'history') => void;
  favorites: string[];
  history: string[];
  websites: Website[];
  onSelect: (site: Website) => void;
  onRemoveFavorite: (url: string) => void;
  onClearHistory: () => void;
}

export function Sidebar({ isOpen, onClose, tab, onTabChange, favorites, history, websites, onSelect, onRemoveFavorite, onClearHistory }: Props) {
  const getByUrl = (url: string) => websites.find(w => w.url === url);
  const list = tab === 'favorites' ? favorites : history;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-tabs">
            <button className={`sidebar-tab ${tab === 'favorites' ? 'active' : ''}`} onClick={() => onTabChange('favorites')}>
              ❤️ Favorites ({favorites.length})
            </button>
            <button className={`sidebar-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => onTabChange('history')}>
              🕐 History ({history.length})
            </button>
          </div>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>
        <div className="sidebar-list">
          {list.length === 0 && (
            <p className="sidebar-empty">{tab === 'favorites' ? 'No favorites yet! Click ❤️ to save sites.' : 'No history yet! Start exploring!'}</p>
          )}
          {list.map(url => {
            const site = getByUrl(url);
            if (!site) return null;
            return (
              <div key={url} className="sidebar-item" onClick={() => onSelect(site)}>
                <div className="sidebar-item-info">
                  <span className="sidebar-item-name">{site.name}</span>
                  <span className="sidebar-item-cats">{site.categories.join(', ')}</span>
                </div>
                {tab === 'favorites' && (
                  <button className="sidebar-item-remove" onClick={e => { e.stopPropagation(); onRemoveFavorite(url); }}>✕</button>
                )}
              </div>
            );
          })}
        </div>
        {tab === 'history' && history.length > 0 && (
          <button className="clear-history" onClick={onClearHistory}>Clear History</button>
        )}
      </div>
    </>
  );
}
