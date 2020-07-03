import bridge from '@shared/infra/bridge';
import AppError from '@shared/errors/AppError';
import SigitmGrupo from '../entities/SigitmGrupo';
import ISigitmGruposRepository from '../../../repositories/ISigitmGruposRepository';

class SigitmGruposRepository implements ISigitmGruposRepository {
  public async findAllActive(): Promise<SigitmGrupo[]> {
    try {
      const response = await bridge.get<SigitmGrupo[]>('/sigitm/grupos');
      const sigitmGrupos = response.data;
      return sigitmGrupos;
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }

  public async findByIds(ids: number[]): Promise<SigitmGrupo[]> {
    try {
      const response = await bridge.post<SigitmGrupo[]>('/sigitm/grupos/ids', {
        ids,
      });
      const sigitmGrupos = response.data;
      return sigitmGrupos;
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }
}

export default SigitmGruposRepository;
