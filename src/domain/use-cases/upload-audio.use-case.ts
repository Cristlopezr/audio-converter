import { AudioEntity, AudioType } from '../entities/audio.entity';
import { AudioProcessor } from '../interfaces/audio-processor';
import { AudioRepository } from '../repositories/audio.repository';

type Props = {
    id: string;
    originalName: string;
    originalNameWithOutExt: string;
    filePath: string;
    mimetype: string;
    type: string;
};

export class UploadAudioUseCase {
    constructor(private audioProcessor: AudioProcessor, private audioRepository: AudioRepository) {}

    public execute = async ({ filePath, id, originalName, originalNameWithOutExt, mimetype, type }: Props) => {
        const { format, format_long_name, duration, size, bit_rate } = await this.audioProcessor.checkAudioMetadata(filePath);

        const newAudio = {
            id,
            originalName,
            originalNameWithOutExt,
            mimetype,
            ext: format,
            extLongName: format_long_name,
            duration,
            size,
            bitRate: bit_rate,
        };

        return this.audioRepository.saveAudio(new AudioEntity({ ...newAudio, type: type as AudioType }));
    };
}
