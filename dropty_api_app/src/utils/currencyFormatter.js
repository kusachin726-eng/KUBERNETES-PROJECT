function formatCurrency(amount) {
    // Format the amount as Indian Rupees (INR)
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    });
  
    return formatter.format(amount);
};

module.exports = formatCurrency;
  
