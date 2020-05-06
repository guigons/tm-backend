import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_TIPOS_AFETACAO_TP' })
export default class TPTipoTrabalho {
  @PrimaryGeneratedColumn({ name: 'TPF_CODIGO' })
  id: number;

  @Column({ name: 'TPF_NOME' })
  nome: string;
}
