export interface SelectProps {
  variant: "primary" | "secondary";
  options: Option[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

interface Option {
  value: string;
  label: string;
  provider?: string;
}

import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";

const baseClasses =
  "dark:active-bg-zinc-700 inline-flex pl-1 pr-3 w-full items-center justify-center gap-2 rounded-xl  bg-white  font-medium text-zinc-950 ring-slate-950/20 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-[3px] active:bg-zinc-200  disabled:pointer-events-none disabled:text-zinc-300  dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-white/40 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600";

const primaryClasses = `${baseClasses} border border-zinc-200 text-sm`;

const secondaryClasses = `${baseClasses} text-xs`;

export default function Select({
  variant,
  options,
  selectedValue,
  setSelectedValue,
}: SelectProps) {
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  return (
    <Menu
      as="div"
      className={`relative inline-block ${variant === "primary" ? "w-40" : "w-36"} text-left`}
    >
      <div>
        <MenuButton
          className={variant === "primary" ? primaryClasses : secondaryClasses}
        >
          <div
            className={`w-full bg-no-repeat py-2 pl-10 text-left text-sm ${selectedOption?.provider === "openai" ? "bg-openai" : selectedOption?.provider === "anthropic" ? "bg-claude" : selectedOption?.provider === "gemini" ? "bg-gemini" : selectedOption?.provider === "mistral" ? "bg-mistral" : ""}`}
          >
            {selectedOption?.label}
          </div>
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            ></path>
          </svg>
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={`absolute right-0 z-10 mt-2 ${variant === "primary" ? "max-h-40" : "max-h-20"} w-full origin-top-right overflow-scroll rounded-lg bg-white px-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800`}
        >
          <div className="py-1">
            {options.map((option) => (
              <MenuItem key={option.value}>
                <a
                  className={`${option.provider === "openai" ? "bg-openai" : option.provider === "anthropic" ? "bg-claude" : option.provider === "gemini" ? "bg-gemini" : option.provider === "mistral" ? "bg-mistral" : ""} block cursor-pointer rounded-md bg-no-repeat py-2 pl-10 pr-4 text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 dark:text-white dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 dark:focus-visible:ring-zinc-300`}
                  onClick={() =>
                    setSelectedValue && setSelectedValue(option.value)
                  }
                >
                  {option.label}
                </a>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
