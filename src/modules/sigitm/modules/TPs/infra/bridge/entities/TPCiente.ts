import SigitmGrupo from '@modules/sigitm/infra/bridge/entities/SigitmGrupo';
import SigitmUsuario from '@modules/sigitm/infra/bridge/entities/SigitmUsuario';

export default class TPCiente {
  id: number;

  tp_id: number;

  data: Date;

  grupo: SigitmGrupo;

  usuario: SigitmUsuario;
}
