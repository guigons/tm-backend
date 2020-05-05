import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkIserExists = await this.usersRepository.findByEmail(email);

    if (checkIserExists) {
      throw new AppError('E-mail address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
