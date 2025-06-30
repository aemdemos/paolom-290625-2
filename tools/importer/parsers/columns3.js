/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns3)'];

  // We'll try to find the three main columns as shown in the example
  // 1. The left: illustration with some text ("The unseen of spending three years at Pixelgrade", para, button)
  // 2. The center: illustration/image
  // 3. The right: illustration/image

  // The structure is a bit nested. We'll look for the main split.
  // First, find the immediate children containing the block columns
  // From screenshots and HTML, the structure is two top-level .css-5knerd, the second one is the row/block we want
  // It contains a div.css-i5es2l with two children:
  //   - First is the left column (has text and button)
  //   - Second is an illustration image
  // The first .css-5knerd is a huge grid of assets used for other layouts, not this use-case
  // So, for this example, the second main child is what we want.

  const mainSections = element.querySelectorAll(':scope > div');
  if (mainSections.length < 2) return;
  const blockRow = mainSections[1];
  // This should have a single .css-i5es2l, which contains the two columns
  const innerRow = blockRow.querySelector('.css-i5es2l');
  if (!innerRow) return;
  const cols = innerRow.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // First column: illustration
  const illustrationCol = cols[0];
  // Second column: text, para, cta button
  const textCol = cols[1];

  // Compose the cells array matching the example structure
  const cells = [
    headerRow,
    [illustrationCol, textCol]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
