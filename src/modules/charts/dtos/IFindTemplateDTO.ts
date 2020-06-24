import { ObjectID } from 'mongodb';

export default interface IFindTemplateDTO {
  user_id: string;
  template_id: ObjectID;
}
