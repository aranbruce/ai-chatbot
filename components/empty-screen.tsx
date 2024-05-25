"use client";

import { useEffect, useState } from "react";
import { useActions } from "ai/rsc";

import Select, { SelectProps } from "./select";
import ExampleMessageCardGroupSkeleton from "./example-message/example-message-group-skeleton";

interface EmptyScreenProps {
  SelectProps: SelectProps;
  userLocation?: { latitude: number; longitude: number };
  locationError?: Error;
}

export default function EmptyScreen({
  SelectProps,
  userLocation,
  locationError,
}: EmptyScreenProps) {
  const [examplesUI, setExamplesUI] = useState(null);
  const { createExampleMessages } = useActions();

  useEffect(() => {
    if (locationError) {
      fetchExamples(SelectProps.selectedValue);
      return;
    } else if (userLocation) {
      fetchExamples(SelectProps.selectedValue, userLocation);
    }
    async function fetchExamples(
      model: string,
      userLocation?: { latitude: number; longitude: number },
    ) {
      const exampleMessagesUI = await createExampleMessages(
        model,
        userLocation,
      );
      setExamplesUI(exampleMessagesUI);
    }
  }, [userLocation, locationError]);

  return (
    <div className="flex h-full min-h-fit flex-col justify-between gap-1">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Select a model
        </p>
        <Select
          options={SelectProps.options}
          selectedValue={SelectProps.selectedValue}
          setSelectedValue={SelectProps.setSelectedValue}
        />
      </div>
      <div className="flex h-full flex-col content-center items-center justify-center gap-8 text-center">
        <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">
            Hi I'm Pal
          </h1>
          <p className="text-muted-foreground leading-normal text-zinc-500 dark:text-zinc-400">
            How can I help today?
          </p>
        </div>
      </div>
      {!examplesUI ? <ExampleMessageCardGroupSkeleton /> : examplesUI}
    </div>
  );
}
