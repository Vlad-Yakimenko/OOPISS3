const mockHttpServer = {
  listen: jest.fn((port, host, cb) => cb()),
};
const mockRequest = {
  on: jest.fn(),
};
const mockResponse = {
  setHeader: jest.fn(),
  on: jest.fn(),
  writeHead: jest.fn(),
  end: jest.fn(),
};
const mockHttp = {
  Server: {},
  createServer: jest.fn().mockImplementation((cb) => {
    cb(mockRequest, mockResponse);
    return mockHttpServer;
  })
};
jest.mock('http', () => mockHttp);

import { genRandomInt } from '@test/random';
import { HttpMethodName } from './enum';
import { Server } from './server';

describe('`Server`', () => {
  let server: Server;
  const mockRouteDispatcher = {
    dispatch: jest.fn(),
  };
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    server = new Server(
      mockRouteDispatcher as any,
      mockLogger as any,
    );
  });

  it('should be instance of `Server`', () => {
    expect(server).toBeInstanceOf(Server);
  });

  describe('`start`', () => {
    it('should start server on specified port and host if server was not initialized previously', () => {
      const port = genRandomInt(3000, 5000);
      const host = 'localhost';

      (mockRequest as any).method = HttpMethodName.GET; 
      mockRequest.on
        .mockImplementation(function (event, cb) {
          cb();
          return this;
        });
      mockResponse.on.mockImplementation(() => null);

      server.start(port, host);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockHttp.createServer).toHaveBeenCalledWith(expect.any(Function));
      expect(mockHttpServer.listen).toHaveBeenCalledWith(port, host, expect.any(Function));
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledTimes(4); //set cors headers
      expect(mockRouteDispatcher.dispatch).toHaveBeenCalled();
    });

    it('should log error and not create server again if it was already created', () => {
      const port = genRandomInt(3000, 5000);
      const host = 'localhost';

      (mockRequest as any).method = HttpMethodName.POST; 
      jest.spyOn(Buffer, 'concat').mockReturnValue({
        toString: jest.fn(),
      } as any);
      jest.spyOn(JSON, 'parse').mockImplementation(() => ({}));

      mockRequest.on
        .mockImplementation(function (event, cb) {
          cb();
          return this;
        });
      mockResponse.on.mockImplementation(() => null);

      server.start(port, host);
      jest.clearAllMocks();

      server.start(port, host);
      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockHttp.createServer).not.toHaveBeenCalled();

      (Buffer.concat as any).mockRestore();
      (JSON.parse as any).mockRestore();
    });

    it('should return status 200 and not handle request if received pre-flight request', () => {
      const port = genRandomInt(3000, 5000);
      const host = 'localhost';

      (mockRequest as any).method = HttpMethodName.OPTIONS;
      mockRequest.on
        .mockImplementation(function (event, cb) {
          cb();
          return this;
        });
      mockResponse.on.mockImplementation(() => null);

      server.start(port, host);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockRouteDispatcher.dispatch).not.toHaveBeenCalled();
      expect(mockResponse.writeHead).toHaveBeenCalledWith(200);
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockHttp.createServer).toHaveBeenCalledWith(expect.any(Function));
      expect(mockHttpServer.listen).toHaveBeenCalledWith(port, host, expect.any(Function));
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should log response errors if something went wrong', () => {
      const port = genRandomInt(3000, 5000);
      const host = 'localhost';
      const err = new Error('test_error');

      (mockRequest as any).method = HttpMethodName.GET; //could be any HttpMethod
      mockResponse.on.mockImplementation((event, cb) => {
        cb(err);
      });

      server.start(port, host);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
