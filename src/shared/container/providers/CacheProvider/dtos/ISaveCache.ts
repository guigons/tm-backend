export default interface ICacheSave {
  key: string;
  value: any;
  expire?: number;
}
