// @ts-ignore
module.exports = {
  content: ["**/*.html"],
  css: ["src/tailwind.css"],
  extractors: [
    {
      extractor: class {
        static extract(content) {
          return content.match(/[A-z0-9-:\/]+/g) || [];
        }
      },
      extensions: ["js", "ts", "jsx", "tsx"]
    }
  ]
};
