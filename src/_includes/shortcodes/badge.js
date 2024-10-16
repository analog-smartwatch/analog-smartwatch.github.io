/**
 *@param {string} name
 *@param {string} iconName
 *@param {string} link
 *@return {string}
 */
const badge = (name, iconName, link) => {
  var icon, iconAndText, contentWithLink;

  if (iconName == "menu") {
    icon = `
    <svg class="self-center" width="24px" height="24px" viewBox="0 0 512 512">
      <title>Menu</title>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="48" d="M88 152h336M88 256h336M88 360h336"/>
    </svg>`;
  }

  iconAndText = `
    <div class="mr-2">
      ${icon}
    </div>
    <div>
      <span class="select-none pt-1 pl-1 text-xl font-regular">
        ${name}
      </span>
    </div>
  `;

  wrapper = (content) => {
    return `
    <div class="inline-block items-center badge font-medium flex text-gray-500">
      ${content}
    </div>
    `;
  };

  if (link == null) {
    return wrapper(iconAndText);
  }

  contentWithLink = `
    <a aria-label="back" href="${link}" class="flex no-underline hover:hover-link items-center">
      ${iconAndText}
    </a>
  `;

  return wrapper(contentWithLink);
};

module.exports = badge;
