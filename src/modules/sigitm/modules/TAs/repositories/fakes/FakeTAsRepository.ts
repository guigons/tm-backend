import ILoadTAsGroupDTO from '../../dtos/ILoadTAsGroupDTO';
import TA from '../../infra/typeorm/entities/TA';
import ITAsRepository from '../ITAsRepository';

class FakeTAsRepository implements ITAsRepository {
  private tas: TA[] = [
    {
      id: 123,
      alarme: 'Alarme',
      raiz: 111,
      severidade: 1,
      regiao: 'Região',
      dataCriacao: new Date(),
      dataEncerramento: new Date(),
      status: { id: 10, nome: 'Aberto' },
      tipoBilhete: 'Tipo Bilhete',
      alarmeTipo: 'Alarme Tipo',
      tipoFalha: 'Tipo Falha',
      criador: { id: 1, nome: 'Criador' },
      dadosIP: {
        id: 1,
        ta_id: 123,
        fabricante: 'Fabricante',
        hostname: 'Hostname',
      },
      fila: { id: 1, nome: 'Fila' },
      grupoCriador: { id: 1, nome: 'GrupoCriador' },
      historicos: [],
      idStatus: 10,
      idTipoRede: 304,
      rede: { id: 1, nome: 'Rede', tipo: { id: 304, nome: 'TipoRede' } },
      responsavel: { id: 1, nome: 'Responsavel Grupo' },
      baixa: {
        id: 111,
        ta_id: 123,
        causa: 'Causa',
        componente: 'Componente',
        data: new Date(),
        defeito: 'Defeito',
        grupo: 'Grupo',
        reparo: 'Reparo',
      },
    },
  ];

  public async findByStatusAndTipoRede({
    status1,
    status2,
    tipoRede1,
    tipoRede2,
  }: ILoadTAsGroupDTO): Promise<TA[]> {
    const tas = this.tas.filter(ta => {
      if (
        ((ta.status.id === status1 || ta.status.id === status2) &&
          ta.idTipoRede === tipoRede1) ||
        ta.idTipoRede === tipoRede2
      ) {
        return true;
      }
      return false;
    });
    return tas;
  }

  public async findByIds(ids: number[]): Promise<TA[]> {
    const tas = this.tas.filter(ta => ids.includes(ta.id));
    return tas;
  }

  public async findById(id: number): Promise<TA | undefined> {
    const ta = this.tas.find(t => t.id === id);
    return ta;
  }
}

export default FakeTAsRepository;
