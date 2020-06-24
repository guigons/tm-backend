import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import SigitmUsuario from '@modules/sigitm/infra/typeorm/entities/SigitmUsuario';
import SigitmGrupo from '@modules/sigitm/infra/typeorm/entities/SigitmGrupo';
import TA from './TA';

@Entity({ database: 'SIGITM3', name: 'TBL_HISTORICOS_TA' })
export default class TAHistorico {
  @PrimaryGeneratedColumn({ name: 'HTA_CODIGO' })
  id: number;

  @Column({ name: 'HTA_TP' })
  ta_id: number;

  @Column({ name: 'HTA_DATA' })
  data: Date;

  @Column({ name: 'HTA_TEXTO' })
  texto: string;

  @Column({ name: 'HTA_USUARIO' })
  usuario_id: number;

  @Column({ name: 'HTA_GRUPO' })
  grupo_id: number;

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'HTA_USUARIO',
    referencedColumnName: 'id',
  })
  usuario: SigitmUsuario;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'HTA_GRUPO',
    referencedColumnName: 'id',
  })
  grupo: SigitmGrupo;

  @ManyToOne(() => TA, ta => ta.historicos)
  @JoinColumn({
    name: 'HTA_TP',
    referencedColumnName: 'id',
  })
  TA: TA;
}
