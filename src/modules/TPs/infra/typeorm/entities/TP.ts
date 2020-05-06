import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import TPStatus from './TPStatus';
import TPImpacto from './TPImpacto';
import TPAtividade from './TPAtividade';
import TPTipoRede from './TPTipoRede';
import TPTipoPlanta from './TPTipoPlanta';
import TPTipoTrabalho from './TPTipoTrabalho';
import TPEmpresa from './TPEmpresa';
import TPTipoAfetacao from './TPTipoAfetacao';
import TPMotivo from './TPMotivo';
import TPUsuario from './TPUsuario';
import TPGrupo from './TPGrupo';
import TPHistorico from './TPHistorico';
import TPDadosIP from './TPDadosIP';
import TPBaixa from './TPBaixa';

@Entity({ database: 'SIGITM3', name: 'TBL_TP' })
export default class TP {
  @PrimaryGeneratedColumn({ name: 'TQP_CODIGO' })
  id: number;

  @Column({ name: 'TQP_RAIZ' })
  raiz: number;

  @ManyToOne(() => TPStatus)
  @JoinColumn({
    name: 'TQP_STATUS',
    referencedColumnName: 'id',
  })
  status: TPStatus;

  @ManyToOne(() => TPImpacto)
  @JoinColumn({
    name: 'TQP_IMPACTO',
    referencedColumnName: 'id',
  })
  impacto: TPImpacto;

  @ManyToOne(() => TPAtividade)
  @JoinColumn({
    name: 'TQP_ATIVIDADE',
    referencedColumnName: 'id',
  })
  atividade: TPAtividade;

  @ManyToOne(() => TPTipoRede)
  @JoinColumn({
    name: 'TQP_TIPO_REDE',
    referencedColumnName: 'id',
  })
  rede: TPTipoRede;

  @ManyToOne(() => TPTipoPlanta)
  @JoinColumn({
    name: 'TQP_TIPO_PLANTA',
    referencedColumnName: 'id',
  })
  tipoPlanta: TPTipoPlanta;

  @Column({ name: 'TQP_LOCALIDADE_NOME' })
  localidade: string;

  @Column({ name: 'TQP_AREA_NOME' })
  areaNome: string;

  @Column({ name: 'TQP_GERENCIA_NOME' })
  gerencia: string;

  @Column({ name: 'TQP_ESCRITORIO_NOME' })
  escritorio: string;

  @Column({ name: 'TQP_PROJETO' })
  projeto: string;

  @ManyToOne(() => TPTipoTrabalho)
  @JoinColumn({
    name: 'TQP_TIPO_TRABALHO',
    referencedColumnName: 'id',
  })
  tipoTrabalho: TPTipoTrabalho;

  @ManyToOne(() => TPEmpresa)
  @JoinColumn({
    name: 'TQP_EMPRESA',
    referencedColumnName: 'id',
  })
  empresa: TPEmpresa;

  @Column({ name: 'TQP_DESCRICAO' })
  descricao: string;

  @Column({ name: 'TQP_EXEC_RESPONSAVEL' })
  executorResponsavel: string;

  @Column({ name: 'TQP_EXEC_TELEFONE' })
  executorTelefone: string;

  @Column({ name: 'TQP_EXEC_AREA_EMPRESA' })
  executorAreaEmpresa: string;

  @ManyToOne(() => TPTipoAfetacao)
  @JoinColumn({
    name: 'TQP_TIPO_AFETACAO',
    referencedColumnName: 'id',
  })
  tipoAfetacao: TPTipoAfetacao;

  @ManyToOne(() => TPMotivo)
  @JoinColumn({
    name: 'TQP_MOTIVO',
    referencedColumnName: 'id',
  })
  motivo: TPMotivo;

  @ManyToOne(() => TPUsuario)
  @JoinColumn({
    name: 'TQP_CRIADOPOR_USUARIO',
    referencedColumnName: 'id',
  })
  criador: TPUsuario;

  @ManyToOne(() => TPGrupo)
  @JoinColumn({
    name: 'TQP_CRIADOPOR_GRUPO',
    referencedColumnName: 'id',
  })
  criadorGrupo: TPGrupo;

  @ManyToOne(() => TPUsuario)
  @JoinColumn({
    name: 'TQP_RESPONSAVELPOR_USUARIO',
    referencedColumnName: 'id',
  })
  responsavel: TPUsuario;

  @ManyToOne(() => TPGrupo)
  @JoinColumn({
    name: 'TQP_RESPONSAVELPOR_GRUPO',
    referencedColumnName: 'id',
  })
  responsavelGrupo: TPGrupo;

  @Column({ name: 'TQP_DATA_CRIACAO' })
  dataCriacao: Date;

  @Column({ name: 'TQP_DATA_PREV_INICIO' })
  dataInicioPrevisto: Date;

  @Column({ name: 'TQP_DATA_PREV_FIM' })
  dataFimPrevisto: Date;

  @Column({ name: 'TQP_DATA_PREV_AFET_INICIO' })
  dataInicioPrevistoAfetacao: Date;

  @Column({ name: 'TQP_DATA_PREV_AFET_FIM' })
  dataFimPrevistoAfetacao: Date;

  @Column({ name: 'TQP_DATA_EXEC_INICIO' })
  dataInicioExecutada: Date;

  @Column({ name: 'TQP_DATA_EXEC_FIM' })
  dataFimExecutada: Date;

  @Column({ name: 'TQP_DATA_EXEC_AFET_INICIO' })
  dataInicioExecutadaAfetacao: Date;

  @Column({ name: 'TQP_DATA_EXEC_AFET_FIM' })
  dataFimExecutadaAfetacao: Date;

  @Column({ name: 'TQP_DATA_ROLLBACK' })
  dataRollback: Date;

  @Column({ name: 'TQP_DATA_ENCERRAMENTO' })
  dataEncerramento: Date;

  @ManyToOne(() => TPUsuario)
  @JoinColumn({
    name: 'TQP_ENCERRADOPOR_USUARIO',
    referencedColumnName: 'id',
  })
  encerrador: TPUsuario;

  @ManyToOne(() => TPGrupo)
  @JoinColumn({
    name: 'TQP_ENCERRADOPOR_GRUPO',
    referencedColumnName: 'id',
  })
  encerradorGrupo: TPGrupo;

  @Column({ name: 'TQP_OCORRENCIA' })
  ocorrencia: string;

  @Column({ name: 'TQP_CONCLUSAO' })
  conclusao: string;

  @Column({ name: 'TQP_JUSTIFICATIVA' })
  justificativa: string;

  @ManyToOne(() => TPDadosIP)
  @JoinColumn({
    name: 'TQP_CODIGO',
    referencedColumnName: 'tp_id',
  })
  dadosIP: TPDadosIP;

  @ManyToOne(() => TPBaixa)
  @JoinColumn({
    name: 'TQP_CODIGO',
    referencedColumnName: 'tp_id',
  })
  baixa: TPBaixa;

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => TPHistorico, historico => historico.TP)
  historicos: TPHistorico[];
}
