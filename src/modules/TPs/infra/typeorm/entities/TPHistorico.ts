import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import TP from './TP';
import TPUsuario from './TPUsuario';
import TPGrupo from './TPGrupo';

@Entity({ database: 'SIGITM3', name: 'TBL_HISTORICOS_TP' })
export default class TAHistorico {
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

  @ManyToOne(() => TPUsuario)
  @JoinColumn({
    name: 'HTP_USUARIO',
    referencedColumnName: 'id',
  })
  usuario: TPUsuario;

  @ManyToOne(() => TPGrupo)
  @JoinColumn({
    name: 'HTP_GRUPO',
    referencedColumnName: 'id',
  })
  grupo: TPGrupo;

  @ManyToOne(() => TP, tp => tp.historicos)
  @JoinColumn({
    name: 'HTP_TP',
    referencedColumnName: 'id',
  })
  TP: TP;
}
