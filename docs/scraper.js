// Port of web_scraper.py. Works on a parsed HTML document instead of a bs4 object.

/**
 * Takes a parsed HTML document and separates its <p> elements into comic titles.
 * Returns an array of titles
 */
function extractComics(doc) {
  const comicList = [];

  // Loops through every <p> element
  for (const pElement of doc.querySelectorAll("p")) {
    // This splits <p> elements that have multiple comic titles
    const chunk = pElement.textContent.split("\n");

    for (const comic of chunk) {
      // Add comic book event listings to list
      if (comic.includes(" here.")) {
        comicList.push(comic.trimStart());
        continue;
      }
      // Do not add
      if (comic.includes("First Appearance:")) {
        continue;
      }
      // Add alternate starts
      if (comic.includes("Alternate Starting Point:")) {
        comicList.push(comic.trimStart());
        continue;
      }
      // Add comics that are numbered or dated
      if (comic.includes("#") || comic.includes("(")) {
        comicList.push(comic.trimStart());
      }
    }
  }

  return comicList;
}

/**
 * Joins titles into the semi-colon delimited format of "reading_list.txt"
 */
function createCsv(comicList) {
  return comicList.map((comic) => comic + ";").join("");
}

// Allows the functions to be loaded in Node for testing
if (typeof module !== "undefined") {
  module.exports = { extractComics, createCsv };
}
