import z from "zod";
import { JSDOM } from "jsdom";

type MetaTags = {
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  hostname: string | null;
  raw: Record<string, string>;
};

const getMetaTags = async (url: string): Promise<MetaTags> => {
  // fetch the url
  const html = (await $fetch(url, {
    parseResponse: (txt) => txt,
    headers: {
      Accept: "text/html,application/xhtml+xml",
    },
  })) as string;

  // create a virtual dom from the html
  const dom = new JSDOM(html);

  // get the document object
  const document = dom.window.document;

  // get the title
  const title = document.querySelector("title")?.textContent;

  // get the description
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");

  // get the image
  let image =
    document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content") ||
    document
      .querySelector('meta[name="twitter:image"]')
      ?.getAttribute("content") ||
    document.querySelector('meta[itemprop="image"]')?.getAttribute("content");

  if (image && !image.startsWith("http")) {
    image = new URL(image, new URL(url).origin).href;
  }

  // get the hostname
  const hostname = new URL(url).hostname;

  // get the favicon
  let favicon =
    document.querySelector('link[rel="icon"]')?.getAttribute("href") ||
    document.querySelector('link[rel="shortcut icon"]')?.getAttribute("href") ||
    document
      .querySelector('link[rel="apple-touch-icon"]')
      ?.getAttribute("href") ||
    document
      .querySelector('link[rel="apple-touch-icon-precomposed"]')
      ?.getAttribute("href");

  if (favicon && !favicon.startsWith("http")) {
    favicon = new URL(favicon, new URL(url).origin).href;
  }

  // get all the meta tags
  const raw = Array.from(document.querySelectorAll("meta")).reduce(
    (acc, meta) => {
      const key =
        meta.getAttribute("name") ||
        meta.getAttribute("property") ||
        meta.getAttribute("http-equiv") ||
        meta.getAttribute("charset") ||
        meta.getAttribute("itemprop") ||
        meta.getAttribute("name");
      const value = meta.getAttribute("content");

      if (key && value) {
        acc[key] = value;
      }

      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    title: title || null,
    description: description || null,
    image: image || null,
    favicon: favicon || null,
    hostname,
    raw,
  };
};

export default defineEventHandler(async (event) => {
  const { url } = await getValidatedQuery(
    event,
    z.object({ url: z.string().url() }).parse,
  );

  return await getMetaTags(url);
});
