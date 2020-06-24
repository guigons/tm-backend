import { getRepository, Repository } from 'typeorm';
import SigitmUsuario from '../entities/SigitmUsuario';
import ISigitmUsuariosRepository from '../../../repositories/ISigitmUsuariosRepository';

class SigitmUsuariosRepository implements ISigitmUsuariosRepository {
  private ormRepository: Repository<SigitmUsuario>;

  constructor() {
    this.ormRepository = getRepository(SigitmUsuario, 'sigitm');
  }

  public async findAllActive(): Promise<SigitmUsuario[]> {
    console.log('SigitmUsuario FOI NO BANCO!');
    const sigitmGrupos = await this.ormRepository.find({
      where: { status: 10 },
    });
    return sigitmGrupos;
  }
}

export default SigitmUsuariosRepository;
