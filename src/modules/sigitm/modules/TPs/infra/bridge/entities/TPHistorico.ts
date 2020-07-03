import SigitmUsuario from '@modules/sigitm/infra/bridge/entities/SigitmUsuario';
import SigitmGrupo from '@modules/sigitm/infra/bridge/entities/SigitmGrupo';
import TP from './TP';

export default class TPHistorico {
  id: number;

  ta_id: number;

  data: Date;

  texto: string;

  usuario_id: number;

  grupo_id: number;

  usuario: SigitmUsuario;

  grupo: SigitmGrupo;

  TP: TP;
}
