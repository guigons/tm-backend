import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity('user_preference_charts')
class UserPreferenceFilaTAs {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  template_id: ObjectID;

  @Column()
  name: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  horizontal: string;

  @Column()
  stacked: boolean;

  @Column({ default: 'line' })
  type: string;

  @Column()
  groupBy: string;
}

export default UserPreferenceFilaTAs;
