import ffmpeg from 'fluent-ffmpeg';
import { ConverToProps } from '../../application/shared/types/convert-to';
import { AudioProcessor } from '../../domain/interfaces/audio-processor';

export class FfmpegAdapter implements AudioProcessor {
    public convertTo = ({ input, convertTo, output, onEnd, onError, options }: ConverToProps) => {
        ffmpeg(input, options).toFormat(convertTo).on('end', onEnd).on('error', onError).save(output);
    };
}
