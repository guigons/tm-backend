import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBC_STATUS_TP' })
export default class TPStatus {
  @PrimaryGeneratedColumn({ name: 'STP_CODIGO' })
  id: number;

  @Column({ name: 'STP_NOME' })
  nome: string;
}
