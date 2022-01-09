import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field({ description: 'O título do post' })
  @Property({ type: 'text'} )
  title!: string;

  @Field(() => String, { description: 'Data de criação do post' })
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String, { description: 'Data de atualização do post' })
  @Property({ type: 'date', onUpdate: () => new Date() })
  updateAt = new Date();

}