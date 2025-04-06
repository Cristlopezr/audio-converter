import ffmpeg from 'fluent-ffmpeg';
import Stream from 'stream';

type converToProps = {
    input?: string | Stream.Readable;
    options?: ffmpeg.FfmpegCommandOptions;
    convertTo: string;
    output: string;
    onEnd: (stdout: string | null, stderr: string | null) => void;
    onError: (error: Error, stdout: string | null, stderr: string | null) => void;
};

export const convertTo = ({ input, convertTo, output, onEnd, onError, options }: converToProps): ffmpeg.FfmpegCommand => {
    return ffmpeg(input, options).toFormat(convertTo).on('end', onEnd).on('error', onError).save(output);
};
