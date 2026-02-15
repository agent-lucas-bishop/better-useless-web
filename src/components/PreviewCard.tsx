import type { Website } from '../data/websites';
import './PreviewCard.css';

interface Props {
  site: Website;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onShare: () => void;
  onClose: () => void;
}

export function PreviewCard({ site, isFavorite, onToggleFavorite, onOpen, onShare, onClose }: Props) {
  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-card" onClick={e => e.stopPropagation()}>
        <button className="preview-close" onClick={onClose}>✕</button>
        <div className="preview-categories">
          {site.categories.map(c => (
            <span key={c} className={`pill pill-${c.toLowerCase()}`}>{c}</span>
          ))}
        </div>
        <h2 className="preview-name">{site.name}</h2>
        <p className="preview-desc">{site.description}</p>
        <p className="preview-url">{site.url}</p>
        <div className="preview-actions">
          <button className="action-btn open-btn" onClick={onOpen}>
            🌐 Open in New Tab
          </button>
          <button className={`action-btn fav-btn ${isFavorite ? 'is-fav' : ''}`} onClick={onToggleFavorite}>
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button className="action-btn share-btn" onClick={onShare}>
            📤
          </button>
        </div>
      </div>
    </div>
  );
}
