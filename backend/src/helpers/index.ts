import { omit, isArray } from 'lodash/fp';
import { DocumentType } from '@typegoose/typegoose';

export const getExampleCandle = (symbol = 'EURUSD') => {
    return {
        high: Math.random() + 1,
        low: Math.random() + 1,
        open: Math.random() + 1,
        close: Math.random() + 1,
        volume: Math.random() * 1000,
        timestamp: Math.random() * 100000,
        symbol,
    };
};

const getGQLObject = <T>(document: DocumentType<T>): GQLObjectWithId<T> => {
    const documentObject: DocumentType<T> = document.toObject ? document.toObject() : document;
    const id: string = documentObject._id;
    const omittedObject = omit(['_id', '__v'], documentObject);

    return { id, ...omittedObject } as GQLObjectWithId<T>;
};

type GQLObjectWithId<T> = T & { id: string };

export const mapFromDocumentToGQL = <T>(
    document: DocumentType<T> | DocumentType<T>[],
): GQLObjectWithId<T> | null | GQLObjectWithId<T>[] | [] => {
    if (isArray(document) && !document) {
        return [];
    }
    if (!document) {
        return null;
    }
    if (isArray(document)) {
        return document.map(getGQLObject);
    }

    return getGQLObject(document);
};
