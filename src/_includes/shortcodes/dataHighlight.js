/**
 *@param {string} title
 *@param {string} subTitle
 *@param {string} color
 *@return {string}
 */
const dataHighlight = (title, subTitle, color) => {
  return `
        <div class="h-28 w-52 py-5 px-8 rounded-lg ${color}">
        <h2 class="text-3xl text-center font-semibold">${title}</h2>
        <p class="text-lg text-center text-gray-600">${subTitle}</p>
        </div>
    `;
};

module.exports = dataHighlight;
