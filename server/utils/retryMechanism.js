const retryOperation = async (operation, retries = 3, delay = 1000) => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.error(`Retrying... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, delay));
      return retryOperation(operation, retries - 1, delay);
    } else {
      throw new Error("Operation failed after multiple attempts");
    }
  }
};

module.exports = retryOperation;
