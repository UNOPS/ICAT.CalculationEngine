export class ResponseDTO {
year: number;
projectEmission: number;
baseLineEmission: number;
leakegeEmission: number;
emissionReduction: number;
projectionResults:ProjectionResult[];
}


export class ProjectionResult
{
    year: number;
    projectEmission: number;
    baseLineEmission: number;
    leakegeEmission: number;
    emissionReduction: number;
    }