import { Post } from '../entities/Post';
import { MyContext } from '../types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostRevolver {
    /**
     * Retorna todos os posts
     * @param param0 
     * @returns 
     */
    @Query(() => [Post])
    posts( @Ctx() { em }: MyContext):Promise<Post[]> {
        return em.find(Post, {});
    }

    // Retorna um post dado seu id
    @Query(() => Post, {nullable: true})
    post(
        @Arg('postID', () => Int) id:number,
        @Ctx() { em }: MyContext
    ):Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    // Cria um post dado seu titulo
    @Mutation(() => Post)
    async createPost(
        @Arg('title') title:String,
        @Ctx() { em }: MyContext
    ):Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    // Atualiza um post dado seu id
    @Mutation(() => Post)
    async updatePost(
        @Arg('id') id:number,
        @Arg('title', () => String, {nullable: true}) title: string,
        @Ctx() { em }: MyContext
    ):Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    // Deleta um post dado seu id
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id:number,
        @Ctx() { em }: MyContext
    ):Promise<Boolean> {
        await em.nativeDelete(Post, { id });
        return true;
    }
}