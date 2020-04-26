import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';
import { prop as Property, getModelForClass, DocumentType } from '@typegoose/typegoose';

@ObjectType({ description: 'The Candles model' })
export class Candle {
    @Field()
    @Property({})
    id: string;

    @Field()
    @Property()
    low: number;

    @Field()
    @Property()
    high: number;

    @Field()
    @Property()
    open: number;

    @Field()
    @Property()
    close: number;

    @Field()
    @Property()
    volume: number;

    @Field()
    @Property()
    symbol: string;

    @Field()
    @Property({ required: true })
    timestamp: number;
}
export type CandleDocument = DocumentType<Candle>;

export const CandlesModel = getModelForClass(Candle);
