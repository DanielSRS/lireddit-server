import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloRevolver {
    @Query(() => String)
    hello() {
        return 'hello world'
    }
}