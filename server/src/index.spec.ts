import { start } from './index';

describe('App', () => {
  it('start', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => null);
    start();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
