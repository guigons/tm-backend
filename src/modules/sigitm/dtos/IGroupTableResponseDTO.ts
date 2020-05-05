export default interface IGroupTATableResponse {
  nome: string;
  data: {
    t365d: { nome: string; count: number; ids: number[] };
    t120d: { nome: string; count: number; ids: number[] };
    t60d: { nome: string; count: number; ids: number[] };
    t30d: { nome: string; count: number; ids: number[] };
    t15d: { nome: string; count: number; ids: number[] };
    t7d: { nome: string; count: number; ids: number[] };
    t3d: { nome: string; count: number; ids: number[] };
    t1d: { nome: string; count: number; ids: number[] };
    t12h: { nome: string; count: number; ids: number[] };
    t0h: { nome: string; count: number; ids: number[] };
  };
}
