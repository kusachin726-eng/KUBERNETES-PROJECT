
// Example: input "2025-01-26" -> Output: "26-01-2025"

function dateformatConverter(date) {
    const match = /^\d{4}-\d{2}-\d{2}$/.test(date);
    return match ? date.split('-').reverse().join('-') : date;
};


module.exports = dateformatConverter;