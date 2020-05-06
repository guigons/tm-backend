import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_TIPOS_TRABALHOS_TP' })
export default class TPTipoTrabalho {
  @PrimaryGeneratedColumn({ name: 'TPS_CODIGO' })
  id: number;

  @Column({ name: 'TPS_NOME' })
  nome: string;
}
