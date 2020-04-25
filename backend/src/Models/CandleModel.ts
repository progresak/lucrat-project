import { Schema } from 'mongoose';

import mongoose from 'mongoose';
import { DocumentCandle } from '@Interfaces/Candle';

export const CandlesSchema = new Schema({
    low: Number,
    high: Number,
    open: Number,
    close: Number,
    volume: Number,
    symbol: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
        unique: true,
    },
});

const CandleModel = mongoose.model<DocumentCandle>('Candles', CandlesSchema);

export default CandleModel;
