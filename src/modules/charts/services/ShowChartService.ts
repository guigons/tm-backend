import groupArrayLib from 'group-array';
import AppError from '@shared/errors/AppError';
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import { ObjectID } from 'mongodb';
import { injectable, inject } from 'tsyringe';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import { ChartData } from 'chart.js';
import ITPsRepository from '@modules/sigitm/modules/TPs/repositories/ITPsRepository';
import TP from '@modules/sigitm/modules/TPs/infra/bridge/entities/TP';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStampsRepository from '@modules/stamps/repositories/IStampsRepository';
import { transparentize } from 'polished';
import {
  format,
  differenceInCalendarDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isWithinInterval,
  subDays,
  subWeeks,
  subMonths,
  endOfToday,
  endOfDay,
  startOfDay,
  endOfYesterday,
  endOfWeek,
  endOfMonth,
  eachMonthOfInterval,
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

    let start: Date;
    let end: Date;
    let expire = 24 * 3600;
    const now = new Date();
    if (chartPreference.period === 'specific') {
      start = startOfDay(chartPreference.start);
      end = endOfDay(chartPreference.end);
    } else if (chartPreference.period === 'last_days') {
      end = endOfYesterday();
      start = subDays(end, chartPreference.amount);
      expire = 24 * 3600;
    } else if (chartPreference.period === 'last_weeks') {
      end = subWeeks(endOfWeek(now), 1);
      start = subWeeks(end, chartPreference.amount);
      expire = 24 * 3600;
    } else if (chartPreference.period === 'last_months') {
      end = subMonths(endOfMonth(now), 1);
      start = subMonths(end, chartPreference.amount);
      expire = 3 * 24 * 3600;
    } else {
      start = subDays(endOfToday(), 7);
      end = endOfToday();
    }

    const cacheKey = `TPsCharts-${start.toDateString()}-${end.toDateString()}t`;
    const daysBefore = differenceInCalendarDays(endOfToday(), start);
    const daysAfter = differenceInCalendarDays(endOfToday(), end);

    let tps = await this.cacheProvider.recovery<TP[]>(cacheKey);

    if (!tps) {
      tps = await this.TPsRepository.findByDataInicioPrevAndTipoRede({
        daysBefore,
        daysAfter,
        tipoRede1: 304,
        tipoRede2: 305,
      });

      const stamps = await this.stampsRepository.findAll();
      tps.forEach(tp => tp.setCarimbosDetails(stamps));

      this.cacheProvider.save({ key: cacheKey, value: tps, expire });
    }

    const tpsWithinInterval = tps.filter(tp =>
      isWithinInterval(new Date(tp.dataInicioPrevisto), {
        start,
        end,
      }),
    );

    const tpsFiltered = filterByTemplate(tpsWithinInterval, template);

    const tpsWithTag = tpsFiltered.map(tp =>
      Object.assign(tp, {
        ...tp,
        tagProjectPerDay: `${tp.projeto}-${format(
          new Date(tp.dataInicioPrevisto),
          'dd/MMM/uuuu',
        )}`,
      }),
    );

    const chartData: ChartData = { labels: [], datasets: [] };

    let tpsGrouping: ITPGroupArray = {};

    if (chartPreference.groupBy && chartPreference.groupBy !== 'nao_agrupar') {
      tpsGrouping = groupArray(
        tpsWithTag,
        chartPreference.groupBy,
      ) as ITPGroupArray;
    } else {
      tpsGrouping = {
        Qtde: tpsWithTag,
      };
    }

    const colors = new Color();

    if (chartPreference.horizontal === 'grouping') {
      const counters = Object.keys(tpsGrouping).map(groupName => {
        const group = groupArrayLib(tpsGrouping[groupName], 'tagProjectPerDay');
        return {
          groupName,
          count: Object.keys(group).length,
        };
      });

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
      let intervals: Date[] = [];

      if (chartPreference.period === 'last_days') {
        intervals = eachDayOfInterval({
          start,
          end,
        });
      }

      if (chartPreference.period === 'last_weeks') {
        intervals = eachWeekOfInterval({
          start,
          end,
        });
      }

      if (chartPreference.period === 'last_months') {
        intervals = eachMonthOfInterval({
          start,
          end,
        });
      }
      intervals = intervals.splice(1, intervals.length);

      if (chartPreference.period === 'last_months') {
        chartData.labels = intervals.map(interval => format(interval, 'MMM'));
      } else {
        chartData.labels = intervals.map(interval =>
          format(interval, 'dd-MMM'),
        );
      }

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
            data: intervals.map(interval => {
              const filtered = tpsGrouping[label]?.filter(tp => {
                if (chartPreference.period === 'last_days') {
                  return isSameDay(new Date(tp.dataInicioPrevisto), interval);
                }
                if (chartPreference.period === 'last_weeks') {
                  return isSameWeek(new Date(tp.dataInicioPrevisto), interval);
                }
                if (chartPreference.period === 'last_months') {
                  return isSameMonth(new Date(tp.dataInicioPrevisto), interval);
                }
                return false;
              });
              const group = groupArrayLib(filtered, 'tagProjectPerDay');
              return Object.keys(group).length;
            }),
          });
        }
      });
    }

    return chartData;
  }
}

export default ShowChartService;
