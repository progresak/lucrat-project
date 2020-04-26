import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import resolvers from 'Resolvers/index';

const schema = buildSchemaSync({ validate: false, resolvers, skipCheck: false });

export default schema;
