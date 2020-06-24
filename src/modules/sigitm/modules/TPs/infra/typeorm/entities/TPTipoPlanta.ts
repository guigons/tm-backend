import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBC_TIPOS_PLANTA' })
export default class TPTipo {
  @PrimaryGeneratedColumn({ name: 'TPL_CODIGO' })
  id: number;

  @Column({ name: 'TPL_NOME' })
  nome: string;
}
