/**
 * Extract content from HTML, removing all tags including nested ones.
 * @param {string} html - The HTML string to process.
 * @returns {string} - The plain text content.
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}
