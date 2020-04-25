import ApiGateway from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { ApolloService } from 'moleculer-apollo-server';
import { resolvers, typeDefs } from '../src/GraphQL';

const ApiService: ServiceSchema = {
    name: 'api',

    mixins: [
        ApiGateway,
        ApolloService({
            typeDefs,
            resolvers,
            routeOptions: {
                path: '/graphql',
                cors: true,
                mappingPolicy: 'restrict',
            },
            serverOptions: {
                tracing: true,
                engine: {
                    apiKey: process.env.APOLLO_ENGINE_KEY,
                },
            },
        }),
    ],
    settings: {
        port: process.env.PORT || 3000,
        routes: [
            {
                aliases: {},
                cors: {
                    credentials: true,
                    methods: ['GET', 'OPTIONS', 'POST'],
                    origin: ['*'],
                },
                path: '/api',
            },
        ],
        assets: {
            folder: 'public',
        },
    },
};

export = ApiService;
