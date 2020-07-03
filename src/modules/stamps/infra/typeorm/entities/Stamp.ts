import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import StampType from './StampType';
import StampTypeCategory from './StampTypeCategory';

@Entity('stamps')
class Stamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cod: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  type_id: string;

  @Column()
  category_id: string;

  @ManyToOne(() => StampType)
  @JoinColumn({
    name: 'type_id',
    referencedColumnName: 'id',
  })
  type: StampType;

  @ManyToOne(() => StampTypeCategory)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category: StampTypeCategory;
}

export default Stamp;
