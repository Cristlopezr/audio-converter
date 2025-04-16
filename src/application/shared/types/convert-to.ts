type AudioProcessProps = {
    input?: string;
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
