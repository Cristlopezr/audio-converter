import Ffmpeg from 'fluent-ffmpeg';
import Stream from 'stream';

type AudioProcessProps = {
    input?: string | Stream.Readable;
    options?: Ffmpeg.FfmpegCommandOptions;
    output: string;
    onEnd: (stdout: string | null, stderr: string | null) => void;
    onError: (error: Error, stdout: string | null, stderr: string | null) => void;
};

export type ConverToProps = {
    convertTo: string;
} & AudioProcessProps;

export type CutAudioProps = {
    startTime: string | number;
    duration: string | number;
} & AudioProcessProps;
