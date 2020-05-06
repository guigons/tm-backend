import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import TPTipo from './TPTipo';

@Entity({ database: 'SIGITM3', name: 'TBC_TIPOS_REDE_TP' })
export default class TPTiposRede {
  @PrimaryGeneratedColumn({ name: 'TPD_CODIGO' })
  id: number;

  @Column({ name: 'TPD_NOME' })
  nome: string;

  @ManyToOne(() => TPTipo)
  @JoinColumn({
    name: 'TPD_TIPO_TP',
    referencedColumnName: 'id',
  })
  tipo: TPTipo;
}
