import { Entity, PrimaryGeneratedColumn } from 'typeorm';
// import SigitmUsuario from './SigitmUsuario';
// import SigitmGrupo from './SigitmGrupo';
// import SigitmTPSTPtus from './SigitmTPSTPtus';
// import SigitmTPTiposRedes from './SigitmTPTiposRedes';
// import SigitmTPDadosIP from './SigitmTPDadosIP';
// import SigitmTPBaixa from './SigitmTPBaixa';
// import SigitmTPHistorico from './SigitmTPHistorico';
// import TMTP from '../tm/TMTP';

@Entity({ database: 'SIGITM3', name: 'TBL_TP' })
export default class SigitmTP {
  @PrimaryGeneratedColumn({ name: 'TQP_CODIGO' })
  id: number;

  // @Column({ name: 'TQA_RAIZ' })
  // raiz: number;

  // @Column({ name: 'TQA_SEVERIDADE' })
  // severidade: number;

  // @Column({ name: 'TQA_LOCALIDADE_NOME' })
  // regiao: string;

  // @Column({ name: 'TQA_DATP_CRIACAO' })
  // daTPCriacao: Date;

  // @Column({ name: 'TQA_DATP_ENCERRAMENTO' })
  // daTPEncerramento: Date;

  // @Column({ name: 'TQA_TIPO_BILHETE' })
  // tipoBilhete: string;

  // @Column({ name: 'TQA_ALARME_TIPO' })
  // alarmeTipo: string;

  // @Column({ name: 'TQA_ALARME' })
  // alarme: string;

  // @Column({ name: 'TQA_TIPO_FALHA' })
  // tipoFalha: string;

  // @ManyToOne(() => SigitmUsuario)
  // @JoinColumn({
  //   name: 'TQA_RESPONSAVELPOR_USUARIO',
  //   referencedColumnName: 'id',
  // })
  // responsavel: SigitmUsuario;

  // @ManyToOne(() => SigitmGrupo)
  // @JoinColumn({
  //   name: 'TQA_RESPONSAVELPOR_GRUPO',
  //   referencedColumnName: 'id',
  // })
  // fila: SigitmGrupo;

  // @ManyToOne(() => SigitmUsuario)
  // @JoinColumn({
  //   name: 'TQA_CRIADOPOR_USUARIO',
  //   referencedColumnName: 'id',
  // })
  // criador: SigitmUsuario;

  // @ManyToOne(() => SigitmGrupo)
  // @JoinColumn({
  //   name: 'TQA_CRIADOPOR_GRUPO',
  //   referencedColumnName: 'id',
  // })
  // grupoCriador: SigitmGrupo;

  // @ManyToOne(() => SigitmTPSTPtus)
  // @JoinColumn({
  //   name: 'TQA_STPTUS',
  //   referencedColumnName: 'id',
  // })
  // sTPtus: SigitmTPSTPtus;

  // @ManyToOne(() => SigitmTPTiposRedes)
  // @JoinColumn({
  //   name: 'TQA_TIPO_REDE',
  //   referencedColumnName: 'id',
  // })
  // rede: SigitmTPTiposRedes;

  // @ManyToOne(() => SigitmTPDadosIP)
  // @JoinColumn({
  //   name: 'TQA_CODIGO',
  //   referencedColumnName: 'TP_id',
  // })
  // dadosIP: SigitmTPDadosIP;

  // @ManyToOne(() => SigitmTPBaixa)
  // @JoinColumn({
  //   name: 'TQA_CODIGO',
  //   referencedColumnName: 'TP_id',
  // })
  // baixa: SigitmTPBaixa;

  // @OneToMany(() => SigitmTPHistorico, historico => historico.TP)
  // historicos: SigitmTPHistorico[];

  // transformTMTP(): TMTP {
  //   return {
  //     id: this.id,
  //     raiz: this.raiz,
  //     severidade: this.severidade,
  //     regiao: this.regiao,
  //     daTPCriacao: this.daTPCriacao,
  //     daTPEncerramento: this.daTPEncerramento,
  //     tipoBilhete: this.tipoBilhete,
  //     alarmeTipo: this.alarmeTipo,
  //     alarme: this.alarme,
  //     tipoFalha: this.tipoFalha,
  //     responsavel: this.responsavel?.nome,
  //     fila: this.fila?.nome,
  //     criador: this.criador?.nome,
  //     grupoCriador: this.grupoCriador?.nome,
  //     sTPtus: this.sTPtus?.nome,
  //     rede: this.rede?.nome,
  //     tipoRede: this.rede?.tipo?.nome,
  //     equipamentoHostname: this.dadosIP?.hostname,
  //     equipamentoFabricante: this.dadosIP?.fabricante,
  //     baixaDefeito: this.baixa?.defeito,
  //     baixaCausa: this.baixa?.causa,
  //     baixaComponente: this.baixa?.componente,
  //     baixaGrupo: this.baixa?.grupo,
  //     baixaReparo: this.baixa?.reparo,
  //     historicos: this.historicos?.map(historico =>
  //       historico.transformTMTPHistorico(),
  //     ),
  //   };
  // }
}
