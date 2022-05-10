import type { Operation } from '../client/interfaces/Operation';

export const postProcessServiceOperationsJsonld = (operation: Operation) => {
    operation.parameters.forEach(parameter => {
        parameter.mediaType = 'application/ld+json';
        parameter.imports = [];
    });

    if (operation.parametersBody) {
        operation.parametersBody.base = replaceServiceName(operation.parametersBody.base);
        operation.parametersBody.type = replaceServiceName(operation.parametersBody.base);
        operation.parametersBody.imports = [];
    }

    operation.imports = operation.imports.map(importString => replaceServiceName(importString));

    operation.results.forEach(result => {
        processResult(result);

        if (result.export === 'one-of' || result.export === 'any-of' || result.export === 'all-of') {
            result.properties.forEach(processResult);
        }
    });
};

const processResult = (result: { base: string; type: string; imports: string[] }) => {
    result.base = replaceServiceName(result.base);
    result.type = replaceServiceName(result.base);
    result.imports = result.imports.map(importString => replaceServiceName(importString));
    return result;
};

const replaceServiceName = (replaceString: string) => {
    if (replaceString === 'void' || replaceString.includes('jsonld')) {
        return replaceString;
    }

    return replaceString.replace('_', '_jsonld_');
};
