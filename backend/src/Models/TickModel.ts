import mongoose from 'mongoose';
import { DocumentTickRecord } from '@Interfaces/TickRecord';

export const TicksSchema = new mongoose.Schema({
    ask: Number,
    askVolume: Number,
    bid: Number,
    bidVolume: Number,
    high: Number,
    level: Number,
    low: Number,
    quoteId: Number,
    spreadRaw: Number,
    spreadTable: Number,
    symbol: {
        type: String,
        required: true,
    },
    timestamp: Number,
});

const TicksModel = mongoose.model<DocumentTickRecord>('Ticks', TicksSchema);

export default TicksModel;
