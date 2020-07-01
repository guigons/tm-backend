import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import SigitmUsuario from '@modules/sigitm/infra/typeorm/entities/SigitmUsuario';
import SigitmGrupo from '@modules/sigitm/infra/typeorm/entities/SigitmGrupo';
import { Expose } from 'class-transformer';
import TPStatus from './TPStatus';
import TPImpacto from './TPImpacto';
import TPAtividade from './TPAtividade';
import TPTipoRede from './TPTipoRede';
import TPTipoPlanta from './TPTipoPlanta';
import TPTipoTrabalho from './TPTipoTrabalho';
import TPEmpresa from './TPEmpresa';
import TPTipoAfetacao from './TPTipoAfetacao';
import TPMotivo from './TPMotivo';
import TPHistorico from './TPHistorico';
import TPDadosIP from './TPDadosIP';
import TPBaixa from './TPBaixa';
import TPCiente from './TPCiente';
import Stamp from '../../../../stamps/infra/typeorm/entities/Stamp';

export interface ICarimbo {
  codigo: string;
  descrição?: string;
  tipo?: string;
  categoria?: string;
  data: Date;
}

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

  @Column({ name: 'TQP_TIPO_REDE' })
  idTipoRede: number;

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

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'TQP_CRIADOPOR_USUARIO',
    referencedColumnName: 'id',
  })
  criador: SigitmUsuario;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'TQP_CRIADOPOR_GRUPO',
    referencedColumnName: 'id',
  })
  criadorGrupo: SigitmGrupo;

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'TQP_RESPONSAVELPOR_USUARIO',
    referencedColumnName: 'id',
  })
  responsavel: SigitmUsuario;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'TQP_RESPONSAVELPOR_GRUPO',
    referencedColumnName: 'id',
  })
  fila: SigitmGrupo;

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

  @ManyToOne(() => SigitmUsuario)
  @JoinColumn({
    name: 'TQP_ENCERRADOPOR_USUARIO',
    referencedColumnName: 'id',
  })
  encerrador: SigitmUsuario;

  @ManyToOne(() => SigitmGrupo)
  @JoinColumn({
    name: 'TQP_ENCERRADOPOR_GRUPO',
    referencedColumnName: 'id',
  })
  encerradorGrupo: SigitmGrupo;

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

  @ManyToOne(() => TPCiente)
  @JoinColumn({
    name: 'TQP_CODIGO',
    referencedColumnName: 'tp_id',
  })
  ciente: TPCiente;

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => TPHistorico, historico => historico.TP)
  historicos: TPHistorico[];

  @Expose({ name: 'carimbos' })
  getCarimbos(): ICarimbo[] {
    const historicoCarimbos = this.historicos.filter(history =>
      history.texto.match(/^(DE_|CA_|PB_)[0-9][0-9] /),
    );

    const carimbos: ICarimbo[] = historicoCarimbos.map(hd => {
      const extract = hd.texto.match(
        /^((DE_|CA_|PB_)[0-9][0-9])\s+(.*?)(\n|$)/,
      );
      const codigo = extract ? extract[1] : '';

      return {
        codigo,
        data: hd.data,
      };
    });

    return carimbos;
  }

  carimbos: ICarimbo[];

  setCarimbosDetails(stamps: Stamp[]): void {
    this.carimbos = this.carimbos.map(carimbo => {
      const stamp = stamps.find(s => s.cod === carimbo.codigo);
      const tipo = stamp?.type.name;
      const categoria = stamp?.category.name;
      const descrição = stamp?.description;
      return {
        ...carimbo,
        tipo,
        categoria,
        descrição,
      };
    });
    if (this.baixa && !this.baixa.carimbo) {
      this.baixa.carimbo = {
        codigo: 'Não preenchido',
        data: this.baixa.data,
        tipo: 'Pré-Baixa',
        categoria: 'Não preenchido',
        descrição: 'Não preenchido',
      };
    }
    if (this.baixa) {
      const stampBaixa = stamps.find(
        s => this.baixa.carimbo && s.cod === this.baixa.carimbo.codigo,
      );
      this.baixa.carimbo = {
        ...this.baixa.carimbo,
        tipo: stampBaixa ? stampBaixa.type.name : 'Pré-Baixa',
        categoria: stampBaixa ? stampBaixa.category.name : 'Não Classificado',
        descrição: stampBaixa ? stampBaixa.description : 'Não Classificado',
      };
    }
  }
}
