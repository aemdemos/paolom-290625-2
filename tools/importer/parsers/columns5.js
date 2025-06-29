/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns (left: icons, right: text/image)
  const mainColumns = Array.from(element.querySelectorAll(':scope > div'));
  if (mainColumns.length < 2) return;
  const leftCol = mainColumns[0];
  const rightCol = mainColumns[1];

  // --- First content row ---
  // Left cell: icon grid and associated bits
  let leftRow1 = leftCol.querySelector(':scope > div');
  // Right cell: the top illustration or image in the rightCol
  let rightRow1 = rightCol.querySelector(':scope > div');

  // Fallbacks if not found
  if (!leftRow1) leftRow1 = leftCol;
  if (!rightRow1) rightRow1 = rightCol;

  // --- Second content row ---
  // Left cell: next main image or block from leftCol (different from first)
  let leftRow2 = null;
  const leftDivs = Array.from(leftCol.querySelectorAll(':scope > div'));
  if (leftDivs.length > 1) {
    leftRow2 = leftDivs[1];
  } else {
    // fallback: find the last image container
    const imgs = leftCol.querySelectorAll('img');
    if (imgs.length) leftRow2 = imgs[imgs.length - 1].closest('div');
  }

  // Right cell: all text and buttons after the hero image
  let rightRow2 = document.createDocumentFragment();
  const rightDivs = Array.from(rightCol.querySelectorAll(':scope > div'));
  if (rightDivs.length > 1) {
    for (let i = 1; i < rightDivs.length; i++) {
      rightRow2.appendChild(rightDivs[i]);
    }
  } else {
    // fallback: all paragraphs and CTAs in rightCol
    rightCol.querySelectorAll('p,button,a').forEach(e => rightRow2.appendChild(e));
  }
  if (!rightRow2.hasChildNodes()) rightRow2 = rightCol;

  // Compose the table with two columns per content row, matching the example
  const cells = [
    ['Columns (columns5)'],
    [leftRow1, rightRow1],
    [leftRow2, rightRow2]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
