import { AudioEntity, AudioType } from '../../domain/entities/audio.entity';
import { AudioProcessor } from '../../domain/services/audio-processor';
import { AudioRepository } from '../../domain/repositories/audio.repository';
import { FileChecker } from '../../domain/services/file-checker';
import { FileSystemService } from '../../domain/services/file-system.service';

export interface UploadAudioUseCase {
    execute(id: string, originalName: string, filePath: string, type: string): Promise<AudioEntity>;
}

export class UploadAudio implements UploadAudioUseCase {
    constructor(private audioProcessor: AudioProcessor, private fileSystemService: FileSystemService, private fileCheckerService: FileChecker, private audioRepository: AudioRepository) {}

    public execute = async (id: string, originalName: string, filePath: string, type: string) => {
        const fileType = await this.fileCheckerService.getFileType(filePath);

        this.fileCheckerService.checkMimetype(fileType.mime);

        const originalNameWithOutExt = this.fileSystemService.getOriginalNameWithOutExt(originalName, fileType.ext);

        const { format, format_long_name, duration, size, bit_rate } = await this.audioProcessor.checkAudioMetadata(filePath);

        const newAudio = {
            id,
            originalName,
            originalNameWithOutExt,
            mimetype: fileType.mime,
            ext: format,
            extLongName: format_long_name,
            duration,
            size,
            bitRate: bit_rate,
        };

        return this.audioRepository.saveAudio(new AudioEntity({ ...newAudio, type: type as AudioType }));
    };
}
