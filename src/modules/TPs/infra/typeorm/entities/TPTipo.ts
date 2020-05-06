import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBC_TIPOS_TP' })
export default class TPTipo {
  @PrimaryGeneratedColumn({ name: 'TPR_CODIGO' })
  id: number;

  @Column({ name: 'TPR_NOME' })
  nome: string;
}
