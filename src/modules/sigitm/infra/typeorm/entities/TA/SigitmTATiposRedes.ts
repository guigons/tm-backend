import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import SigitmTATipos from './SigitmTATipos';

@Entity({ database: 'SIGITM3', name: 'TBC_TIPOS_REDE_TA' })
export default class SigitmTATiposDeRede {
  @PrimaryGeneratedColumn({ name: 'TPJ_CODIGO' })
  id: number;

  @Column({ name: 'TPJ_NOME' })
  nome: string;

  @ManyToOne(() => SigitmTATipos)
  @JoinColumn({
    name: 'TPJ_TIPO_TA',
    referencedColumnName: 'id',
  })
  tipo: SigitmTATipos;
}
