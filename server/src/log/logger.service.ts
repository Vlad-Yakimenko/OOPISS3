import { Injectable } from '@nestjs/common';
import { ILogger } from './logger.interface';

type LogSeverity = 'INFO' | 'WARN' | 'ERROR';

@Injectable()
export class LoggerService implements ILogger {
  private readonly baseLogger: Required<ILogger> = console;

  public info(...messages: string[]): void {
    this.baseLogger.info(this.format('INFO', messages));
  }

  public warn(...messages: string[]): void {
    this.baseLogger.warn(this.format('WARN', messages));
  }

  public error(...messages: string[]): void {
    this.baseLogger.error(this.format('ERROR', messages));
  }

  private format(level: LogSeverity, messages: string[]): string {
    const time = new Date().toISOString();
    const severity = level.toUpperCase();
    return `${time}::${severity}::${messages.join(' ')}`;
  }
}
