"use server";

import { JSDOM, VirtualConsole } from "jsdom";
import TurndownService from "turndown";
var turndownService = new TurndownService();

export default async function getWebpageContents(url: string) {
  "use server";

  // console.log("Request received for get webpage contents action");

  try {
    if (!url) {
      throw new Error("Invalid URL");
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }

    const responseJson = await response.text();
    if (!responseJson) {
      throw new Error("Empty response");
    }

    const virtualConsole = new VirtualConsole();
    virtualConsole.on("log", () => {});
    virtualConsole.on("error", () => {});

    const dom = new JSDOM(responseJson, {
      contentType: "text/html",
      virtualConsole,
    });

    const content = extractContent(dom);
    if (content === null) {
      throw new Error("No content found");
    }
    return { article: content.slice(0, 5000) };
  } catch (error) {
    // console.log("Error: ", error);
    return null;
  }

  function extractContent(dom: JSDOM) {
    const markdown = turndownService.turndown(dom.window.document.body);

    let textContent = "";

    function extractText(node: Element) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === dom.window.Node.TEXT_NODE) {
          if (child.textContent) {
            textContent += child.textContent
              .replace(/[\n+\t]/g, "")
              .replace(/\s+/g, " ");
          }
        } else if (child.nodeType === dom.window.Node.ELEMENT_NODE) {
          const element = child as Element;
          if (element.tagName !== "SCRIPT" && element.tagName !== "STYLE") {
            extractText(element);
          }
        }
      });
    }

    extractText(dom.window.document.body);
    textContent = turndownService.turndown(textContent);
    return textContent || null;
  }
}
