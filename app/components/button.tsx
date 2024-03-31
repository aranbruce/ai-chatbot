
interface ButtonProps {
  onClick?: () => void;
  children: any;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
  rounded?: boolean;
  openInNewTab?: boolean;
}

const Button = ({ onClick, children, href, disabled, ariaLabel, rounded, openInNewTab }:ButtonProps) => {
  return href ? (
    <a href={href} aria-disabled={disabled}
      target={openInNewTab ? "_blank" : "_self"}
      rel={openInNewTab ? "noopener noreferrer" : ""}
      className={`
        border border-zinc-300 dark:border-zinc-700 inline-flex items-center justify-center ${rounded ? "rounded-full py-3" : "rounded-md py-2"} px-3

        text-sm
        text-primary-foreground
        text-zinc-950
        dark:text-zinc-50
        font-medium 
        
        transition
        
        focus-visible:border-zinc-400
        focus-visible:ring-2
        focus-visible:ring-zinc-200

        disabled:pointer-events-none 
        disabled:opacity-50 

        bg-white 
        dark:bg-zinc-950
        hover:border-zinc-400
        hover:shadow-md
        active:bg-zinc-100
        `}
      >
      {children}
    </a>
  ) : (
    <button 
      onClick={onClick} 
      disabled={disabled}
      aria-label={ariaLabel} // Fixed the typo here
      className={`
        border border-zinc-300 dark:border-zinc-700 inline-flex items-center justify-center ${rounded ? "rounded-full py-3 shadow-md" : "rounded-md py-2"} px-3

        text-sm
        text-primary-foreground
        text-zinc-950
        dark:text-zinc-50
        font-medium
        
        transition
        
      focus-visible:border-zinc-400
      focus-visible:ring-2
      focus-visible:ring-zinc-200
      dark:focus-visible:ring-zinc-500  


        disabled:pointer-events-none 
        disabled:opacity-50 

        bg-white 
        dark:bg-zinc-950
        hover:border-zinc-500
        hover:shadow-md
        active:bg-zinc-100
      `}
      >
      {children}
    </button>
  );
};

export default Button;