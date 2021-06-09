import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as newId } from "uuid";

@Entity("users")
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = newId();
    }
  }
}

export { User };
