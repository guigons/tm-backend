import SigitmUsuario from '@modules/sigitm/infra/bridge/entities/SigitmUsuario';
import SigitmGrupo from '@modules/sigitm/infra/bridge/entities/SigitmGrupo';
import TAStatus from './TAStatus';
import TATipoRede from './TATipoRede';
import TADadosIP from './TADadosIP';
import TABaixa from './TABaixa';
import TAHistorico from './TAHistorico';

export default class TA {
  id: number;

  raiz: number;

  severidade: number;

  regiao: string;

  dataCriacao: Date;

  dataEncerramento: Date;

  tipoBilhete: string;

  alarmeTipo: string;

  alarme: string;

  tipoFalha: string;

  idStatus: number;

  idTipoRede: number;

  responsavel: SigitmUsuario;

  fila: SigitmGrupo;

  criador: SigitmUsuario;

  grupoCriador: SigitmGrupo;

  status: TAStatus;

  rede: TATipoRede;

  dadosIP: TADadosIP;

  baixa: TABaixa;

  historicos: TAHistorico[];

  tagTime: string;

  afetacao: {
    isAfetacaoParcial: boolean;
    afetacoesParciais: {
      id: number;
      data: Date;
      transmissao: number;
      voz: number;
      deterministica: number;
      speedy: number;
      cliente: number;
      cp: number;
      rede_ip: number;
      interconexao: number;
      sppac: number;
      dth: number;
      fttx: number;
      iptv: number;
      erb: number;
      grupo: {
        id: number;
        nome: string;
      };
      usuario: {
        id: number;
        nome: string;
      };
    }[];
  };
}
