"use server";

import puppeteer, { Browser } from "puppeteer";

export default async function getWebpageContents(url: string) {
  "use server";
  const browser: Browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(url, {
      // waitUntil: "domcontentloaded",
    });

    const response = await page.evaluate((url) => {
      const articles = Array.from(document.querySelectorAll("article"));
      if (articles.length > 0) {
        const data = articles.map((article) => ({
          content: article.innerText.slice(0, 5000),
        }));
        return data;
      } else {
        const mainContent = document.querySelector("main")?.innerText;
        return [
          {
            content:
              mainContent?.slice(0, 5000) || `No content found at ${url}`,
          },
        ];
      }
    }, url);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error occurred" };
  } finally {
    await browser.close();
  }
}
