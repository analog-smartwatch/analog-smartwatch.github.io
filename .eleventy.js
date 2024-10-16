const { DateTime } = require("luxon");
const fs = require("fs");
const markdownIt = require("markdown-it");
const htmlmin = require("html-minifier");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const dataHighlight = require("./src/_includes/shortcodes/dataHighlight");
const badge = require("./src/_includes/shortcodes/badge");
const lazyImagesPlugin = require("eleventy-plugin-lazyimages");
const isPostPublished = (post) => !post.data.draft;

let getSvgContent = function (file) {
  let relativeFilePath = `./src/assets/svg/${file}.svg`;
  let data = fs.readFileSync(relativeFilePath, function (err, contents) {
    if (err) return err;
    return contents;
  });

  return data.toString("utf8");
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("dataHighlight", dataHighlight);
  eleventyConfig.addShortcode("svg", getSvgContent);
  eleventyConfig.addShortcode("badge", badge);
  
  eleventyConfig.addPlugin(lazyImagesPlugin);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.js": "./js/alpine.js",
  });
  eleventyConfig.addPassthroughCopy("src/assets/images");

  const md = new markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  } else {
    eleventyConfig.setBrowserSyncConfig({
      callbacks: { ready: browserSyncReady },
    });
  }

  eleventyConfig.addCollection("page", function (collections) {
    return collections.getFilteredByTag("page").sort(function (a, b) {
      return a.data.order - b.data.order;
    });
  });

  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("./src/blog/*.md").filter(isPostPublished);
  });

  eleventyConfig.addShortcode("currentDate", (date = DateTime.now()) => {
    return date;
  });

  eleventyConfig.addFilter("dateFormating", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addWatchTarget("./src/styles/");

  var pathPrefix = "";
  if (process.env.GITHUB_REPOSITORY) {
    pathPrefix = process.env.GITHUB_REPOSITORY.split("/")[1];
  }

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
    pathPrefix,
  };
};

function browserSyncReady(err, bs) {
  bs.addMiddleware("*", (req, res) => {
    const content_404 = fs.readFileSync("_site/404.html");
    // Add 404 http status code in request header.
    res.writeHead(404, { "Content-Type": "text/html; charset=ETF-8" });
    // Provides the 404 content without redirect.
    res.write(content_404);
    res.end();
  });
}

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return content;
}
