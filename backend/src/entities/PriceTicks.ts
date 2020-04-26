import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@ObjectType({ description: 'The PriceTicks model' })
export class PriceTicks {
    @Field(() => ID)
    id: string;

    @Field()
    @Property()
    ask: number;

    @Field()
    @Property()
    bid: number;

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

export const PriceTicksModel = getModelForClass(PriceTicks);
