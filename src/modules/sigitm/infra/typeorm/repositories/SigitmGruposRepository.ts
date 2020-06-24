import { getRepository, Repository } from 'typeorm';
import SigitmGrupo from '../entities/SigitmGrupo';
import ISigitmGruposRepository from '../../../repositories/ISigitmGruposRepository';

class SigitmGruposRepository implements ISigitmGruposRepository {
  private ormRepository: Repository<SigitmGrupo>;

  constructor() {
    this.ormRepository = getRepository(SigitmGrupo, 'sigitm');
  }

  public async findAllActive(): Promise<SigitmGrupo[]> {
    const sigitmGrupos = await this.ormRepository.find({
      where: { status: 10 },
    });
    return sigitmGrupos;
  }

  public async findByIds(ids: number[]): Promise<SigitmGrupo[]> {
    const sigitmGrupos = await this.ormRepository.findByIds(ids);
    return sigitmGrupos;
  }
}

export default SigitmGruposRepository;
