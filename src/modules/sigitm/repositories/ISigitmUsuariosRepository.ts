import SigitmUsuario from '../infra/typeorm/entities/SigitmUsuario';

export default interface ISigitmUsuariosRepository {
  findAllActive(): Promise<SigitmUsuario[]>;
}
