import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import SigitmUsuario from '../SigitmUsuario';
import SigitmGrupo from '../SigitmGrupo';
import SigitmTAStatus from './SigitmTAStatus';
import SigitmTATiposRedes from './SigitmTATiposRedes';
import SigitmTADadosIP from './SigitmTADadosIP';
import SigitmTABaixa from './SigitmTABaixa';
import SigitmTAHistorico from './SigitmTAHistorico';

@Entity({ database: 'SIGITM3', name: 'TBL_TA' })
export default class SigitmTA {
  @PrimaryGeneratedColumn({ name: 'TQA_CODIGO' })
  id: number;

  @Column({ name: 'TQA_RAIZ' })
  raiz: number;

  @Column({ name: 'TQA_SEVERIDADE' })
  severidade: number;

  @Column({ name: 'TQA_LOCALIDADE_NOME' })
  regiao: string;

  @Column({ name: 'TQA_DATA_CRIACAO' })
  dataCriacao: Date;

  @Column({ name: 'TQA_DATA_ENCERRAMENTO' })
  dataEncerramento: Date;

  @Column({ name: 'TQA_TIPO_BILHETE' })
  tipoBilhete: string;

  @Column({ name: 'TQA_ALARME_TIPO' })
  alarmeTipo: string;

  @Column({ name: 'TQA_ALARME' })
  alarme: string;

  @Column({ name: 'TQA_TIPO_FALHA' })
  tipoFalha: string;

  @Column({ name: 'TQA_STATUS' })
  idStatus: number;

  @Column({ name: 'TQA_TIPO_REDE' })
  idTipoRede: number;

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'TQA_RESPONSAVELPOR_USUARIO',
    referencedColumnName: 'id',
  })
  responsavel: SigitmUsuario;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'TQA_RESPONSAVELPOR_GRUPO',
    referencedColumnName: 'id',
  })
  fila: SigitmGrupo;

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'TQA_CRIADOPOR_USUARIO',
    referencedColumnName: 'id',
  })
  criador: SigitmUsuario;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'TQA_CRIADOPOR_GRUPO',
    referencedColumnName: 'id',
  })
  grupoCriador: SigitmGrupo;

  @ManyToOne(() => SigitmTAStatus)
  @JoinColumn({
    name: 'TQA_STATUS',
    referencedColumnName: 'id',
  })
  status: SigitmTAStatus;

  @ManyToOne(() => SigitmTATiposRedes)
  @JoinColumn({
    name: 'TQA_TIPO_REDE',
    referencedColumnName: 'id',
  })
  rede: SigitmTATiposRedes;

  @ManyToOne(() => SigitmTADadosIP)
  @JoinColumn({
    name: 'TQA_CODIGO',
    referencedColumnName: 'ta_id',
  })
  dadosIP: SigitmTADadosIP;

  @ManyToOne(() => SigitmTABaixa)
  @JoinColumn({
    name: 'TQA_CODIGO',
    referencedColumnName: 'ta_id',
  })
  baixa: SigitmTABaixa;

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => SigitmTAHistorico, historico => historico.TA)
  historicos: SigitmTAHistorico[];
}
