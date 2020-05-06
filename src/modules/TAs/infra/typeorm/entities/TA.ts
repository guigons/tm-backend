import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import TAUsuario from './TAUsuario';
import TAGrupo from './TAGrupo';
import TAStatus from './TAStatus';
import TATipoRede from './TATipoRede';
import TADadosIP from './TADadosIP';
import TABaixa from './TABaixa';
import TAHistorico from './TAHistorico';

@Entity({ database: 'SIGITM3', name: 'TBL_TA' })
export default class TA {
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

  @ManyToOne(() => TAUsuario)
  @JoinColumn({
    name: 'TQA_RESPONSAVELPOR_USUARIO',
    referencedColumnName: 'id',
  })
  responsavel: TAUsuario;

  @ManyToOne(() => TAGrupo)
  @JoinColumn({
    name: 'TQA_RESPONSAVELPOR_GRUPO',
    referencedColumnName: 'id',
  })
  fila: TAGrupo;

  @ManyToOne(() => TAUsuario)
  @JoinColumn({
    name: 'TQA_CRIADOPOR_USUARIO',
    referencedColumnName: 'id',
  })
  criador: TAUsuario;

  @ManyToOne(() => TAGrupo)
  @JoinColumn({
    name: 'TQA_CRIADOPOR_GRUPO',
    referencedColumnName: 'id',
  })
  grupoCriador: TAGrupo;

  @ManyToOne(() => TAStatus)
  @JoinColumn({
    name: 'TQA_STATUS',
    referencedColumnName: 'id',
  })
  status: TAStatus;

  @ManyToOne(() => TATipoRede)
  @JoinColumn({
    name: 'TQA_TIPO_REDE',
    referencedColumnName: 'id',
  })
  rede: TATipoRede;

  @ManyToOne(() => TADadosIP)
  @JoinColumn({
    name: 'TQA_CODIGO',
    referencedColumnName: 'ta_id',
  })
  dadosIP: TADadosIP;

  @ManyToOne(() => TABaixa)
  @JoinColumn({
    name: 'TQA_CODIGO',
    referencedColumnName: 'ta_id',
  })
  baixa: TABaixa;

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => TAHistorico, historico => historico.TA)
  historicos: TAHistorico[];
}
