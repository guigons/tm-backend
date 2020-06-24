import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBC_IMPACTOS_TP' })
export default class TPImpacto {
  @PrimaryGeneratedColumn({ name: 'IMP_CODIGO' })
  id: number;

  @Column({ name: 'IMP_NOME' })
  nome: string;
}
