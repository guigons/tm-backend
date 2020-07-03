import bridge from '@shared/infra/bridge';
import AppError from '@shared/errors/AppError';
import SigitmUsuario from '../entities/SigitmUsuario';
import ISigitmUsuariosRepository from '../../../repositories/ISigitmUsuariosRepository';

class SigitmUsuariosRepository implements ISigitmUsuariosRepository {
  public async findAllActive(): Promise<SigitmUsuario[]> {
    try {
      const response = await bridge.get<SigitmUsuario[]>('/sigitm/usuarios');
      const sigitmGrupos = response.data;
      return sigitmGrupos;
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }
}

export default SigitmUsuariosRepository;
