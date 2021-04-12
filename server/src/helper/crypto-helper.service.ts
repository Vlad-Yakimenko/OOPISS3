import * as bcrypt from 'bcryptjs';

export class CryptoHelperService {
  public async hash(stringToHash: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); 
    const hashedString: string = await bcrypt.hash(stringToHash, salt);
    return hashedString;
  }

  public async compare(str: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(str, hash);
  } 
}