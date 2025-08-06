export type LogMethod = (...args: unknown[]) => void;

const createLogger = (method: LogMethod): LogMethod => {
  return (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      method(...args);
    }
  };
};

export const logger = {
  log: createLogger(console.log),
  warn: createLogger(console.warn),
  error: createLogger(console.error),
};

export default logger;
