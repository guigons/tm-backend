import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity('user_preference_fila_tas')
class UserPreferenceFilaTAs {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  filaId: number;

  @Column()
  filaName: string;
}

export default UserPreferenceFilaTAs;
