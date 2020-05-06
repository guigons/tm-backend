import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_ATIVIDADES_TP' })
export default class TPAtividade {
  @PrimaryGeneratedColumn({ name: 'ATP_CODIGO' })
  id: number;

  @Column({ name: 'ATP_NOME' })
  nome: string;
}
