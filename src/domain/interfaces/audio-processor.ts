import { ConverToProps, CutAudioProps } from '../../application/shared/types/convert-to';

export type AudioMetadata = {
    format: string;
    format_long_name: string;
    duration: number;
    size: number;
    bit_rate: number;
};

export interface AudioProcessor {
    convertTo: (props: ConverToProps) => void;
    cutAudio: (props: CutAudioProps) => void;
    checkAudioMetadata: (filePath: string) => Promise<AudioMetadata>;
}
