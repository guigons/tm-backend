import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import SigitmUsuario from '../infra/typeorm/entities/SigitmUsuario';
import ISigitmUsuariosRepository from '../repositories/ISigitmUsuariosRepository';

interface IResponse {
  sigitmUsuarios: SigitmUsuario[] | undefined;
}

@injectable()
export default class ShowSigitmUsuariosService {
  constructor(
    @inject('SigitmUsuariosRepository')
    private sigitmUsuariosRepository: ISigitmUsuariosRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<IResponse> {
    const cacheKey = 'SigitmUsuarios';
    let sigitmUsuarios = await this.cacheProvider.recovery<SigitmUsuario[]>(
      cacheKey,
    );
    if (!sigitmUsuarios) {
      sigitmUsuarios = await this.sigitmUsuariosRepository.findAllActive();
      this.cacheProvider.save({
        key: cacheKey,
        value: sigitmUsuarios,
        expire: 3600,
      });
    }

    return { sigitmUsuarios };
  }
}
