import { ObjectId } from 'mongodb';

export default interface IRemoveTemplateDTO {
  user_id: string;
  template_id: ObjectId;
}
