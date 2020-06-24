import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import TemplatesFilterCondition from './TemplatesFilterCondition';

@Entity('templates_filter')
class TemplatesFilter {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column(() => TemplatesFilterCondition)
  conditions: TemplatesFilterCondition[];
}

export default TemplatesFilter;
