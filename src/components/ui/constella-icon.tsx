export function ConstellaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="8" fill="#3E43AD" />
      <circle cx="16" cy="16" r="3" fill="#fff" />
      <circle cx="8" cy="10" r="1.5" fill="#5B60E8" />
      <circle cx="24" cy="10" r="1.5" fill="#5B60E8" />
      <circle cx="10" cy="24" r="1.5" fill="#5B60E8" />
      <circle cx="22" cy="22" r="1.5" fill="#5B60E8" />
      <line x1="16" y1="16" x2="8" y2="10" stroke="#5B60E8" strokeWidth="0.7" opacity="0.5" />
      <line x1="16" y1="16" x2="24" y2="10" stroke="#5B60E8" strokeWidth="0.7" opacity="0.5" />
      <line x1="16" y1="16" x2="10" y2="24" stroke="#5B60E8" strokeWidth="0.7" opacity="0.5" />
      <line x1="16" y1="16" x2="22" y2="22" stroke="#5B60E8" strokeWidth="0.7" opacity="0.5" />
    </svg>
  );
}
