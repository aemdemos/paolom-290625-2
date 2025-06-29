/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exact as required
  const cells = [['Cards (cards6)']];

  // The block contains a single card: image (left) and content (right)
  // Get immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: image in first, content in second
  let cardImg = null;
  if (children[0]) {
    cardImg = children[0].querySelector('img');
  }

  const contentCol = [];
  if (children[1]) {
    // Main testimonial text
    const testimonialText = children[1].querySelector('.textContents p');
    if (testimonialText) contentCol.push(testimonialText);
    // Author (name)
    const authorElem = children[1].querySelector('.css-ddsxl2 .css-8aiu0b p');
    if (authorElem) contentCol.push(authorElem);
    // Company
    const companyElem = children[1].querySelector('.css-ddsxl2 .css-gi8lg5 p');
    if (companyElem) contentCol.push(companyElem);
  }

  // Add card row: [image, right content]
  cells.push([
    cardImg,
    contentCol
  ]);

  // Create and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
