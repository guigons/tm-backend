import Stamp from '@modules/stamps/infra/typeorm/entities/Stamp';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import StampType from './StampType';

@Entity('stamp_type_categories')
class StampCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type_id: string;

  @ManyToOne(() => StampType, stampType => stampType.categories)
  @JoinColumn({
    name: 'type_id',
    referencedColumnName: 'id',
  })
  type: StampType;

  @OneToMany(() => Stamp, stamp => stamp.category)
  stamps: Stamp[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default StampCategory;
