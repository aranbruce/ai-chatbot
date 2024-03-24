
interface ButtonProps {
  onClick?: () => void;
  children: any;
  href?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, href, disabled }) => {
  return href ? (
    <a href={href} aria-disabled={disabled}
      className="
        border
        inline-flex
        items-center
        justify-center
        rounded-md
        px-3 
        py-2

        text-sm
        text-primary-foreground
        font-medium
        
        transition
        
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-black
        focus-visible:ring-offset-2 
        focus-visible:bg-gray-100

        disabled:pointer-events-none 
        disabled:opacity-50 

        bg-white 
        hover:bg-gray-100
        active:bg-gray-200
        "
      >
      {children}
    </a>
  ) : (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="
        border
        inline-flex
        items-center
        justify-center
        rounded-md
        px-3 
        py-2

        text-sm
        text-primary-foreground
        font-medium
        
        transition
        
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-black
        focus-visible:ring-offset-2 
        focus-visible:bg-gray-100

        disabled:pointer-events-none 
        disabled:opacity-50 

        bg-white 
        hover:bg-gray-100
        active:bg-gray-200
      "  
      >
      {children}
    </button>
  );
};

export default Button;