import { AudioEntity, AudioType } from '../../domain/entities/audio.entity';
import { AudioProcessor } from '../../domain/interfaces/audio-processor';
import { AudioRepository } from '../../domain/repositories/audio.repository';
import { FileType } from '../../domain/interfaces/file-type';
import { FileSystemService } from '../../domain/interfaces/file-system.service';
import { audioMimeTypes } from '../../domain/constants/audio-mime-types';

type Props = {
    id: string;
    originalName: string;
    filePath: string;
    type: string;
};

export class UploadAudioUseCase {
    constructor(private audioProcessor: AudioProcessor, private fileSystemService: FileSystemService, private fileTypeService: FileType, private audioRepository: AudioRepository) {}

    public execute = async ({ filePath, id, originalName, type }: Props) => {
        const fileType = await this.fileTypeService.getFileType(filePath);

        if (!fileType) {
            await this.fileSystemService.deleteFile(filePath);
            throw new Error('No match for file type.');
        }

        if (!audioMimeTypes.includes(fileType.mime.split(';')[0])) {
            await this.fileSystemService.deleteFile(filePath);
            throw new Error('File type not supported.');
        }

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
