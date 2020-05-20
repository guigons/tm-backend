import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const cacheKey = `userProfile:${user_id}`;
    let user = await this.cacheProvider.recovery<User | undefined>(cacheKey);

    if (!user) {
      user = await this.usersRepository.findById(user_id);
      if (!user) {
        throw new AppError('User not found');
      }
      await this.cacheProvider.save({ key: cacheKey, value: user });
    }

    return user;
  }
}

export default ShowProfileService;
