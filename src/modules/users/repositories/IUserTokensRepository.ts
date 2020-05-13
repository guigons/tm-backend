import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default interface IUsersRespository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
