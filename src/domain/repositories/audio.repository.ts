import { AudioEntity } from '../entities/audio.entity';

export abstract class AudioRepository {
    abstract saveAudio(audio: AudioEntity): Promise<AudioEntity>;
    abstract getAudioById(id:string): Promise<AudioEntity>;
    abstract getAllAudios(): Promise<AudioEntity[]>;
}
