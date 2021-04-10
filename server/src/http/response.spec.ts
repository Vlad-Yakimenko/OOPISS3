import { Response } from './response';
import { ServerResponse } from 'http';
import { 
  genRandomArray, genRandomInt, genRandomString, genRandomType 
} from '@test/random';

describe('`Response`', () => {
  let response: Response;
  let internalResponse: ServerResponse;

  beforeEach(() => {
    const mockIncomingRequest = {} as any;
    internalResponse = new ServerResponse(mockIncomingRequest);
    response = new Response(internalResponse);
  });

  describe('`json`', () => {
    it('should set `Content-Type` header as json and end response with provided data', () => {
      const data = { 
        field1: genRandomType(), 
        field2: genRandomType() 
      };
      const jsonHeader = {
        name: 'Content-Type',
        value: 'application/json',
      };

      const setHeaderSpy = jest.spyOn(internalResponse, 'setHeader');
      const endResponseSpy = jest.spyOn(internalResponse, 'end');
      const res = response.json(data);

      expect(setHeaderSpy).toHaveBeenCalledWith(jsonHeader.name, jsonHeader.value);
      expect(endResponseSpy).toHaveBeenCalledWith(JSON.stringify(data));
      expect(res).toEqual(response);
    });
  });

  describe('`setHeader`', () => {
    it('should set provided header to the response', () => {
      const header = {
        name: genRandomString(),
        value: genRandomString(),
      };

      const setHeaderSpy = jest.spyOn(internalResponse, 'setHeader');
      const res = response.setHeader(header);

      expect(setHeaderSpy).toHaveBeenCalledWith(header.name, header.value);
      expect(res).toEqual(response);
    });
  });

  describe('`setHeaders`', () => {
    it('should set provided headers to the response', () => {
      const genRandHeader = () => ({ name: genRandomString(), value: genRandomString() });
      const headers = genRandomArray(genRandHeader, 3);

      const setHeaderSpy = jest.spyOn(internalResponse, 'setHeader');
      const res = response.setHeaders(headers);

      headers.forEach((header, ind) => {
        expect(setHeaderSpy).toHaveBeenNthCalledWith(ind + 1, header.name, header.value);
      });

      expect(setHeaderSpy).toHaveBeenCalledTimes(headers.length);
      expect(res).toEqual(response);
    });
  });

  describe('`status`', () => {
    it('should set response status with provided value', () => {
      const statusCode: number = genRandomInt(100, 500);
      const res = response.status(statusCode);

      expect(internalResponse.statusCode).toEqual(statusCode);
      expect(res).toEqual(response);
    });
  });
});
