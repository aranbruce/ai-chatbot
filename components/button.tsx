import { ButtonHTMLAttributes } from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
  rounded?: boolean;
  openInNewTab?: boolean;
  variant?: "primary" | "secondary";
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

export default function Button({
  onClick,
  children,
  href,
  disabled,
  ariaLabel,
  rounded,
  openInNewTab,
  variant = "primary",
  type = "submit",
}: ButtonProps) {
  const primaryClassNames =
    "text-white font-semibold dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-700 dark:hover:bg-zinc-300 active:bg-zinc-800 dark:active-bg-zinc-900";

  const secondaryClassNames =
    "text-zinc-950 dark:text-zinc-50 bg-white  dark:bg-zinc-800 border  border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 dark:active-bg-zinc-700";

  const baseClassNames = `
  inline-flex items-center justify-center ${
    rounded ? "rounded-full py-3" : "rounded-xl py-2"
  } px-3 gap-2
  text-sm text-primary-foreground disabled:pointer-events-none disabled:text-zinc-300 dark:disabled:text-zinc-600
  font-medium transition focus:outline-none focus-visible:ring-[3px] ring-slate-950/20 dark:ring-white/40`;

  const classNames = `${baseClassNames} ${
    variant === "primary" ? primaryClassNames : secondaryClassNames
  }`;

  return href ? (
    <a
      href={href}
      aria-disabled={disabled}
      target={openInNewTab ? "_blank" : "_self"}
      rel={openInNewTab ? "noopener noreferrer" : ""}
      className={classNames}
    >
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classNames}
    >
      {children}
    </button>
  );
}
