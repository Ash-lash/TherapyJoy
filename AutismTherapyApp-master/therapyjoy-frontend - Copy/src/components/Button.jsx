import Icon from './Icon';

export default function Button({
  text,
  onClick,
  variant = 'primary',
  icon,
  className = '',
  type = 'button',
  disabled = false,
  ariaLabel,
}) {
  const variantClass =
    variant === 'ghost'
      ? 'btn-ghost'
      : variant === 'outline'
        ? 'btn-outline'
        : 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variantClass} ${className}`}
      disabled={disabled}
      aria-label={ariaLabel || text}
      style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
    >
      {icon ? <Icon name={icon} size={18} /> : null}
      {text}
    </button>
  );
}
