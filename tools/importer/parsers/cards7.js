/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all card containers (top-level direct children)
  const cardWrappers = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [];

  // Header row exactly matching the block name
  rows.push(['Cards (cards7)']);

  cardWrappers.forEach(card => {
    // 1. IMAGE: Find first <img> inside card's left section
    let img = null;
    const imgHolder = card.querySelector('.css-bf57a8, .css-phc9f9');
    if (imgHolder) {
      img = imgHolder.querySelector('img');
      if (!img) {
        // Sometimes there's an extra wrapper for the <img>
        const possibleImg = imgHolder.querySelector('.css-roiesn img');
        if (possibleImg) img = possibleImg;
      }
    }
    // fallback
    if (!img) {
      img = card.querySelector('img');
    }

    // 2. TEXT: Find text content in the right section
    // Usually .css-hhsbgd or .css-cyvvhb
    let textCellItems = [];
    const textWrap = card.querySelector('.css-hhsbgd, .css-cyvvhb');
    if (textWrap) {
      // Title: usually first p in .textContents inside textWrap
      const textContents = textWrap.querySelector('.textContents');
      let titleElem = null;
      if (textContents) {
        titleElem = textContents.querySelector('p');
      }
      if (titleElem) textCellItems.push(titleElem);

      // CTA: look for p with .css-z4f137 or containing 'Readmore' (case-insensitive)
      let ctaElem = textWrap.querySelector('p.css-z4f137, .css-z4f137');
      if (!ctaElem) {
        // fallback: any p containing 'Readmore'
        ctaElem = Array.from(textWrap.querySelectorAll('p')).find(p => /readmore/i.test(p.textContent));
      }
      if (ctaElem) {
        // Try to find the closest <a> ancestor (not in this HTML), else use the <p> directly
        let cta = ctaElem.closest('a');
        if (!cta) {
          // Use the existing <p> as the CTA text (will render as plain text, consistent with provided HTML)
          cta = ctaElem;
        }
        // Add line break if title present
        if (titleElem) {
          textCellItems.push(document.createElement('br'));
        }
        textCellItems.push(cta);
      }
    }

    // If textCellItems is empty, fallback to all text in textWrap
    if (textCellItems.length === 0 && textWrap) {
      textCellItems = [textWrap];
    }

    // Add the row: [image, text]
    rows.push([
      img,
      textCellItems.length === 1 ? textCellItems[0] : textCellItems
    ]);
  });

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
