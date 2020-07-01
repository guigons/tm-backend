import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';
import { ICarimbo } from './TP';

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

  @Expose({ name: 'carimbo' })
  getCarimbo(): ICarimbo | undefined {
    const carimboExists = this.descricao.match(/(^|.*)(DE_|CA_|PB_)[0-9][0-9]/);

    if (!carimboExists) {
      return undefined;
    }

    const extract = this.descricao.match(
      /(^|.*)((DE_|CA_|PB_)[0-9][0-9])\s+(.*?)(\n|$)/,
    );
    const codigo = extract ? extract[2] : '';

    return {
      codigo,
      data: this.data,
    };
  }

  carimbo: ICarimbo;
}
