import { genRandomArray, genRandomString } from '@test/random';
import { Logger } from './'; 

describe('`Logger`', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  it('should be instance of `Logger`', () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it('`info`', () => {
    const messages = genRandomArray(genRandomString, 3);
    const baseLoggerSpy = jest.spyOn(console, 'info').mockImplementation(() => null);

    logger.info(...messages);
    expect(baseLoggerSpy).toHaveBeenCalledWith(expect.any(String));
    expect(baseLoggerSpy).toHaveBeenCalledTimes(1);
  });

  it('`warn`', () => {
    const messages = genRandomArray(genRandomString, 3);
    const baseLoggerSpy = jest.spyOn(console, 'warn').mockImplementation(() => null);

    logger.warn(...messages);
    expect(baseLoggerSpy).toHaveBeenCalledWith(expect.any(String));
    expect(baseLoggerSpy).toHaveBeenCalledTimes(1);
  });
  
  it('`error`', () => {
    const messages = genRandomArray(genRandomString, 3);
    const baseLoggerSpy = jest.spyOn(console, 'error').mockImplementation(() => null);

    logger.error(...messages);
    expect(baseLoggerSpy).toHaveBeenCalledWith(expect.any(String));
    expect(baseLoggerSpy).toHaveBeenCalledTimes(1);
  });
});
