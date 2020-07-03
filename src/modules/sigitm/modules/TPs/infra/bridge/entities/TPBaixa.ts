import { ICarimbo } from './TP';

export default class TPBaixa {
  id: number;

  tp_id: number;

  data: Date;

  descricao: string;

  incidencia: string;

  rollback: string;

  prazo: string;

  impacto: string;

  carimbo: ICarimbo;
}
