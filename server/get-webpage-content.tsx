"use server";

import { JSDOM, VirtualConsole } from "jsdom";

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
    return { article: content.slice(0, 2000) };
  } catch (error) {
    // console.log("Error: ", error);
    return null;
  }

  function extractContent(dom: JSDOM): string {
    const selectors = [
      "main",
      "article",
      "div[id*='article']",
      "div[class*='article']",
    ];
    for (const selector of selectors) {
      const content = dom.window.document
        .querySelector(selector)
        ?.textContent?.replace(/[\n+\t]/g, "")
        .replace(/\s+/g, " ");
      if (content) {
        return content;
      }
    }
    return "";
  }
}
