import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserRevolver {

    // Retorna o usuário loggado
    @Query(() => User, { nullable: true })
    async me (
        @Ctx() { req, em }: MyContext
    ) {
        if (!req.session.userID) {  // verifica se uma sessao (cookie) com o usuário logado
            return null
        }

        const user = await em.findOne(User, { id: req.session.userID });

        return user;
    }


    // Registra um novo usuário
    @Mutation(() => UserResponse)
    async register(
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext
    ):Promise<UserResponse> {
        if (username.length <= 5) { // se username não tem tamanho minimo
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be greater than 5'
                }]
            }
        }

        if (password.length <= 5) { // se senha não tem tamanho minimo
            return {
                errors: [{
                    field: 'password',
                    message: 'length must be greater than 5'
                }]
            }
        }

        const hashedPassword = await argon2.hash(password);
        username = username.toLowerCase();
        const user = em.create(User, {username, password: hashedPassword})
        
        try {
            await em.persistAndFlush(user);
        } catch (error) {
            if (error?.code === '23505' || error?.detail?.includes('already exists')) { // Usuário já existe
                return {
                    errors: [{
                        field: 'username',
                        message: 'username already taken'
                    }]
                }
            }
        }

        //  faz login do usuário apos registro
        //  salva a sessão como o id do usuário
        //  salva um cookie no cliente
        //  mantem logado
        req.session.userID = user.id;

        return {
            user
        }
    }

    // Faz o login do usuário
    @Mutation(() => UserResponse)
    async login(
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext
    ):Promise<UserResponse> {
        username = username.toLowerCase();
        const user = await em.findOne(User, { username })

        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: 'that username does not exist',
                }],
            }
        }

        const verify = await argon2.verify(user.password, password);

        if (!verify) {
            return {
                errors: [{
                    field: 'password',
                    message: 'invalid password',
                }],
            }
        }

        req.session.userID = user.id;
        
        return {
            user
        }
    }
}