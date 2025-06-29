/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct children (these are the major columns)
  const columns = Array.from(element.children).filter(child => child.tagName === 'DIV');

  // Defensive: Ensure there are at least 4 columns (pad with empty divs if not)
  while (columns.length < 4) {
    columns.push(document.createElement('div'));
  }

  // Place the actual block reference for each cell
  // This guarantees each cell has its respective content
  const cells = [
    ['Columns (columns8)'],
    [columns[0], columns[1], columns[2], columns[3]]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
