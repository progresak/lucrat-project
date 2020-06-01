// @ts-ignore
import PromService from 'moleculer-prometheus';
import { Service } from 'moleculer-decorators';
import { Service as MoleculerService } from 'moleculer';

@Service({
    name: 'prometheus',
    mixins: [PromService],
    settings: {
        port: 3030,
        collectDefaultMetrics: true,
        timeout: 5 * 1000,
    },
})
export class PrometheusService extends MoleculerService {
    started() {
        console.log('PrometheusService Started');
    }
}

module.exports = PrometheusService;
