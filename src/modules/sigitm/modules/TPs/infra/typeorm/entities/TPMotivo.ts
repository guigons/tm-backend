import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_MOTIVOS_TP' })
export default class TPTipo {
  @PrimaryGeneratedColumn({ name: 'TPM_CODIGO' })
  id: number;

  @Column({ name: 'TPM_NOME' })
  nome: string;
}
