import ffmpeg from 'fluent-ffmpeg';
import { ConverToProps, CutAudioProps } from '../../application/shared/types/convert-to';
import { AudioProcessor } from '../../domain/interfaces/audio-processor';

export class FfmpegAdapter implements AudioProcessor {
    public convertTo = ({ input, convertTo, output, onEnd, onError, options }: ConverToProps) => {
        ffmpeg(input, options).toFormat(convertTo).on('end', onEnd).on('error', onError).save(output);
    };

    public cutAudio = ({ duration, startTime, onEnd, onError, output, input, options }: CutAudioProps) => {
        ffmpeg(input, options).setStartTime(startTime).setDuration(duration).on('end', onEnd).on('error', onError).save(output);
    };

    public checkAudioDuration = async (filePath: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) return reject(`Error al obtener metadata:, ${err}`);
                resolve(metadata.format.duration ?? 0);
            });
        });
    };
}
