import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import SigitmGrupo from '@modules/sigitm/infra/typeorm/entities/SigitmGrupo';
import SigitmUsuario from '@modules/sigitm/infra/typeorm/entities/SigitmUsuario';

@Entity({ database: 'SIGITM3', name: 'TBL_TP_CIENTES' })
export default class TPCiente {
  @PrimaryGeneratedColumn({ name: 'TCI_CODIGO' })
  id: number;

  @Column({ name: 'TCI_TP' })
  tp_id: number;

  @Column({ name: 'TCI_CIENTE_DATA' })
  data: Date;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'TCI_GRUPO',
    referencedColumnName: 'id',
  })
  grupo: SigitmGrupo;

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'TCI_USUARIO',
    referencedColumnName: 'id',
  })
  usuario: SigitmUsuario;
}
