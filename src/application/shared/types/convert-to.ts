import Ffmpeg from 'fluent-ffmpeg';
import Stream from 'stream';

export type ConverToProps = {
    input?: string | Stream.Readable;
    options?: Ffmpeg.FfmpegCommandOptions;
    convertTo: string;
    output: string;
    onEnd: (stdout: string | null, stderr: string | null) => void;
    onError: (error: Error, stdout: string | null, stderr: string | null) => void;
};
