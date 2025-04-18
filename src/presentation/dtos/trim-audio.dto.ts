export class TrimAudioDto {
    constructor(public readonly startTime: number, public readonly duration: number, public readonly id: string) {}

    static create = (obj: { [key: string]: any }): [string?, TrimAudioDto?] => {
        const { startTime, duration, id } = obj;

        if (!id) return ['id is missing', undefined];
        if (startTime === undefined || startTime === null || startTime === '') {
            return ['startTime is missing', undefined];
        }
        if (duration === undefined || duration === null || duration === '') {
            return ['duration is missing', undefined];
        }

        const validStartTime = TrimAudioDto.validateAndConvertTime(startTime);
        if (validStartTime.error) return [validStartTime.error, undefined];

        const validDuration = TrimAudioDto.validateAndConvertTime(duration);
        if (validDuration.error) return [validDuration.error, undefined];

        return [undefined, new TrimAudioDto(validStartTime.value!, validDuration.value!, id)];
    };

    static validateAndConvertTime(time: string | number): { value?: number; error?: string } {
        if (typeof time === 'number') {
            if (time < 0) return { error: 'Time must be a non-negative number' };
            return { value: time };
        }

        if (typeof time === 'string') {
            const regexFullTime = /^(\d{1,2}):(\d{2}):(\d{2})(\.\d+)?$/; // hh:mm:ss(.sss)
            const regexMinutes = /^(\d{1,2}):(\d{2})$/; // hh:mm
            const regexSeconds = /^\d+(\.\d+)?$/; // segundos (entero o decimal)

            // hh:mm:ss(.sss)
            let result = regexFullTime.exec(time);
            if (result) {
                const [, hours, minutes, seconds, milliseconds] = result;
                let totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
                if (milliseconds) {
                    totalSeconds += parseFloat(milliseconds);
                }
                return { value: totalSeconds };
            }

            // hh:mm
            result = regexMinutes.exec(time);
            if (result) {
                const [, hours, minutes] = result;
                const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
                return { value: totalSeconds };
            }

            // segundos
            result = regexSeconds.exec(time);
            if (result) {
                return { value: parseFloat(result[0]) };
            }

            return {
                error: `Invalid time format. Use "hh:mm:ss.xxxx" "hh:mm:ss", "hh:mm", or seconds (e.g., "120" or "120.5").`,
            };
        }

        return { error: 'Time must be a string or number' };
    }
}
