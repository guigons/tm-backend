import ISaveCache from '../dtos/ISaveCache';

export default interface ICacheProvider {
  save(data: ISaveCache): Promise<void>;
  recovery<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
