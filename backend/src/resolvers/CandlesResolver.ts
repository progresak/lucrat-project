import 'reflect-metadata';
import { Candle, CandleDocument, CandlesModel } from 'Entities/Candle';
import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql';
import { CandlesInput } from './types/candlesInput';
import { Context } from 'moleculer';
import { mapFromDocumentToGQL } from '../helpers';

@Resolver()
export class CandlesResolver {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query(_returns => Candle, { nullable: true })
    async getCandle(@Arg('id') id: string, @Ctx() ctx: Context) {
        const candle = await ctx.broker.call<CandleDocument, string>('candles.getById', id);

        return mapFromDocumentToGQL(candle);
    }

    @Query(() => [Candle])
    async getCandles(@Ctx() ctx: Context) {
        console.log('calling');
        try {
            const candles = await ctx.broker.call<CandleDocument[]>('candles.find');

            return mapFromDocumentToGQL(candles);
        } catch (e) {
            return [];
        }
    }

    @Query(() => Number)
    async getCandlesCount() {
        return await CandlesModel.find()
            .estimatedDocumentCount()
            .exec();
    }

    @Mutation(() => Candle)
    async createCandle(@Arg('data') candle: CandlesInput): Promise<Candle> {
        return (await CandlesModel.create(candle)).save();
    }

    @Mutation(() => Boolean)
    async deleteCandle(@Arg('id') id: string) {
        await CandlesModel.deleteOne({ id });
        return true;
    }
}
