import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_TP_BAIXAS' })
export default class TPBaixa {
  @PrimaryGeneratedColumn({ name: 'TPX_CODIGO' })
  id: number;

  @Column({ name: 'TPX_TP' })
  tp_id: number;

  @Column({ name: 'TPX_DATA_BAIXA' })
  data: Date;

  @Column({ name: 'TPX_DESCRICAO_BAIXA' })
  descricao: string;

  @Column({ name: 'TPX_BAIXA_INCIDENCIA_NOME' })
  incidencia: string;

  @Column({ name: 'TPX_BAIXA_ROLLBACK_NOME' })
  rollback: string;

  @Column({ name: 'TPX_BAIXA_PRAZO_NOME' })
  prazo: string;

  @Column({ name: 'TPX_BAIXA_IMPACTO_NOME' })
  impacto: string;
}
