import { useState } from 'react';
import './BigButton.css';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export function BigButton({ onClick, disabled }: Props) {
  const [squished, setSquished] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setSquished(true);
    onClick();
    setTimeout(() => setSquished(false), 300);
  };

  return (
    <button
      className={`big-button ${squished ? 'squished' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="button-text">TAKE ME<br />SOMEWHERE</span>
      <span className="button-emoji">🚀</span>
    </button>
  );
}
