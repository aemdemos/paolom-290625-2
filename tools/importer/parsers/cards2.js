/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as in the example
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Get all cards (direct children)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  cardDivs.forEach((cardDiv) => {
    // Each cardDiv has two main children: left (icon+title), right (desc)
    const leftCol = cardDiv.querySelector(':scope > div:first-child');
    const rightCol = cardDiv.querySelector(':scope > div:nth-child(2)');

    // Find image (first img descendant in leftCol)
    const img = leftCol ? leftCol.querySelector('img') : null;

    // Find card title: first p in leftCol's .textContents
    let title = null;
    if (leftCol) {
      const titleContainer = leftCol.querySelector('.textContents');
      if (titleContainer) {
        title = titleContainer.querySelector('p');
      }
    }

    // Find card description: first p in rightCol's .textContents
    let desc = null;
    if (rightCol) {
      const descContainer = rightCol.querySelector('.textContents');
      if (descContainer) {
        desc = descContainer.querySelector('p');
      }
    }

    // Compose cell for text: title (if exists), then desc (if exists)
    // Use array so multi-element cell is supported
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    
    // Only add row if there's at least an image or text
    if (img || textCell.length) {
      rows.push([
        img,
        textCell
      ]);
    }
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
