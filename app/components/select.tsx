export interface SelectProps {
  options: Option[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

interface Option {
  value: string;
  label: string;
}

import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Select({
  options,
  selectedValue,
  setSelectedValue,
}: SelectProps) {
  return (
    <Menu as="div" className="relative inline-block w-40 text-left">
      <div>
        <MenuButton className="text-primary-foreground dark:active-bg-zinc-700 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-950 ring-slate-950/20 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-[3px] active:bg-zinc-200  disabled:pointer-events-none disabled:text-zinc-300  dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-white/40 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600">
          <div className="w-full text-left text-sm">
            {options.find((option) => option.value === selectedValue)?.label}
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
        <MenuItems className="absolute right-0 z-10 mt-2 max-h-40 w-full origin-top-right overflow-scroll rounded-lg bg-white px-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800">
          <div className="py-1">
            {options.map((option) => (
              <MenuItem key={option.value}>
                <a
                  href="#"
                  className={classNames(
                    "block rounded-md px-4 py-2 text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 dark:text-white dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 dark:focus-visible:ring-zinc-300",
                  )}
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
