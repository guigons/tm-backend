import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBC_STATUS_TA' })
export default class SigitmTAStatus {
  @PrimaryGeneratedColumn({ name: 'STA_CODIGO' })
  id: number;

  @Column({ name: 'STA_NOME' })
  nome: string;
}
