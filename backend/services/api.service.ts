import { Service as MoleculerService } from 'moleculer';
import { Service } from 'moleculer-decorators';
import { ApolloServer } from 'apollo-server';
    import schema from 'Resolvers/schema';

@Service({
    name: 'api',
})
export class ApiService extends MoleculerService {
    server!: ApolloServer;

    async started() {
        this.name = 'api';
        const server = new ApolloServer({
            schema,
            context: () => ({
                broker: this.broker,
            }),
        });
        this.server = server;

        // Check if port is set, otherwise default to 3000
        const port = process.env.PORT || 3000;

        // Start our server
        await server.listen({ port }).then(({ url }) => {
            this.broker.logger.info(`🚀  Apollo Server ready at ${url}`);
        });
    }

    // Stopped handler
    stopped() {
        this.server.stop();
    }
}

module.exports = ApiService;
