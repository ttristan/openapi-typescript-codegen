import type { Operation } from '../client/interfaces/Operation';

export const postProcessServiceOperationsJsonld = (operation: Operation) => {
    const { service: serviceName } = operation;

    operation.parameters.forEach(parameter => {
        parameter.mediaType = 'application/ld+json';
        parameter.imports = [];
    });

    if (operation.parametersBody) {
        operation.parametersBody.base = replaceServiceName(serviceName, operation.parametersBody.base);
        operation.parametersBody.type = replaceServiceName(serviceName, operation.parametersBody.base);
        operation.parametersBody.imports = [];
    }

    operation.imports = operation.imports.map(importString => replaceServiceName(serviceName, importString));

    operation.results.forEach(result => {
        result.base = replaceServiceName(serviceName, result.base);
        result.type = replaceServiceName(serviceName, result.base);
        result.imports = result.imports.map(importString => replaceServiceName(serviceName, importString));
    });
};

const replaceServiceName = (serviceName: string, replaceString: string) => {
    if (replaceString === 'void' || replaceString.includes('jsonld')) {
        return replaceString;
    }
    const version = replaceString.match(/_v\d+_/);
    const versionString = version ? `_${version[0].split('_')[1]}` : '';

    const versionedServiceName = `${serviceName}${versionString}`;

    return replaceString.replace(versionedServiceName, `${versionedServiceName}_jsonld`);
};
