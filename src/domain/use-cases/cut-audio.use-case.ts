import { CutAudioProps } from '../../application/shared/types/convert-to';
import { AudioProcessor } from '../interfaces/audio-processor';

export class CutAudioUseCase {
    constructor(private audioProcessor: AudioProcessor) {}

    public execute = async (props: CutAudioProps) => {
        this.audioProcessor.cutAudio({ ...props });
    };
}
