export const Badge = ({ children, className }) => (
  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${className}`}>
    {children}
  </span>
);
