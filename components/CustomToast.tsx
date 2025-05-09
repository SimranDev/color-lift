import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const Toast = ({ msg }: { msg: { color: string; shade?: string } }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const toastElement = document.getElementById('custom-toast');
      if (toastElement) {
        toastElement.remove();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const color = getContrastColor(msg.color);

  return (
    <div
      id="custom-toast"
      style={{
        position: 'fixed',
        zIndex: 99999,
        top: 12,
        right: 12,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '4px',
        backgroundColor: '#e2e8f0',
        fontFamily: 'monospace',
        fontSize: '14px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          color,
          backgroundColor: msg.color,
          borderRadius: '4px 0 0 4px',
          padding: '8px 12px 8px 9px',
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
          textTransform: 'uppercase',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
            <path strokeDasharray={72} strokeDashoffset={72} d="M12 3h7v18h-14v-18h7Z">
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"></animate>
            </path>
            <path strokeDasharray={12} strokeDashoffset={12} strokeWidth={1} d="M14.5 3.5v3h-5v-3">
              <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="12;0"></animate>
            </path>
            <path strokeDasharray={10} strokeDashoffset={10} d="M9 13l2 2l4 -4">
              <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="10;0"></animate>
            </path>
          </g>
        </svg>
        <span style={{ color }}>{msg.color}</span>
      </div>
      <span style={{ color: '#1c1917', padding: '8px 12px 8px 6px' }}>Copied to clipboard!</span>
    </div>
  );
};

export const showToast = (message: { color: string; shade: string }, container?: HTMLElement) => {
  const existingToast = document.getElementById('custom-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const targetContainer = container || document.createElement('div');
  if (!container) {
    document.body.appendChild(targetContainer);
  }
  const root = createRoot(targetContainer);
  root.render(<Toast msg={message} />);
};
