'use strict';

import ApiGateway from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { ApolloService } from 'moleculer-apollo-server';

import { resolvers, typeDefs } from '../src/GraphQL';

const ApiService: ServiceSchema = {
    name: 'api',

    mixins: [
        ApiGateway,
        ApolloService({
            // Global GraphQL typeDefs
            typeDefs,
            // typeDefs: ``,

            // Global resolvers
            resolvers,
            // resolvers: {},

            // API Gateway route options
            routeOptions: {
                path: '/graphql',
                cors: true,
                mappingPolicy: 'restrict',
            },

            // https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
            serverOptions: {
                tracing: true,

                engine: {
                    apiKey: process.env.APOLLO_ENGINE_KEY,
                },
            },
        }),
    ],

    // More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
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

        // Serve assets from 'public' folder
        assets: {
            folder: 'public',
        },
    },
};

export = ApiService;
