import UserPreferenceFilaTAs from '../infra/typeorm/schemas/UserPreferenceFilaTAs';
import UserPreferenceCharts from '../infra/typeorm/schemas/UserPreferenceCharts';
import UserPreferenceFilaTPs from '../infra/typeorm/schemas/UserPreferenceFilaTPs';

export default interface IUpdateUserPreferencesDTO {
  user_id: string;
  filas_tas: UserPreferenceFilaTAs[];
  filas_tps: UserPreferenceFilaTPs[];
  charts: UserPreferenceCharts[];
}
