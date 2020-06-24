import { subDays, isAfter } from 'date-fns';
import TP from '../../infra/typeorm/entities/TP';
import ITPsRepository from '../ITPsRepository';
import ILoadTPsGroupDTO from '../../dtos/ILoadTPsGroupDTO';

class FakeTPsRepository implements ITPsRepository {
  private tps: TP[] = [
    {
      id: 123,
      idTipoRede: 304,
      raiz: 111,
      rede: { id: 304, nome: 'Rede', tipo: { id: 304, nome: 'Tipo Rede' } },
      responsavel: { id: 1, nome: 'Responsavel' },
      status: { id: 1, nome: 'Não Executado' },
      areaNome: 'Area Nome',
      atividade: { id: 1, nome: 'Atividade' },
      conclusao: 'Conclusão',
      criadorGrupo: { id: 1, nome: 'Criador Grupo' },
      dadosIP: {
        id: 1,
        tp_id: 123,
        fabricante: 'Fabricante',
        hostname: 'Hostname',
      },
      dataFimExecutada: new Date(),
      dataFimExecutadaAfetacao: new Date(),
      dataFimPrevisto: new Date(),
      dataFimPrevistoAfetacao: new Date(),
      dataInicioExecutada: new Date(),
      dataInicioExecutadaAfetacao: new Date(),
      dataInicioPrevisto: new Date(),
      dataInicioPrevistoAfetacao: new Date(),
      dataRollback: new Date(),
      descricao: 'Descrição',
      empresa: { id: 1, nome: 'Empresa' },
      encerrador: { id: 1, nome: 'Encerrador' },
      encerradorGrupo: { id: 1, nome: 'Encerrador Grupo' },
      escritorio: 'Escritorio',
      executorAreaEmpresa: 'Executor Area Empresa',
      executorResponsavel: 'Executor Responsavel',
      executorTelefone: 'Executor Telefone',
      gerencia: 'Gerencia',
      impacto: { id: 1, nome: 'Impacto' },
      justificativa: 'Justificativa',
      localidade: 'Localidade',
      motivo: { id: 1, nome: 'Motivo' },
      ocorrencia: 'Ocorrencia',
      projeto: 'Projeto',
      fila: { id: 1, nome: 'Responsavel Grupo' },
      tipoAfetacao: { id: 1, nome: 'Tipo Afetaçao' },
      tipoPlanta: { id: 1, nome: 'Tipo Planta' },
      tipoTrabalho: { id: 1, nome: 'Tipo Trabalho' },
      criador: { id: 1, nome: 'Criador' },
      dataCriacao: new Date(),
      dataEncerramento: new Date(),
      historicos: [],
      baixa: {
        id: 111,
        tp_id: 123,
        data: new Date(),
        descricao: 'Descricao',
        impacto: 'Impacto',
        incidencia: 'Incidencia',
        prazo: 'Prazo',
        rollback: 'Rollback',
      },
    },
  ];

  public async findByDateAndTipoRede({
    daysBefore,
    tipoRede1,
    tipoRede2,
  }: ILoadTPsGroupDTO): Promise<TP[]> {
    const tps = this.tps.filter(tp => {
      if (
        (isAfter(tp.dataCriacao, subDays(new Date(), daysBefore)) &&
          tp.idTipoRede === tipoRede1) ||
        tp.idTipoRede === tipoRede2
      ) {
        return true;
      }
      return false;
    });
    return tps;
  }

  public async findByIds(ids: number[]): Promise<TP[]> {
    const tps = this.tps.filter(tp => ids.includes(tp.id));
    return tps;
  }

  public async findById(id: number): Promise<TP | undefined> {
    const tp = this.tps.find(t => t.id === id);
    return tp;
  }
}

export default FakeTPsRepository;
