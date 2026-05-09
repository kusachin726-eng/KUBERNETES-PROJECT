function generateSlug(title) {
    const titleTrim = title.trim();
    return titleTrim.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

module.exports = generateSlug;