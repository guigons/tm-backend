import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import UserPreferenceFilaTAs from '../infra/typeorm/schemas/UserPreferenceFilaTAs';
import UserPreferenceCharts from '../infra/typeorm/schemas/UserPreferenceCharts';
import UserPreferenceFilaTPs from '../infra/typeorm/schemas/UserPreferenceFilaTPs';

interface IRequest {
  user_id: string;
  filas_tas: UserPreferenceFilaTAs[];
  filas_tps: UserPreferenceFilaTPs[];
  charts: UserPreferenceCharts[];
}

@injectable()
class UpdateUserPreferenceService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserPreferencesRepository')
    private userPreferencesRepository: IUserPreferencesRepository,
  ) {}

  public async execute({
    user_id,
    filas_tas,
    filas_tps,
    charts,
  }: IRequest): Promise<void> {
    const checkUserExists = await this.usersRepository.findById(user_id);
    if (!checkUserExists) {
      throw new AppError('User does not exists');
    }

    let userPreferences = await this.userPreferencesRepository.findByUserId(
      user_id,
    );

    if (!userPreferences) {
      userPreferences = await this.userPreferencesRepository.create(user_id);
    }

    await this.userPreferencesRepository.update({
      user_id,
      filas_tas,
      filas_tps,
      charts,
    });
  }
}

export default UpdateUserPreferenceService;
