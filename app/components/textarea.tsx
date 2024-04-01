import {useRef, useEffect, ChangeEvent, FC} from "react";

interface TextareaProps {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: any) => void;
  tabIndex?: number;
  autoFocus: boolean;
  spellCheck: boolean;
  autoComplete: string;
  autoCorrect: string;
  ariaLabel: string;
}

const Textarea: FC<TextareaProps>  = ({placeholder, value, onChange, onKeyDown, tabIndex, autoFocus, spellCheck, autoComplete, autoCorrect, ariaLabel }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      let lineHeight = parseFloat(getComputedStyle(textareaRef.current).lineHeight);
      if (isNaN(lineHeight)) {
        // Fallback value when lineHeight is "normal"
        lineHeight = parseFloat(getComputedStyle(textareaRef.current).fontSize) * 1.2;
      }
      const maxHeight = lineHeight * 5;
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, maxHeight) + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="w-full resize-none bg-transparent pl-[40px] pr-16 py-3 text-md text-zinc-950 placeholder:text-zinc-300 dark:text-zinc-50 dark:placeholder:text-zinc-700"
      rows={1}
      inputMode={"text"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      spellCheck={spellCheck}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      aria-label={ariaLabel}
      required={true}
    />
  );
};

export default Textarea;