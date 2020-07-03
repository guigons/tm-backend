import AppError from '@shared/errors/AppError';
import { plainToClass } from 'class-transformer';
import bridge from '@shared/infra/bridge';
import ITPsRepository from '../../../repositories/ITPsRepository';
import ILoadTPsGroupDTO from '../../../dtos/ILoadTPsGroupDTO';
import TP from '../entities/TP';

class TPsRepository implements ITPsRepository {
  public async findByDataInicioPrevAndTipoRede({
    daysBefore,
    daysAfter,
    tipoRede1,
    tipoRede2,
  }: ILoadTPsGroupDTO): Promise<TP[]> {
    try {
      const response = await bridge.post<TP[]>('/tps', {
        daysBefore,
        daysAfter,
        tipoRede1,
        tipoRede2,
      });
      const tps = response.data;
      return tps.map(tp => plainToClass(TP, tp));
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }

  public async findByIds(ids: number[]): Promise<TP[]> {
    try {
      const response = await bridge.post<TP[]>('/tps/ids', {
        ids,
      });
      const tps = response.data;
      return tps.map(tp => plainToClass(TP, tp));
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }

  public async findById(id: number): Promise<TP | undefined> {
    try {
      const response = await bridge.get<TP>(`/tps/${id}`);
      const tp = response.data;
      return plainToClass(TP, tp);
    } catch (error) {
      throw new AppError('Bridge failed communications');
    }
  }
}

export default TPsRepository;
