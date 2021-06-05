export interface ILogger {
  info(...messages: string[]): void;
  warn(...messages: string[]): void;
  error(...messages: string[]): void;
}
