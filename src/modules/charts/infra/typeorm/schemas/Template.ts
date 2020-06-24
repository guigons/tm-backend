import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import TemplatesFilter from './TemplatesFilter';

@Entity('templates')
class Template {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column('uuid')
  user_id: string;

  @Column()
  name: string;

  @Column({ default: false })
  global: boolean;

  @Column()
  target: string;

  @Column(() => TemplatesFilter)
  filters: TemplatesFilter[];
}

export default Template;
