import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass, index, DocumentType } from '@typegoose/typegoose';

@ObjectType({ description: 'The PriceTicks model' })
@index({ timestamp: 1, symbol: 1 }, { unique: true })
export class PriceTick {
    @Field(() => ID)
    id: string;

    @Field()
    @Property()
    ask: number;

    @Field()
    @Property()
    askVolume: number;

    @Field()
    @Property()
    bid: number;

    @Field()
    @Property()
    bidVolume: number;

    @Field()
    @Property()
    open: number;

    @Field()
    @Property()
    close: number;

    @Field()
    @Property()
    spreadRaw: number;

    @Field()
    @Property()
    level: number;

    @Field()
    @Property()
    spreadTable: number;

    @Field()
    @Property()
    quoteId: number;

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
export type PriceTickDocument = DocumentType<PriceTick>;

export const PriceTicksModel = getModelForClass(PriceTick);
