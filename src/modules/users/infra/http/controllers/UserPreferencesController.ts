import { ObjectID, ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowUserPreferencesService from '@modules/users/services/ShowUserPreferencesService';
import UpdateUserPreferencesService from '@modules/users/services/UpdateUserPreferencesService';
import UserPreferenceCharts from '../../typeorm/schemas/UserPreferenceCharts';

export default class UserPreferencesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const showUserPreferences = container.resolve(ShowUserPreferencesService);
    const user = await showUserPreferences.execute({
      user_id,
    });

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { filas_tas, filas_tps, charts: chartParams } = request.body;
    const updateUserPreferences = container.resolve(
      UpdateUserPreferencesService,
    );

    const charts: UserPreferenceCharts[] = chartParams.map(
      (cp: UserPreferenceCharts) =>
        Object.assign(cp, {
          _id: new ObjectID(cp._id),
          template_id: new ObjectId(cp.template_id),
        }),
    );

    const user = await updateUserPreferences.execute({
      user_id,
      filas_tas,
      filas_tps,
      charts,
    });

    return response.json(user);
  }
}
