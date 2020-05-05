import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import SigitmTA from './SigitmTA';
import SigitmUsuario from '../SigitmUsuario';
import SigitmGrupo from '../SigitmGrupo';

@Entity({ database: 'SIGITM3', name: 'TBL_HISTORICOS_TA' })
export default class SigitmTAHistorico {
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

  @ManyToOne(() => SigitmTA, TA => TA.historicos)
  @JoinColumn({
    name: 'HTA_TP',
    referencedColumnName: 'id',
  })
  TA: SigitmTA;
}
