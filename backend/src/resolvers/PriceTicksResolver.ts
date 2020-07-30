import 'reflect-metadata';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { PriceTick, PriceTicksModel } from 'Entities/PriceTick';
import { PriceTicksInput } from 'Resolvers/types/priceTicksInput';

@Resolver()
export class PriceTicksResolver {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query(_returns => PriceTick, { nullable: false })
    async getPriceTick(@Arg('id') id: string) {
        return await PriceTicksModel.findById({ _id: id }).exec();
    }

    @Query(() => [PriceTick])
    async getPriceTicks() {
        return await PriceTicksModel.find().exec();
    }

    @Query(() => Number)
    async getPriceTicksCount() {
        return await PriceTicksModel.find()
            .estimatedDocumentCount()
            .exec();
    }

    @Mutation(() => PriceTick)
    async createPriceTick(@Arg('data') priceTick: PriceTicksInput): Promise<PriceTick> {
        // @ts-ignore
        return (await PriceTicksModel.create(priceTick)).save();
    }

    @Mutation(() => Boolean)
    async deletePriceTick(@Arg('id') id: string) {
        await PriceTicksModel.deleteOne({ id });
        return true;
    }
}
