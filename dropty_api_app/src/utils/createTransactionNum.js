const generateTransactionNumber = (autoIncrementedId) => {
    // Generate timestamp
    const timestamp = Date.now(); // Current timestamp in milliseconds
  
    // Create a transaction number using the auto-incremented ID and timestamp
    const transactionNumber = `PAY-${autoIncrementedId}-${timestamp}`;
  
    return transactionNumber;
};

module.exports = generateTransactionNumber;