export const getMongoAdapter = () => process.env.MONGO || '127.0.0.1';
export const getMongoUrl = () => `mongodb://${getMongoAdapter()}/`;

export const mongoDatabase = 'newRepo2';
