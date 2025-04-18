import { supportedFormats } from '../../../domain/constants/formats';

export class ConvertAudioDto {
    constructor(public readonly id: string, public readonly format: string) {}

    static create = (obj: { [key: string]: any }): [string?, ConvertAudioDto?] => {
        const { id, format } = obj;

        if (!id) return ['Id is missing', undefined];
        if (!format) return ['Format is missing', undefined];

        if (!supportedFormats.includes(format)) return ['Format not supported', undefined];

        return [undefined, new ConvertAudioDto(id, format)];
    };
}
