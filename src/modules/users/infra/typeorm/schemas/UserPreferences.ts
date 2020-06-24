import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import UserPreferenceFilaTAs from './UserPreferenceFilaTAs';
import UserPreferenceFilaTPs from './UserPreferenceFilaTPs';
import UserPreferenceCharts from './UserPreferenceCharts';

@Entity('user_preferences')
class UserPreferences {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  user_id: string;

  @Column(() => UserPreferenceFilaTAs)
  filas_tas: UserPreferenceFilaTAs[];

  @Column(() => UserPreferenceFilaTPs)
  filas_tps: UserPreferenceFilaTPs[];

  @Column(() => UserPreferenceCharts)
  charts: UserPreferenceCharts[];
}

export default UserPreferences;
