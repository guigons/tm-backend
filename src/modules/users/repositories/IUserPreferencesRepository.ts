import UserPreferences from '@modules/users/infra/typeorm/schemas/UserPreferences';
import IUpdateUserPreferencesDTO from '../dtos/IUpdateUserPreferencesDTO';

export default interface IUserPreferencesRespository {
  create(user_id: string): Promise<UserPreferences>;
  findByUserId(user_id: string): Promise<UserPreferences | undefined>;
  update(data: IUpdateUserPreferencesDTO): Promise<void>;
}
