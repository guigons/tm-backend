import SigitmGrupo from '../infra/typeorm/entities/SigitmGrupo';

export default interface ISigitmGruposRepository {
  findAllActive(): Promise<SigitmGrupo[]>;
  findByIds(ids: number[]): Promise<SigitmGrupo[]>;
}
