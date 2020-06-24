import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity('user_preference_fila_tps')
class UserPreferenceFilaTPs {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  filaId: number;

  @Column()
  filaName: string;
}

export default UserPreferenceFilaTPs;
