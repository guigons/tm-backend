import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import TA from './TA';
import TAUsuario from './TAUsuario';
import TAGrupo from './TAGrupo';

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

  @ManyToOne(() => TAUsuario)
  @JoinColumn({
    name: 'HTA_USUARIO',
    referencedColumnName: 'id',
  })
  usuario: TAUsuario;

  @ManyToOne(() => TAGrupo)
  @JoinColumn({
    name: 'HTA_GRUPO',
    referencedColumnName: 'id',
  })
  grupo: TAGrupo;

  @ManyToOne(() => TA, ta => ta.historicos)
  @JoinColumn({
    name: 'HTA_TP',
    referencedColumnName: 'id',
  })
  TA: TA;
}
