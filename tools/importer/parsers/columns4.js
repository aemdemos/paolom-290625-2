/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell, as required
  const headerRow = ['Columns (columns4)'];

  // LEFT COLUMN (headline + subhead)
  const leftDiv = document.createElement('div');
  // Find headline (first .textContents under .css-ddsxl2)
  const headlineEl = element.querySelector('.css-ddsxl2 .textContents');
  if (headlineEl) leftDiv.appendChild(headlineEl);
  // Find subheadline (second .textContents under .css-i5fgkd)
  const subheadlineEl = element.querySelector('.css-i5fgkd > .textContents:nth-of-type(2)');
  if (subheadlineEl) leftDiv.appendChild(subheadlineEl);

  // FOUR STATS: icon, number, label
  const statCols = element.querySelectorAll('.css-xlnvuq');
  const statCells = [];
  statCols.forEach((col) => {
    const statDiv = document.createElement('div');
    const img = col.querySelector('[data-isimage="true"] img');
    if (img) statDiv.appendChild(img);
    const numEl = col.querySelector('.css-pfcwf6 p');
    if (numEl) statDiv.appendChild(numEl);
    const labelEl = col.querySelector('.css-cqutvk p');
    if (labelEl) statDiv.appendChild(labelEl);
    statCells.push(statDiv);
  });
  // pad to 4 columns if less, for robustness
  while (statCells.length < 4) {
    statCells.push(document.createElement('div'));
  }

  // Compose: header row (1 cell), then content row (5 cells)
  const cells = [
    headerRow, // 1 cell header
    [leftDiv, ...statCells] // 5 cells in row 2
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
