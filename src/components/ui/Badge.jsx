const colorMap = {
  green: { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
  yellow: { bg: '#fef9c3', text: '#a16207', dot: '#eab308' },
  blue: { bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  red: { bg: '#fee2e2', text: '#dc2626', dot: '#ef4444' },
  gray: { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
};

export default function Badge({ label, color = 'gray', showDot = true, size = 'sm' }) {
  const c = colorMap[color] || colorMap.gray;
  const fontSize = size === 'lg' ? 13 : 11;
  const padding = size === 'lg' ? '5px 12px' : '3px 8px';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, color: c.text,
      borderRadius: 100, fontSize, fontWeight: 600,
      padding, whiteSpace: 'nowrap',
    }}>
      {showDot && (
        <span style={{
          width: size === 'lg' ? 7 : 5, height: size === 'lg' ? 7 : 5,
          borderRadius: '50%', background: c.dot, flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  );
}
