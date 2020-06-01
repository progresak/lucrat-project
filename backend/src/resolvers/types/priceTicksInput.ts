import { InputType, Field } from 'type-graphql';
import { PriceTick } from 'Entities/PriceTick';
import { prop as Property } from '@typegoose/typegoose/lib/prop';

@InputType()
export class PriceTicksInput implements Partial<PriceTick> {
    @Field()
    @Property()
    bid: number;

    @Field()
    @Property()
    ask: number;

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
