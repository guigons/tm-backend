import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import SigitmUsuario from '@modules/sigitm/infra/typeorm/entities/SigitmUsuario';
import SigitmGrupo from '@modules/sigitm/infra/typeorm/entities/SigitmGrupo';
import TP from './TP';

@Entity({ database: 'SIGITM3', name: 'TBL_HISTORICOS_TP' })
export default class TPHistorico {
  @PrimaryGeneratedColumn({ name: 'HTP_CODIGO' })
  id: number;

  @Column({ name: 'HTP_TP' })
  ta_id: number;

  @Column({ name: 'HTP_DATA' })
  data: Date;

  @Column({ name: 'HTP_TEXTO' })
  texto: string;

  @Column({ name: 'HTP_USUARIO' })
  usuario_id: number;

  @Column({ name: 'HTP_GRUPO' })
  grupo_id: number;

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'HTP_USUARIO',
    referencedColumnName: 'id',
  })
  usuario: SigitmUsuario;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'HTP_GRUPO',
    referencedColumnName: 'id',
  })
  grupo: SigitmGrupo;

  @ManyToOne(() => TP, tp => tp.historicos)
  @JoinColumn({
    name: 'HTP_TP',
    referencedColumnName: 'id',
  })
  TP: TP;
}
