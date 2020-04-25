// #region Global Imports
import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Event, Method, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
// #endregion Global Imports

// #region Local Imports
import { PlanetRepository, WeaponRepository } from '@Repositories';
import { CalculateMeta } from '@Meta';
import { Planet, Weapon } from '@Entities';
import connectionInstance from '@Entities/Connection';

import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';
import mongoose from 'mongoose';

// #endregion Local Imports

// #region Interface Imports
import { IPlanet } from '@Interfaces';
import { TickRecord } from '@Interfaces/TickRecord';
import TicksModel, { TicksSchema } from '../src/Models/TickModel';
import { Candle } from '@Interfaces/Candle';
import CandleModel from '../src/Models/CandleModel';
// #endregion Interface Imports

const getMongoAdapter = () => process.env.MONGO || '127.0.0.1';
console.log({ YES: getMongoAdapter() });
// ###############
// ### HISTORY ###
// ###############
@Service({
    name: 'planet',
    mixins: [DbService],
    adapter: new MongooseAdapter(`mongodb://${getMongoAdapter()}/newRepo`),
    model: mongoose.model('PriceTick', TicksSchema),
})
export class PlanetService extends MoleculerService {
    public async started() {
        await connectionInstance();
        // await this.broker.waitForServices(['producer'], 1000);
        return await this.broker.call('producer.startFetching');
    }

    @Action({
        params: {
            weaponName: { type: 'string', min: 2 },
            planetName: { type: 'string', min: 2 },
        },
    })
    public async Defend(ctx: Context<IPlanet.DefendInDto>): Promise<IPlanet.DefendOutDto> {
        const response = await this.DefendMethod(ctx);

        return response;
    }

    @Event()
    'producer.onNewPrice'(payload: { tickRecord: TickRecord }) {
        const { tickRecord } = payload;
        const Tick = new TicksModel(tickRecord);
        return Tick.save((err, data) => {
            console.log('tick saved');
            if (err) return console.error(err);
        });
    }

    @Event()
    'producer.onNewCandle'(payload: { candle: Candle }) {
        const { candle } = payload;
        console.log('shiit', { candle });
        const Tick = new CandleModel(candle);
        return Tick.save((err, data) => {
            console.log('Candle saved sucessfully', data);
            if (err) return console.error(err);
        });
    }

    @Method
    /**
     * @swagger
     *
     *  /planet/Defend:
     *    post:
     *      description: Attacks to the planet with given weapon.
     *      produces:
     *        - application/json
     *      consumes:
     *        - application/json
     *      parameters:
     *        - in: body
     *          name: params
     *          schema:
     *            type: object
     *            required:
     *              - weaponName
     *              - planetName
     *            properties:
     *              weaponName:
     *                type: string
     *                example: Death Star
     *              planetName:
     *                type: string
     *                example: Alderaan
     *      responses:
     *        200:
     *          description: Example attack result
     *        422:
     *          description: Missing parameters
     */
    public async DefendMethod(ctx: Context<IPlanet.DefendInDto>): Promise<IPlanet.DefendOutDto> {
        const { planetName, weaponName } = ctx.params;

        const planet: Planet = await PlanetRepository.Get(planetName);
        const weapon: Weapon = await WeaponRepository.Get(weaponName);

        const { damage, remainingShield } = await CalculateMeta.Damage(weapon, planet);

        await PlanetRepository.DecreaseShield(planetName, remainingShield);

        let message;

        if (remainingShield > 0) {
            message = `Planet took ${damage} damage and has ${remainingShield} shield left.`;
        } else {
            message = 'Planet shield ruined! war is lost!';
        }

        return { damage, planetMessage: message };
    }

    public async stopped() {
        return await getConnection().close();
    }
}

module.exports = PlanetService;
