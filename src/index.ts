import "reflect-metadata";
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { __prod__ } from './constants';
import mikroOrmConfig from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloRevolver } from './resolvers/hello';
import { PostRevolver } from './resolvers/post';
import { UserRevolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);  // conecta com o banco de dados
    await orm.getMigrator().up();  // roda as migrations

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
    session({
        name: 'dqid',
        store: new RedisStore({
            client: redisClient,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            sameSite: 'lax', // csrf
            secure: __prod__ // cookie only works in http
        },
        saveUninitialized: false,
        secret: 'lansofjqwf352yhggb35/.;d,gnaskdhfo abnsurlfhoasbavun sowhof3453t',
        resave: false,
    })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloRevolver, PostRevolver, UserRevolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res })
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });
}

main ().catch((error) => {
    console.error(error);
});