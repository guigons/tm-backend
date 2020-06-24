import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_GRUPOS' })
export default class SigitmGrupo {
  @PrimaryGeneratedColumn({ name: 'GRP_CODIGO' })
  id: number;

  @Column({ name: 'GRP_NOME' })
  nome: string;
}
