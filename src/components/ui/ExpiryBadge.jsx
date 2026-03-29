import { getExpiryLevel, getExpiryLabel } from '../../utils/dates';
import theme from '../../styles/theme';

const colorMap = {
  danger: { bg: '#FEE2E2', text: theme.danger },
  warning: { bg: '#FEF3C7', text: '#D97706' },
  caution: { bg: '#FEF9C3', text: '#CA8A04' },
  ok: { bg: theme.primary[100], text: theme.primary[700] },
  none: null,
};

export default function ExpiryBadge({ date }) {
  const level = getExpiryLevel(date);
  const label = getExpiryLabel(date);
  if (!label || level === 'none') return null;

  const colors = colorMap[level];
  if (!colors) return null;

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: '600',
      background: colors.bg,
      color: colors.text,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
