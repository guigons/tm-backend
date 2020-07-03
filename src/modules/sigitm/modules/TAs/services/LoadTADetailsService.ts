import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import TA from '../infra/bridge/entities/TA';
import ITAsRepository from '../repositories/ITAsRepository';

interface IRequest {
  id: number;
}

interface IResponse {
  ta: TA | undefined;
}

@injectable()
export default class LoadTADetailsService {
  constructor(
    @inject('TAsRepository')
    private TAsRepository: ITAsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<IResponse> {
    const ta = await this.TAsRepository.findById(id);
    return { ta };
  }
}
