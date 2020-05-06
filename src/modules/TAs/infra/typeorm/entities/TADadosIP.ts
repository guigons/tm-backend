import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_TA_DADOS_IP' })
export default class TADadosIP {
  @PrimaryGeneratedColumn({ name: 'TAY_CODIGO' })
  id: number;

  @Column({ name: 'TAY_TA' })
  ta_id: number;

  @Column({ name: 'TAY_FABRICANTE' })
  fabricante: string;

  @Column({ name: 'TAY_HOSTNAME' })
  hostname: string;
}
