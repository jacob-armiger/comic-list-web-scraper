// URL of the deployed Cloudflare Worker in worker/worker.js
const FETCH_WORKER_URL = "https://reading-orders-fetch.jacob-lane.workers.dev";

const CSV_FILE_NAME = "reading_list.txt";
const EXCEL_FILE_NAME = "reading_list.xlsx";

const form = document.getElementById("comic-form");
const messages = document.getElementById("messages");

function flash(message) {
  const alert = document.createElement("div");
  alert.className = "alert alert-warning";

  const close = document.createElement("button");
  close.type = "button";
  close.className = "close";
  close.innerHTML = "&times;";
  close.addEventListener("click", () => alert.remove());

  alert.append(close, " " + message);
  messages.append(alert);
}

/**
 * Fetches a reading order page through the worker.
 * Returns a parsed HTML document
 */
async function scrape(url) {
  let response;
  try {
    response = await fetch(FETCH_WORKER_URL + "?url=" + encodeURIComponent(url));
  } catch {
    throw new Error("We couldn't connect to that URL. Try again!");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "OOPS!! General Error");
  }
  return new DOMParser().parseFromString(await response.text(), "text/html");
}

function downloadCsv(comicList) {
  const blob = new Blob([createCsv(comicList)], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = CSV_FILE_NAME;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadExcel(comicList) {
  const ws = XLSX.utils.aoa_to_sheet(comicList.map((comic) => [comic]));

  // Set proper width for column
  ws["!cols"] = [{ wch: Math.max(...comicList.map((comic) => comic.length)) }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Comics");
  XLSX.writeFile(wb, EXCEL_FILE_NAME);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  messages.replaceChildren();

  const comicUrl = form.elements["input"].value.trim();

  // Handle input that doesn't have http schema
  if (!comicUrl.includes("https://")) {
    flash("Not a valid URL");
    return;
  }

  const buttons = form.querySelectorAll("input[type=submit]");
  buttons.forEach((button) => (button.disabled = true));
  try {
    const comicList = extractComics(await scrape(comicUrl));
    if (comicList.length === 0) {
      flash("No comics were found on that page");
      return;
    }

    // Download depends on which submit button was pressed
    if (event.submitter && event.submitter.name === "CSV") {
      downloadCsv(comicList);
    } else {
      downloadExcel(comicList);
    }
  } catch (e) {
    flash(e.message);
  } finally {
    buttons.forEach((button) => (button.disabled = false));
  }
});
