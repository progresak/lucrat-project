import { Document } from 'mongoose';
export interface TickRecord {
    ask: number;
    askVolume: number;
    bid: number;
    bidVolume: number;
    high: number;
    level: number;
    low: number;
    quoteId: number;
    spreadRaw: number;
    spreadTable: number;
    symbol: string;
    timestamp: number;
}
export interface DocumentTickRecord extends Document {}
