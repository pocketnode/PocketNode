/**
 * PHP-Like rounding
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 * @param number
 * @param precision
 * @returns {number}
 */
function PHPRound(number, precision = 0) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

module.exports = PHPRound;