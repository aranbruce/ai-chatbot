"use server";

import { JSDOM, VirtualConsole } from "jsdom";

export default async function getWebpageContents(url: string) {
  "use server";
  try {
    // console.log("Request received for get webpage contents action");
    const response = await fetch(url);

    if (!url) {
      throw new Error("Invalid URL");
    }

    if (!response.ok) {
      // console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJson = await response.text();

    const virtualConsole = new VirtualConsole();
    virtualConsole.on("log", () => {});
    virtualConsole.on("error", () => {});

    const dom = new JSDOM(responseJson, {
      contentType: "text/html",
      virtualConsole: virtualConsole,
    });

    let main = dom.window.document.querySelector("main")?.textContent;
    main = main?.replace(/[\n+\t]/g, "").replace(/\s+/g, " ");

    const selectors = [
      "article",
      "div[id*='article']",
      "div[class*='article']",
      "div[id*='content']",
    ];

    let article;
    for (const selector of selectors) {
      article = dom?.window?.document?.querySelector(selector)?.textContent;
      if (article) break;
    }
    article = article?.replace(/[\n+\t]/g, "").replace(/\s+/g, " ");
    if (article) {
      return { article: article?.slice(0, 5000) };
    } else if (main) {
      return { article: main?.slice(0, 5000) };
    } else {
      console.error("No article found", url);
      return { error: "No article found" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error occurred" };
  }
}
