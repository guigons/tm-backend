import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import StampTypeCategory from './StampTypeCategory';

@Entity('stamp_types')
class StampType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => StampTypeCategory,
    stampTypeCategory => stampTypeCategory.type,
  )
  categories: StampTypeCategory[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default StampType;
