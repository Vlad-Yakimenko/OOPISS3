import { getQueryParams, getBaseUrl } from '.';

describe('`Url Helpers`', () => {
  describe('`getBaseUrl`', () => {
    it('should return only slash for empty url', () => {
      const emptyUrl = '';
      const baseUrl = getBaseUrl(emptyUrl);
      expect(baseUrl).toEqual('/');
    });

    it('should return base url with leading slash for non-empty url', () => {
      const nonEmptyUrl = '/someBaseUrl?someQueryParam=someValue';
      const expectedBaseUrl = '/someBaseUrl';
      const baseUrl = getBaseUrl(nonEmptyUrl);
      expect(baseUrl).toEqual(expectedBaseUrl);
    });
  });

  describe('`getQueryParams`', () => {
    it('should return object with corresponding query params from url', () => {
      const urlWithQueryParams = '/someUrl?a=1&b=2';
      const queryParams = getQueryParams(urlWithQueryParams);
      expect(queryParams).toEqual({
        a: '1',
        b: '2'
      });
    });

    it('should return empty object if url does not have query params', () => {
      const urlWithoutQueryParams = '/someUrl';
      const queryParams = getQueryParams(urlWithoutQueryParams);
      expect(queryParams).toEqual({});
    });
  });
});