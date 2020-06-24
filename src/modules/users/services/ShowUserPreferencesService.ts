import { ObjectID } from 'mongodb';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import UserPreferences from '../infra/typeorm/schemas/UserPreferences';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowUserPreferencesService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserPreferencesRepository')
    private userPreferencesRepository: IUserPreferencesRepository,
  ) {}

  public async execute({
    user_id,
  }: IRequest): Promise<UserPreferences | undefined> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User does not exists');
    }

    let userPreferences = await this.userPreferencesRepository.findByUserId(
      user_id,
    );

    if (!userPreferences) {
      userPreferences = new UserPreferences();
      userPreferences._id = new ObjectID();
      userPreferences.user_id = user.id;
    }

    if (!userPreferences.filas_tas) userPreferences.filas_tas = [];
    if (!userPreferences.filas_tps) userPreferences.filas_tps = [];
    if (!userPreferences.charts) userPreferences.charts = [];

    return userPreferences;
  }
}

export default ShowUserPreferencesService;
