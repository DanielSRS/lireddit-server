import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
//import { Post } from './entities/Post';
import mikroOrmConfig from './mikro-orm.config';

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);  // conecta com o banco de dados
    await orm.getMigrator().up();  // roda as migrations

    // executa o sql
    //const post = orm.em.create(Post, {title: 'my first post'});
    //await orm.em.persistAndFlush(post);

    //const posts = await orm.em.find(Post, {});
    //console.log(posts);
}

main ().catch((error) => {
    console.error(error);
});