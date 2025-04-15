import { AudioDatasource } from '../../domain/datasources/audio.datasource';
import { AudioEntity } from '../../domain/entities/audio.entity';
import { AudioRepository } from '../../domain/repositories/audio.repository';

export class AudioRepositoryImpl implements AudioRepository {
    constructor(private audioDatasource: AudioDatasource) {}

    saveAudio(audio: AudioEntity): Promise<AudioEntity> {
        return this.audioDatasource.saveAudio(audio);
    }
    getAudioById(id: string): Promise<AudioEntity> {
        return this.audioDatasource.getAudioById(id);
    }
    getAllAudios(): Promise<AudioEntity[]> {
        throw new Error('Method not implemented.');
    }
}
