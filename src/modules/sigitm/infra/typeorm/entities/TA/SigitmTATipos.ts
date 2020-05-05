import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBC_TIPOS_TA' })
export default class SigitmTATipos {
  @PrimaryGeneratedColumn({ name: 'TPB_CODIGO' })
  id: number;

  @Column({ name: 'TPB_NOME' })
  nome: string;
}
