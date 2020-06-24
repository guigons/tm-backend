import AppError from '@shared/errors/AppError';
import { getMongoRepository, MongoRepository } from 'typeorm';
import UserPreferences from '@modules/users/infra/typeorm/schemas/UserPreferences';
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import IUpdateUserPreferencesDTO from '@modules/users/dtos/IUpdateUserPreferencesDTO';

class UserPreferencesReposistory implements IUserPreferencesRepository {
  private ormRepository: MongoRepository<UserPreferences>;

  constructor() {
    this.ormRepository = getMongoRepository(UserPreferences, 'tm-mongo');
  }

  public async create(user_id: string): Promise<UserPreferences> {
    const userPreferences = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userPreferences);

    return userPreferences;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<UserPreferences | undefined> {
    const userPreferences = await this.ormRepository.findOne({ user_id });

    return userPreferences;
  }

  public async update({
    user_id,
    filas_tas,
    filas_tps,
    charts,
  }: IUpdateUserPreferencesDTO): Promise<void> {
    const userPreferences = await this.ormRepository.findOne({ user_id });
    if (!userPreferences) {
      throw new AppError('User Preferences does not found!');
    }
    await this.ormRepository.updateOne(
      { user_id },
      { $set: { filas_tas, filas_tps, charts } },
      { upsert: true },
    );
  }
}

export default UserPreferencesReposistory;
