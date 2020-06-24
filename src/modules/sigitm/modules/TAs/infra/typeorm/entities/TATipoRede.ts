import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import TATipo from './TATipo';

@Entity({ database: 'SIGITM3', name: 'TBC_TIPOS_REDE_TA' })
export default class TATiposRede {
  @PrimaryGeneratedColumn({ name: 'TPJ_CODIGO' })
  id: number;

  @Column({ name: 'TPJ_NOME' })
  nome: string;

  @ManyToOne(() => TATipo)
  @JoinColumn({
    name: 'TPJ_TIPO_TA',
    referencedColumnName: 'id',
  })
  tipo: TATipo;
}
