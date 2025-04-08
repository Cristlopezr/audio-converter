import { ConverToProps, CutAudioProps } from '../../application/shared/types/convert-to';

export interface AudioProcessor {
    convertTo: (props: ConverToProps) => void;
    cutAudio: (props: CutAudioProps) => void;
    checkAudioDuration: (filePath: string) => Promise<number>;
}
