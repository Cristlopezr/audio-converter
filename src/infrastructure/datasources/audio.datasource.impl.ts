import { AudioDatasource } from '../../domain/datasources/audio.datasource';
import { AudioEntity } from '../../domain/entities/audio.entity';
import { prisma } from '../../lib/prisma-client';

export class AudioDatasourceImpl implements AudioDatasource {
    async saveAudio(newAudio: AudioEntity): Promise<AudioEntity> {
        try {
            const audio = await prisma.audio.create({
                data: newAudio,
            });

            return AudioEntity.fromJson(audio);
        } catch (error) {
            console.log(error);
            throw new Error('An error has ocurred saving audio info');
        }
    }
    async getAudioById(id: string): Promise<AudioEntity> {
        try {
            const foundAudio = await prisma.audio.findFirst({
                where: {
                    id,
                },
            });

            if (!foundAudio) {
                throw new Error('Audio not found');
            }

            return AudioEntity.fromJson(foundAudio);
        } catch (error) {
            console.log(error);
            throw new Error('An error has ocurred getting audio info');
        }
    }
    getAllAudios(): Promise<AudioEntity[]> {
        throw new Error('Method not implemented.');
    }
}
