// Cloudflare Worker that fetches a reading order page on behalf of the static site.
// Browsers can't read comicbookreadingorders.com directly because it sends no CORS headers.

// Sites that are allowed to call this worker from a browser
const ALLOWED_ORIGINS = [
  "https://jacob-armiger.github.io",
  "https://www.comicbookreadingordersdownload.com",
  "https://comicbookreadingordersdownload.com",
];

// Only pages on these hosts will be fetched, so this can't be used as a general proxy
const SOURCE_HOSTS = ["comicbookreadingorders.com", "www.comicbookreadingorders.com"];

function corsHeaders(origin) {
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
  if (ALLOWED_ORIGINS.includes(origin) || isLocal) {
    return { "Access-Control-Allow-Origin": origin, "Vary": "Origin" };
  }
  return {};
}

function error(message, status, cors) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

export default {
  async fetch(request) {
    const cors = corsHeaders(request.headers.get("Origin"));

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { ...cors, "Access-Control-Allow-Methods": "GET" } });
    }
    if (request.method !== "GET") {
      return error("Method not allowed", 405, cors);
    }

    let target;
    try {
      target = new URL(new URL(request.url).searchParams.get("url"));
    } catch {
      return error("Not a valid URL", 400, cors);
    }
    if (target.protocol !== "https:" || !SOURCE_HOSTS.includes(target.hostname)) {
      return error("Only comicbookreadingorders.com URLs are supported", 400, cors);
    }

    let page;
    try {
      // Change User-Agent so that scraper isn't blocked
      page = await fetch(target, { headers: { "User-Agent": "Mozilla/6.0" } });
    } catch {
      return error("We couldn't connect to that URL. Try again!", 502, cors);
    }
    if (!page.ok) {
      return error(`The reading order site responded with ${page.status}`, 502, cors);
    }

    return new Response(page.body, {
      headers: { "Content-Type": "text/html; charset=UTF-8", ...cors },
    });
  },
};
