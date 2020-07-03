import SigitmGrupo from '../infra/bridge/entities/SigitmGrupo';

export default interface ISigitmGruposRepository {
  findAllActive(): Promise<SigitmGrupo[]>;
  findByIds(ids: number[]): Promise<SigitmGrupo[]>;
}
