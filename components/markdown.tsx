import Markdown from "react-markdown";

import CodeContainer from "@/components/code-container";

export default function MarkdownContainer({ children }: { children: string }) {
  return (
    <Markdown
      children={children}
      components={{
        // Map `h1` (`# heading`) to use `h2`s.
        h1: "h2",
        h2(props) {
          const { node, ...rest } = props;
          return <h2 className="text-xl font-semibold" {...rest} />;
        },
        h3(props) {
          const { node, ...rest } = props;
          return <h3 className="text-lg font-semibold" {...rest} />;
        },
        h4(props) {
          const { node, ...rest } = props;
          return <h4 className="text-md font-semibold" {...rest} />;
        },
        ol(props) {
          const { node, ...rest } = props;
          return <ol className="flex flex-col flex-wrap gap-4" {...rest} />;
        },
        ul(props) {
          const { node, ...rest } = props;
          return <ul className="flex flex-col flex-wrap gap-4" {...rest} />;
        },
        li(props) {
          const { node, ...rest } = props;
          return <li className="" {...rest} />;
        },
        a(props) {
          const { node, ...rest } = props;
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-950 underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 dark:text-zinc-50 dark:ring-offset-zinc-900 dark:focus-visible:ring-zinc-300"
              {...rest}
            />
          );
        },
        pre(props) {
          const { node, ...rest } = props;
          return <pre className="grid w-full" {...rest} />;
        },
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "text";
          const capitalizedLanguage =
            language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
          return match ? (
            <CodeContainer
              capitalizedLanguage={capitalizedLanguage}
              language={language}
              children={children}
            />
          ) : (
            <code {...rest} className="text-sm font-semibold">
              {children}
            </code>
          );
        },
      }}
    />
  );
}
