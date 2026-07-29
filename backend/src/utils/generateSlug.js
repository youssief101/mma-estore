module.exports = (text) =>
    text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");