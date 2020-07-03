import bridge from '@shared/infra/bridge';
import AppError from '@shared/errors/AppError';
import ITAsRepository from '../../../repositories/ITAsRepository';
import ILoadTAsGroupDTO from '../../../dtos/ILoadTAsGroupDTO';
import TA from '../entities/TA';

class TAsRepository implements ITAsRepository {
  public async findByStatusAndTipoRede({
    status1,
    status2,
    tipoRede1,
    tipoRede2,
  }: ILoadTAsGroupDTO): Promise<TA[]> {
    try {
      const response = await bridge.post<TA[]>('/tas', {
        status1,
        status2,
        tipoRede1,
        tipoRede2,
      });
      const tas = response.data;
      return tas;
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }

  public async findByIds(ids: number[]): Promise<TA[]> {
    try {
      const response = await bridge.post<TA[]>('/tas/ids', {
        ids,
      });
      const tas = response.data;
      return tas;
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }

  public async findById(id: number): Promise<TA | undefined> {
    try {
      const response = await bridge.get<TA>(`/tas/${id}`);
      const tas = response.data;
      return tas;
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }
}

export default TAsRepository;
