// cloudinaryLoader.js

module.exports = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};
