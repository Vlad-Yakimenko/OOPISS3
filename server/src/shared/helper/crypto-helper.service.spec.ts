const mockCrypto = {
  hash: jest.fn(),
  genSalt: jest.fn(),
  compare: jest.fn(),
};
jest.mock('bcryptjs', () => mockCrypto);

import * as bcrypt from 'bcryptjs';
import { genRandomBoolean } from '@test/random';
import { CryptoHelperService } from "./crypto-helper.service";

describe('`CryptoHelerService`', () => {
  let cryptoHelperService: CryptoHelperService;

  beforeEach(() => {
    cryptoHelperService = new CryptoHelperService();
  });

  it('should be instance of `CryptoHelperService`', () => {
    expect(cryptoHelperService).toBeInstanceOf(CryptoHelperService);
  });

  describe('`hash`', () => {
    it('should salt and hash provided string', async () => {
      const stringToHash: string = 'stringToHash';
      const hashedString: string = 'hashedString';
      const salt = 'salt';

      mockCrypto.genSalt.mockResolvedValue(salt);
      mockCrypto.hash.mockResolvedValue(hashedString);

      expect(await cryptoHelperService.hash(stringToHash)).toEqual(hashedString);
      expect(mockCrypto.genSalt).toHaveBeenCalledWith(10);
      expect(mockCrypto.hash).toHaveBeenCalledWith(stringToHash, salt);
    });
  });

  describe('`compare`', () => {
    it('should compare string and expected hash', async () => {
      const someString: string = 'someString';
      const stringHash: string = 'stringHash';
      const isEqual: boolean = genRandomBoolean();

      mockCrypto.compare.mockResolvedValue(isEqual);
      expect(await cryptoHelperService.compare(someString, stringHash)).toEqual(isEqual);
      expect(mockCrypto.compare).toHaveBeenCalledWith(someString, stringHash);
    });
  });
});