import SigitmUsuario from '@modules/sigitm/infra/bridge/entities/SigitmUsuario';
import SigitmGrupo from '@modules/sigitm/infra/bridge/entities/SigitmGrupo';
import Stamp from '@modules/stamps/infra/typeorm/entities/Stamp';
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
import 'reflect-metadata';

export interface ICarimbo {
  codigo: string;
  descrição?: string;
  tipo?: string;
  categoria?: string;
  data: Date;
}

export default class TP {
  id: number;

  raiz: number;

  status: TPStatus;

  impacto: TPImpacto;

  atividade: TPAtividade;

  rede: TPTipoRede;

  idTipoRede: number;

  tipoPlanta: TPTipoPlanta;

  localidade: string;

  areaNome: string;

  gerencia: string;

  escritorio: string;

  projeto: string;

  tipoTrabalho: TPTipoTrabalho;

  empresa: TPEmpresa;

  descricao: string;

  executorResponsavel: string;

  executorTelefone: string;

  executorAreaEmpresa: string;

  tipoAfetacao: TPTipoAfetacao;

  motivo: TPMotivo;

  criador: SigitmUsuario;

  criadorGrupo: SigitmGrupo;

  responsavel: SigitmUsuario;

  fila: SigitmGrupo;

  dataCriacao: Date;

  dataInicioPrevisto: Date;

  dataFimPrevisto: Date;

  dataInicioPrevistoAfetacao: Date;

  dataFimPrevistoAfetacao: Date;

  dataInicioExecutada: Date;

  dataFimExecutada: Date;

  dataInicioExecutadaAfetacao: Date;

  dataFimExecutadaAfetacao: Date;

  dataRollback: Date;

  dataEncerramento: Date;

  encerrador: SigitmUsuario;

  encerradorGrupo: SigitmGrupo;

  ocorrencia: string;

  conclusao: string;

  justificativa: string;

  dadosIP: TPDadosIP;

  baixa: TPBaixa;

  ciente: TPCiente;

  historicos: TPHistorico[];

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
