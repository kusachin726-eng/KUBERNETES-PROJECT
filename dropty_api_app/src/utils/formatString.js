function formatName(name) {
    if (typeof name !== 'string' || name.length === 0) {
        return name;
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

module.exports = {
    formatName
};