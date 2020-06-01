import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';
import { prop as Property, getModelForClass, DocumentType } from '@typegoose/typegoose';

@ObjectType({ description: 'The Candles model' })
export class History {
    @Field()
    @Property()
    id: string;

    @Field() // enum for the future
    @Property({
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        minlength: 1,
    })
    symbol: string;

    @Field()
    @Property({
        required: true,
    })
    lastTimestamp: number;

    @Field()
    @Property()
    digits: number;

    @Field()
    @Property({
        required: true,
        set: (date: Date): number => date.getTime(),
        get: (date: Date): number => date.getTime(),
    })
    created: number;

    @Field()
    @Property()
    updated: string;
}
export type HistoryDocument = DocumentType<History>;

export const HistoryModel = getModelForClass(History);
