import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { __prod__ } from './constants';
//import { Post } from './entities/Post';
import mikroOrmConfig from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloRevolver } from './resolvers/hello';

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);  // conecta com o banco de dados
    await orm.getMigrator().up();  // roda as migrations

    // executa o sql
    //const post = orm.em.create(Post, {title: 'my first post'});
    //await orm.em.persistAndFlush(post);

    //const posts = await orm.em.find(Post, {});
    //console.log(posts);

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloRevolver],
            validate: false,
        })
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