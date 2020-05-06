import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_EMPRESAS_TP' })
export default class TPEmpresa {
  @PrimaryGeneratedColumn({ name: 'EMP_CODIGO' })
  id: number;

  @Column({ name: 'EMP_NOME' })
  nome: string;
}
