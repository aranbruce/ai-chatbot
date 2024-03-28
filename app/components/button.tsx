
interface ButtonProps {
  onClick?: () => void;
  children: any;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
  rounded?: boolean;
}

const Button = ({ onClick, children, href, disabled, ariaLabel, rounded }:ButtonProps) => {
  return href ? (
    <a href={href} aria-disabled={disabled}
      className={`
        border inline-flex items-center justify-center ${rounded ? "rounded-full py-3" : "rounded-md py-2"} px-3

        text-sm
        text-primary-foreground
        font-medium 
        
        transition
        
        focus-visible:border-gray-400
        focus-visible:ring-2
        focus-visible:ring-gray-200

        disabled:pointer-events-none 
        disabled:opacity-50 

        bg-white 
        hover:border-gray-400
        hover:shadow-md
        active:bg-gray-100
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
        border inline-flex items-center justify-center ${rounded ? "rounded-full py-3 shadow-md" : "rounded-md py-2"} px-3

        text-sm
        text-primary-foreground
        font-medium
        
        transition
        
      focus-visible:border-gray-400
      focus-visible:ring-2
      focus-visible:ring-gray-200


        disabled:pointer-events-none 
        disabled:opacity-50 

        bg-white 
        hover:border-gray-500
        hover:shadow-md
        active:bg-gray-100
      `}
      >
      {children}
    </button>
  );
};

export default Button;