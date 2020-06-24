import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_TP_DADOS_IP' })
export default class TPDadosIP {
  @PrimaryGeneratedColumn({ name: 'TGI_CODIGO' })
  id: number;

  @Column({ name: 'TGI_TP' })
  tp_id: number;

  @Column({ name: 'TGI_FABRICANTE' })
  fabricante: string;

  @Column({ name: 'TGI_HOSTNAME' })
  hostname: string;
}
