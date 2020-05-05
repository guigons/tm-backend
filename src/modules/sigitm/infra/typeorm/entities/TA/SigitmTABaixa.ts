import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_TA_BAIXAS' })
export default class SigitmTABaixa {
  @PrimaryGeneratedColumn({ name: 'TAX_CODIGO' })
  id: number;

  @Column({ name: 'TAX_TA' })
  ta_id: number;

  @Column({ name: 'TAX_BAIXA_GRUPO_NOME' })
  grupo: string;

  @Column({ name: 'TAX_BAIXA_CAUSA_NOME' })
  causa: string;

  @Column({ name: 'TAX_BAIXA_REPARO_NOME' })
  reparo: string;

  @Column({ name: 'TAX_BAIXA_DEFEITO_NOME' })
  defeito: string;

  @Column({ name: 'TAX_BAIXA_COMPONENTE_NOME' })
  componente: string;
}
