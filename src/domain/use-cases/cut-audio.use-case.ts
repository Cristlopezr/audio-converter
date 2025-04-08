import { CutAudioProps } from '../../application/shared/types/convert-to';
import { AudioProcessor } from '../interfaces/audio-processor';

export class CutAudioUseCase {
    constructor(private audioProcessor: AudioProcessor) {}

    public execute = async (props: CutAudioProps) => {
        let duration: string | number = 0;
        try {
            duration = props.duration || (await this.audioProcessor.checkAudioDuration(props.input as string));
        } catch (error) {
            console.log(error);
        }

        this.audioProcessor.cutAudio({ ...props, duration: duration });
    };
}
