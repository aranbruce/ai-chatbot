
interface ButtonProps {
  onClick?: () => void;
  children: any;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
  rounded?: boolean;
  openInNewTab?: boolean;
  variant?: "primary" | "secondary";
}

const Button = ({ onClick, children, href, disabled, ariaLabel, rounded, openInNewTab, variant = "primary" }:ButtonProps) => {
  const primaryClassNames = `
    text-white
    font-semibold
    dark:text-zinc-950
    bg-zinc-950 
    dark:bg-zinc-50
    hover:bg-zinc-700
    dark:hover:bg-zinc-300
    active:bg-zinc-800
    dark:active-bg-zinc-900  
  `;

  const secondaryClassNames = `
    text-zinc-950
    dark:text-zinc-50
    bg-white 
    dark:bg-zinc-800
    border 
    border-zinc-200
    dark:border-zinc-800
    hover:bg-zinc-100
    dark:hover:bg-zinc-800
    active:bg-zinc-200
    dark:active-bg-zinc-700
  `;

  const baseClassNames = `
  inline-flex items-center justify-center ${rounded ? "rounded-full py-3" : "rounded-xl py-2"} px-3 gap-2
  text-sm text-primary-foreground disabled:pointer-events-none disabled:opacity-50 disabled:bg-zinc-400
  font-medium transition`;

  const classNames = `${baseClassNames} ${variant === "primary" ? primaryClassNames : secondaryClassNames}`;

  return href ? (
    <a href={href} aria-disabled={disabled}
      target={openInNewTab ? "_blank" : "_self"}
      rel={openInNewTab ? "noopener noreferrer" : ""}
      className={classNames}
      >
      {children}
    </a>
  ) : (
    <button 
      onClick={onClick} 
      disabled={disabled}
      aria-label={ariaLabel}
      className={classNames}
      >
      {children}
    </button>
  );
};

export default Button;