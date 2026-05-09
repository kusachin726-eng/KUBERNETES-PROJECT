function cleanText(value) {
    if (typeof value !== "string") return value;

    // Normalize whitespace: trim edges and collapse multiple spaces
    value = value.trim().replace(/\s+/g, " ");
    
    // Convert to Title Case for consistent storage
    return value
      .toLowerCase()
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  
  module.exports = {
    cleanText
  };
  