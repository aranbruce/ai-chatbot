import ExampleMessageCard, {
  ExampleMessageCardProps,
} from "./example-message-card";

export default function ExampleMessageCardGroup({
  exampleMessages,
}: {
  exampleMessages: ExampleMessageCardProps[];
}) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
      {exampleMessages.map(
        (example: ExampleMessageCardProps, index: number) => (
          <ExampleMessageCard
            key={index}
            index={index}
            heading={example.heading}
            subheading={example.subheading}
            modelVariable={example.modelVariable}
          />
        ),
      )}
    </div>
  );
}
