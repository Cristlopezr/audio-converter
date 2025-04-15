import { AudioEntity } from '../entities/audio.entity';

export abstract class AudioDatasource {
    abstract saveAudio(audio: AudioEntity): Promise<AudioEntity>;
    abstract getAudioById(id: string): Promise<AudioEntity>;
    abstract getAllAudios(): Promise<AudioEntity[]>;
}
