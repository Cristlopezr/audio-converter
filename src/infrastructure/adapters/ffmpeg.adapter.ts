import ffmpeg from 'fluent-ffmpeg';
import { ConverToProps, CutAudioProps } from '../../application/shared/types/convert-to';
import { AudioMetadata, AudioProcessor } from '../../domain/services/audio-processor';

export class FfmpegAdapter implements AudioProcessor {
    public convertTo = ({ input, convertTo, output, onEnd, onError }: ConverToProps) => {
        ffmpeg(input).toFormat(convertTo).on('end', onEnd).on('error', onError).save(output);
    };

    public cutAudio = ({ duration, startTime, onEnd, onError, output, input }: CutAudioProps) => {
        ffmpeg(input).setStartTime(startTime).setDuration(duration).on('end', onEnd).on('error', onError).save(output);
    };

    public checkAudioMetadata = async (filePath: string): Promise<AudioMetadata> => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) return reject('Something went wrong');

                const { format } = metadata;
                resolve({
                    bit_rate: format.bit_rate ?? 0,
                    duration: format.duration ?? 0,
                    format: format.format_name ?? '',
                    format_long_name: format.format_long_name ?? '',
                    size: format.size ?? 0,
                });
            });
        });
    };
}
