import type { Service } from '../client/interfaces/Service';
import { postProcessServiceImports } from './postProcessServiceImports';
import { postProcessServiceOperations } from './postProcessServiceOperations';

export const postProcessService = (service: Service, options?: { useJsonld: boolean }): Service => {
    const clone = { ...service };
    clone.operations = postProcessServiceOperations(clone, options);
    clone.imports = clone.operations.flatMap(operation => operation.imports);
    clone.imports = postProcessServiceImports(clone);
    return clone;
};
