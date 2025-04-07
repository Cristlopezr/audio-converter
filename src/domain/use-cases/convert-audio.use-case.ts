import { ConverToProps } from '../../application/shared/types/convert-to';
import { AudioProcessor } from '../interfaces/audio-processor';

export class ConvertAudioUseCase {
    constructor(private audioProcessor: AudioProcessor) {}

    public execute = (props: ConverToProps) => {
        this.audioProcessor.convertTo({ ...props });
    };
}
