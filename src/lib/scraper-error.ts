export class ScraperError extends Error {
  public statusCode?: number;
  public url?: string;
  public isRetryable: boolean;

  constructor(message: string, isRetryable: boolean = false, statusCode?: number, url?: string) {
    super(message);
    this.name = 'ScraperError';
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
    this.url = url;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScraperError);
    }
  }
}

export class NetworkError extends ScraperError {
  constructor(message: string, url?: string) {
    super(message, true, undefined, url); // Network errors are usually retryable
    this.name = 'NetworkError';
  }
}

export class ParsingError extends ScraperError {
  constructor(message: string, url?: string) {
    super(message, false, undefined, url); // Parsing errors usually require code changes, not retries
    this.name = 'ParsingError';
  }
}

export class RateLimitError extends ScraperError {
  public retryAfterMs: number;

  constructor(message: string, retryAfterMs: number = 5000, url?: string) {
    super(message, true, 429, url);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}
