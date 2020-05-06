import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'SIGITM3', name: 'TBL_USUARIOS' })
export default class TAUsuario {
  @PrimaryGeneratedColumn({ name: 'USR_CODIGO' })
  id: number;

  @Column({ name: 'USR_NOME' })
  nome: string;
}
