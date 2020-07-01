import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowChartService from '@modules/charts/services/ShowChartService';

export default class ChartsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { template_id, chartPreference_id, maxGroupColumns } = request.query;

    const showChart = container.resolve(ShowChartService);

    const chart = await showChart.execute({
      user_id,
      template_id: new ObjectID(template_id.toString()),
      chartPreference_id: new ObjectID(chartPreference_id.toString()),
      maxGroupColumns: Number(maxGroupColumns),
    });

    return response.json(chart);
  }
}
