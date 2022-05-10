import type { Client } from '../client/interfaces/Client';
import { postProcessModel } from './postProcessModel';
import { postProcessService } from './postProcessService';

/**
 * Post process client
 * @param client Client object with all the models, services, etc.
 * @param options
 */
export const postProcessClient = (client: Client, options?: { useJsonld?: boolean }): Client => {
    if (options?.useJsonld) {
        client.models = client.models.filter(model => model.name.includes('jsonld'));
    }

    return {
        ...client,
        models: client.models.map(model => postProcessModel(model)),
        services: client.services.map(service => postProcessService(service, options)),
    };
};
