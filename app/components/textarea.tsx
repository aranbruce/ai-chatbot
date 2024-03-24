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
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
      const maxHeight = lineHeight * 5;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 2 + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="w-full resize-none bg-transparent px-4 py-3 outline-none text-md"
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