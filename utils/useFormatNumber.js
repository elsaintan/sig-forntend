/**
 * A utility function for formatting numbers using the Intl.NumberFormat API.
 * This function takes a number and returns its formatted string representation.
 *
 * @param {number} inputNumber - The number to be formatted.
 * @returns {string} - The formatted number as a string.
 */
export function formatNumber(inputNumber) {
    const formatter = new Intl.NumberFormat('zh-TW', { style: 'decimal' });
    return formatter.format(inputNumber);
}
