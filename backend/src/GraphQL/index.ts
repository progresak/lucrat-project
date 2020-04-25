import TicksModel from '../Models/TickModel';

export const resolvers = {
    Query: {
        getAllData: async () => {
            const Q = TicksModel.find({});
            const all = await Q.exec();
            return all;
        },
        getTicksCount: async () => {
            return TicksModel.find({})
                .estimatedDocumentCount()
                .exec();
        },
    },
};

export const typeDefs = `
    type Tick {
        id: ID!
        open: Float
        close: Float
        ask: Float
        bid: Float
        timestamp: Float
    }

    type Query {
        getAllData(diff: Int): [Tick]
        getTicksCount: Int
        getTest: Int
    }
`;
