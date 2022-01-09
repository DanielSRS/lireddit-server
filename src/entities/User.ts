import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field({ description: 'O username do usuário' })
  @Property({ type: 'text', unique: true } )
  username!: string;

  @Field(() => String, { description: 'Data de criação do usuário' })
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String, { description: 'Data de atualização do usuário' })
  @Property({ type: 'date', onUpdate: () => new Date() })
  updateAt = new Date();

  @Property({ type: 'text' })
  password!: string;

}
