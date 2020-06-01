import { InputType, Field } from 'type-graphql';
// import { Length } from 'class-validator';
import { Candle } from 'Entities/Candle';
import { prop as Property } from '@typegoose/typegoose/lib/prop';

@InputType()
export class CandlesInput implements Partial<Candle> {
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
    @Property()
    timestamp: number;
}
