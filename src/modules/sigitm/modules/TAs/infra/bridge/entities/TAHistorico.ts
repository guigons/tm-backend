import SigitmUsuario from '@modules/sigitm/infra/bridge/entities/SigitmUsuario';
import SigitmGrupo from '@modules/sigitm/infra/bridge/entities/SigitmGrupo';
import TA from './TA';

export default class TAHistorico {
  id: number;

  ta_id: number;

  data: Date;

  texto: string;

  usuario_id: number;

  grupo_id: number;

  usuario: SigitmUsuario;

  grupo: SigitmGrupo;

  TA: TA;
}
