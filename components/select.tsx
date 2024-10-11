"use client";

export interface SelectProps {
  variant: "primary" | "secondary";
  options: Option[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

type Provider = "openai" | "claude" | "gemini" | "mistral" | "llama";

interface Option {
  value: string;
  label: string;
  provider?: Provider;
}

import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import ProviderImage from "./provider-image";

const baseClasses =
  "dark:active-bg-zinc-700 inline-flex px-2 py-2 pr-3 w-full items-center justify-center gap-2 rounded-xl  font-medium ring-slate-950/20 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-[3px] active:bg-zinc-200  disabled:pointer-events-none disabled:text-zinc-300 dark:ring-white/40 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600";

const primaryClasses = `${baseClasses} border border-zinc-200 text-sm text-zinc-950 dark:text-zinc-50 bg-white dark:border-zinc-800 dark:bg-zinc-800`;

const secondaryClasses = `${baseClasses} text-xs text-zinc-600 dark:text-zinc-200`;

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
      <MenuButton
        className={variant === "primary" ? primaryClasses : secondaryClasses}
      >
        <div className="flex w-full flex-row items-center gap-2 text-left text-sm">
          {selectedOption?.provider && (
            <ProviderImage provider={selectedOption?.provider} />
          )}
          {selectedOption?.label}
        </div>
        <svg
          className="-mr-1 h-5 w-5 text-zinc-400"
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
          anchor="bottom start"
          className={`h-40 w-[var(--button-width)] origin-top-right overflow-scroll rounded-lg bg-white px-1 shadow-lg ring-1 ring-black ring-opacity-5 [--anchor-gap:8px] [--anchor-padding:100px] focus:outline-none dark:bg-zinc-800`}
        >
          <div className="py-1">
            {options.map((option) => (
              <MenuItem key={option.value}>
                <a
                  className="flex cursor-pointer flex-row items-center gap-2 rounded-md bg-no-repeat px-1 py-2 text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 dark:text-white dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 dark:focus-visible:ring-zinc-300"
                  onClick={() =>
                    setSelectedValue && setSelectedValue(option.value)
                  }
                >
                  {option.provider && (
                    <ProviderImage provider={option.provider} />
                  )}
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
