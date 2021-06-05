const mockHelpers = {
  ...jest.requireActual('@app/helper'),
  getBaseUrl: jest.fn(),
};
jest.mock('@app/helper', () => mockHelpers);

import { RouteDispatcher } from "./route-dispatcher";

describe('`RouteDispatcher`', () => {
  let routeDispatcher: RouteDispatcher;
  const mockLogger = {
    info: jest.fn(),
  };
  const mockController = {
    handle: jest.fn(),
  };
  const mockAppModule = {
    findController: jest.fn().mockReturnValue(mockController),
  };

  beforeEach(() => {
    routeDispatcher = new RouteDispatcher(
      mockLogger as any,
      mockAppModule as any,
    );
  });

  it('should be instance of `RouteDispatcher`', () => {
    expect(routeDispatcher).toBeInstanceOf(RouteDispatcher);
    expect(new RouteDispatcher()).toBeInstanceOf(RouteDispatcher);
  });

  describe('`dispatch`', () => {
    it('should find controller by url and method and handle request', async () => {
      const baseUrl = '/baseUrl';
      const mockRequest = {
        url: `${baseUrl}?a=1&b=2`,
        method: 'GET' //could be any Http Method
      };
      const mockResponse = {};
      const jsonToReturn = {};

      mockHelpers.getBaseUrl.mockReturnValue(baseUrl);
      mockController.handle.mockReturnValue(jsonToReturn);

      await expect(routeDispatcher.dispatch(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(jsonToReturn);
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockHelpers.getBaseUrl).toHaveBeenCalledWith(mockRequest.url);
      expect(mockAppModule.findController).toHaveBeenCalledWith(baseUrl, mockRequest.method);
    });
  });
});