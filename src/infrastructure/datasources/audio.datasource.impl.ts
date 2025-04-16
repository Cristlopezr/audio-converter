import { AudioDatasource } from '../../domain/datasources/audio.datasource';
import { AudioEntity } from '../../domain/entities/audio.entity';
import { prisma } from '../../data/postgres/prisma-client';

export class AudioDatasourceImpl implements AudioDatasource {
    async saveAudio(newAudio: AudioEntity): Promise<AudioEntity> {
        const audio = await prisma.audio.create({
            data: newAudio,
        });

        return AudioEntity.fromJson(audio);
    }
    async getAudioById(id: string): Promise<AudioEntity> {
        const foundAudio = await prisma.audio.findFirst({
            where: {
                id,
            },
        });

        if (!foundAudio) {
            throw new Error('Audio not found');
        }

        return AudioEntity.fromJson(foundAudio);
    }
    getAllAudios(): Promise<AudioEntity[]> {
        throw new Error('Method not implemented.');
    }
}
