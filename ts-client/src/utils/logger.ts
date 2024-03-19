import debug from "debug";

// It creates logger instance to give you the control for different log levels
//  via 1 instance per, e.g. module.
// Usage example of this logger based on debug npm lib:
//  https://www.npmjs.com/package/debug#usage.
export class Logger {
  private prefix: string;
  private _info: debug.Debugger;
  private _warn: debug.Debugger;
  private _debug: debug.Debugger;

  // @param prefix - prefix for all log messages, e.g. "deal-ts-clients:dealMatcherClient".
  constructor(prefix: string) {
    this.prefix = prefix;
    this._info = debug(`${this.prefix}:info`);
    this._warn = debug(`${this.prefix}:warn`);
    this._debug = debug(`${this.prefix}:debug`);
  }

  info(message: string) {
    return this._info(message);
  }

  warn(message: string) {
    return this._warn(message);
  }

  debug(message: string) {
    return this._debug(message);
  }
}

export const getLogger = (prefix: string) => new Logger(prefix);
