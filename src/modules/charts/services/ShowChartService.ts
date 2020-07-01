import AppError from '@shared/errors/AppError';
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import { ObjectID } from 'mongodb';
import { injectable, inject } from 'tsyringe';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import { ChartData } from 'chart.js';
import ITPsRepository from '@modules/sigitm/modules/TPs/repositories/ITPsRepository';
import TP from '@modules/sigitm/modules/TPs/infra/typeorm/entities/TP';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStampsRepository from '@modules/sigitm/modules/stamps/repositories/IStampsRepository';
import { transparentize } from 'polished';
import {
  format,
  differenceInCalendarDays,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';
import Color from '../utils/Colors';
import { groupArray, filterByTemplate } from '../utils/Array';

interface IRequest {
  user_id: string;
  template_id: ObjectID;
  chartPreference_id: ObjectID;
  maxGroupColumns?: number;
}

interface ITPGroupArray {
  [key: string]: TP[];
}

@injectable()
class ShowChartService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository,

    @inject('UserPreferencesRepository')
    private userPreferencesRepository: IUserPreferencesRepository,

    @inject('TPsRepository')
    private TPsRepository: ITPsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,
  ) {}

  public async execute({
    user_id,
    template_id,
    chartPreference_id,
    maxGroupColumns,
  }: IRequest): Promise<ChartData> {
    const userPreferences = await this.userPreferencesRepository.findByUserId(
      user_id,
    );

    if (!userPreferences) {
      throw new AppError('User Preference not found');
    }

    const chartPreference = userPreferences.charts.find(
      c => c._id.toHexString() === chartPreference_id.toHexString(),
    );

    if (!chartPreference) {
      throw new AppError('Chart Preference not found');
    }

    const template = await this.templatesRepository.findTemplateByUserIdAndId({
      user_id,
      template_id,
    });

    if (!template) {
      throw new AppError('Template not found');
    }

    const now = new Date();
    const daysBefore = differenceInCalendarDays(now, chartPreference.start);

    const cacheKey = `ChartTPs-${daysBefore}d`;
    let tps = await this.cacheProvider.recovery<TP[]>(cacheKey);

    if (!tps) {
      tps = await this.TPsRepository.findByDataInicioPrevAndTipoRede(
        {
          daysBefore,
          daysAfter: 0,
          tipoRede1: 304,
          tipoRede2: 305,
        },
        {
          // tps = await this.TPsRepository.findByIds([5687935], {
          relations: [
            'status',
            'impacto',
            'atividade',
            'rede',
            'rede.tipo',
            'tipoPlanta',
            'tipoTrabalho',
            'empresa',
            'tipoAfetacao',
            'motivo',
            'criador',
            'criadorGrupo',
            'responsavel',
            'fila',
            'encerrador',
            'encerradorGrupo',
            'dadosIP',
            'baixa',
            'ciente',
            'ciente.usuario',
            'ciente.grupo',
            'historicos',
            'historicos.usuario',
            'historicos.grupo',
          ],
        },
      );

      const stamps = await this.stampsRepository.findAll();
      tps.forEach(tp => tp.setCarimbosDetails(stamps));

      this.cacheProvider.save({ key: cacheKey, value: tps, expire: 24 * 3600 });
    }

    const tpsFiltered = filterByTemplate(tps, template);

    const chartData: ChartData = { labels: [], datasets: [] };

    let tpsGrouping: ITPGroupArray = {};

    if (chartPreference.groupBy && chartPreference.groupBy !== 'nao_agrupar') {
      tpsGrouping = groupArray(
        tpsFiltered,
        chartPreference.groupBy,
      ) as ITPGroupArray;
    } else {
      tpsGrouping = {
        Qtde: tpsFiltered,
      };
    }

    const colors = new Color();

    if (chartPreference.horizontal === 'grouping') {
      const counters = Object.keys(tpsGrouping).map(groupName => ({
        groupName,
        count: tpsGrouping[groupName].length,
      }));

      const sortable = counters
        .sort((a, b) => {
          return b.count - a.count;
        })
        .splice(0, maxGroupColumns || 10);

      chartData.labels = sortable.map(counter => counter.groupName);
      if (chartData.datasets) {
        const color = colors.getColor();
        chartData.datasets.push({
          label: 'Qtde',
          backgroundColor: transparentize(0.8, color),
          borderColor: color,
          borderWidth: 1,
          hoverBackgroundColor: transparentize(0.6, color),
          hoverBorderColor: color,
          data: sortable.map(counter => counter.count),
        });
      }
    } else if (chartPreference.horizontal === 'date') {
      const days = eachDayOfInterval({
        start: chartPreference.start,
        end: chartPreference.end,
      });

      chartData.labels = days.map(day => format(day, 'dd-MMM'));

      Object.keys(tpsGrouping).forEach(label => {
        if (chartData.datasets) {
          const color = colors.getColor();
          chartData.datasets.push({
            label,
            backgroundColor: transparentize(0.8, color),
            borderColor: color,
            borderWidth: 1,
            hoverBackgroundColor: transparentize(0.6, color),
            hoverBorderColor: color,
            data: days.map(
              day =>
                tpsGrouping[label]?.filter(tp =>
                  isSameDay(new Date(tp.dataInicioPrevisto), day),
                ).length,
            ),
          });
        }
      });
    }

    return chartData;
  }
}

export default ShowChartService;
