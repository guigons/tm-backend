import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import SigitmGrupo from '../infra/typeorm/entities/SigitmGrupo';
import ISigitmGruposRepository from '../repositories/ISigitmGruposRepository';

interface IResponse {
  sigitmGrupos: SigitmGrupo[] | undefined;
}

@injectable()
export default class ShowSigitmGruposService {
  constructor(
    @inject('SigitmGruposRepository')
    private sigitmGruposRepository: ISigitmGruposRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<IResponse> {
    const cacheKey = 'SigitmGrupos';
    let sigitmGrupos = await this.cacheProvider.recovery<SigitmGrupo[]>(
      cacheKey,
    );
    if (!sigitmGrupos) {
      sigitmGrupos = await this.sigitmGruposRepository.findAllActive();
      this.cacheProvider.save({
        key: cacheKey,
        value: sigitmGrupos,
        expire: 3600,
      });
    }

    return { sigitmGrupos };
  }
}
