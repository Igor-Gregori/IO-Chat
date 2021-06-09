import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import { v4 as newId } from "uuid";
import { User } from "./Users";


@Entity("messages")
class Messages {
  @PrimaryColumn()
  id: string;

  @Column()
  admin_id: string;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user: User;

  @Column()
  user_id: string;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: string;

  constructor() {
    if (!this.id) {
      this.id = newId();
    }
  }
}

export { Messages };

