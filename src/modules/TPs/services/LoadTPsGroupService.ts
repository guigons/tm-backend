import TP from '@modules/TPs/infra/typeorm/entities/TP';
import ITPsRepository from '@modules/TPs/repositories/ITPsRepository';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';

interface ITPGroupItem {
  status: string;
  count: number;
  ids: number[];
}

interface ITPGroup {
  grupoResponsavel: string;
  data: ITPGroupItem[] | [];
  total: number;
}

interface ITPGroupArray {
  [key: string]: {
    [key: string]: TP[];
  };
}

interface IResponse {
  group: ITPGroup[];
}

@injectable()
export default class LoadTPsGroupService {
  constructor(
    @inject('TPsRepository')
    private TPsRepository: ITPsRepository,
  ) {}

  public async execute(): Promise<any> {
    const status = [
      'Pendente Permissão',
      'Pendente O&M',
      'Pendente GMUD',
      'Pré-aprovado',
      'Levantamento Campo',
      'Levantamento Supervisão',
      'Autorizado',
      'Em Execução',
      'Fora do Prazo',
      'Pré-baixa',
      'Cancelado',
      'Fechado',
      'Não Executado',
    ];

    const tps = await this.TPsRepository.findByDateAndTipoRede({
      daysBefore: 7,
      tipoRede1: 304,
      tipoRede2: 305,
    });

    const tpsGroup: ITPGroupArray = groupArray(
      tps,
      'responsavelGrupo.nome',
      'status.nome',
    ) as ITPGroupArray;

    const group: ITPGroup[] = Object.keys(tpsGroup).map(
      (grupoResponsavel: string) => {
        return {
          grupoResponsavel,
          data: status.map(s => ({
            status: s,
            count: tpsGroup[grupoResponsavel][s]
              ? tpsGroup[grupoResponsavel][s].length
              : 0,
            ids: tpsGroup[grupoResponsavel][s]
              ? tpsGroup[grupoResponsavel][s].map(tp => tp.id)
              : [],
          })),
          total: status.reduce((total, s) => {
            // eslint-disable-next-line no-param-reassign
            total += tpsGroup[grupoResponsavel][s]
              ? tpsGroup[grupoResponsavel][s].length
              : 0;
            return total;
          }, 0),
        };
      },
    );

    return { group };
  }
}
