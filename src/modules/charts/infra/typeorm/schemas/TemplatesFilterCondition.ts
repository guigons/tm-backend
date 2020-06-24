import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity('templates_filter_condition')
class TemplatesFilterCondition {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  key: string;

  @Column()
  operador: string;

  @Column()
  value: string;
}

export default TemplatesFilterCondition;
