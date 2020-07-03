import SigitmUsuario from '../infra/bridge/entities/SigitmUsuario';

export default interface ISigitmUsuariosRepository {
  findAllActive(): Promise<SigitmUsuario[]>;
}
