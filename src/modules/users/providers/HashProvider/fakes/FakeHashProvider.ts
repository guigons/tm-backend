import IHashProvider from '../models/IHashProviders';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async comparaHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}

export default BCryptHashProvider;
