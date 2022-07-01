class HTTPError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;

    // Set here instead of super class constructor to allow null
    this.message = message;
  }
}

export default HTTPError;
