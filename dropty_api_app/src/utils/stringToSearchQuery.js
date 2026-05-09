// convert string to search query for full text search (tsQuery)
function toSearchQuery(input) {
    let trimmed = input.trim();     
    let withoutSpecialChars = trimmed.replace(/[^a-zA-Z0-9 ]/g, ''); // Remove special characters
    let lowercase = withoutSpecialChars.toLowerCase();
    if(lowercase === '')  return ""
    const words = lowercase.split(' ');
    let result = words.filter(word => word != "").map(word => `${word}:*`).join(' & ')
    return result;
  }

module.exports = toSearchQuery;