import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PriceTick {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column()
    ask: number;

    @Column()
    bid: number;

    @Column()
    bidVolume: number;

    @Column()
    high: number;

    @Column()
    level: number;

    @Column()
    low: number;

    @Column()
    quoteId: number;
    @Column()
    spreadRaw: number;
    @Column()
    spreadTable: number;
    @Column()
    symbol: string;
    @Column()
    timestamp: string;

    constructor(
        id: number,
        name: string,
        ask: number,
        bid: number,
        bidVolume: number,
        high: number,
        level: number,
        low: number,
        quoteId: number,
        spreadRaw: number,
        spreadTable: number,
        symbol: string,
        timestamp: string,
    ) {
        this.id = id;
        this.name = name;
        this.ask = ask;
        this.bid = bid;
        this.bidVolume = bidVolume;
        this.high = high;
        this.level = level;
        this.low = low;
        this.quoteId = quoteId;
        this.spreadRaw = spreadRaw;
        this.spreadTable = spreadTable;
        this.symbol = symbol;
        this.timestamp = timestamp;
    }
}
