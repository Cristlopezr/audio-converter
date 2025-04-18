import { audioExtensionToMimeTypeMap } from '../../domain/constants/audio-mime-types';
import { AudioEntity, AudioType } from '../../domain/entities/audio.entity';
import { AudioProcessor } from '../../domain/services/audio-processor';
import { FileSystemService } from '../../domain/services/file-system.service';
import { AudioRepository } from '../../domain/repositories/audio.repository';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../../domain/errors/custom-error';

export interface TrimAudioUseCase {
    execute(id: string, startTime: number, duration: number): Promise<AudioEntity>;
}

export class TrimAudio implements TrimAudioUseCase {
    private epsilon: number = 0.05;

    constructor(
        private audioProcessor: AudioProcessor,
        private fileSystemService: FileSystemService,
        private audioRepository: AudioRepository
    ) {}

    public execute = async (id: string, startTime: number, duration: number) => {
        const foundAudio = await this.audioRepository.getAudioById(id);

        if (startTime + this.epsilon > foundAudio.duration)
            throw CustomError.badRequest('Invalid startTime it must be at least 50ms before the end of the audio');

        //TODO:validate that duration does not exceeds audio length

        const originalFilePath = this.fileSystemService.getUploadPath(foundAudio.id, foundAudio.originalName);
        await this.fileSystemService.fileExists(originalFilePath);

        const newAudioId = uuidv4();

        const outputDir = this.fileSystemService.getConversionPath(foundAudio.id, newAudioId);
        await this.fileSystemService.createDirectory(outputDir);

        const outputPath = this.fileSystemService.createOutputPath(
            outputDir,
            foundAudio.originalNameWithOutExt,
            foundAudio.ext
        );

        return new Promise<AudioEntity>(async (resolve, reject) => {
            this.audioProcessor.cutAudio({
                duration,
                startTime,
                input: originalFilePath,
                output: outputPath,
                onEnd: async () => {
                    try {
                        const metadata = await this.audioProcessor.checkAudioMetadata(outputPath);
                        const audio = await this.audioRepository.saveAudio(
                            new AudioEntity({
                                id: newAudioId,
                                ext: metadata.format,
                                mimetype: audioExtensionToMimeTypeMap[metadata.format],
                                originalName: `${foundAudio.originalName}`,
                                originalNameWithOutExt: foundAudio.originalNameWithOutExt,
                                size: metadata.size,
                                type: 'TRIMMED' as AudioType,
                                originalId: foundAudio.id,
                                extLongName: metadata.format_long_name,
                                duration: metadata.duration,
                                bitRate: metadata.bit_rate,
                            })
                        );
                        resolve(audio);
                    } catch (error) {
                        console.log(error);
                        reject(error);
                    }
                },
                onError: (error, stdout, stderr) => {
                    /*  console.log({ error: error.message }); */
                    reject(error);
                },
            });
        });
    };
}
