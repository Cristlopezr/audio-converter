import { AudioEntity } from '../../domain/entities/audio.entity';

type Options = {
    id: string;
    name: string;
    nameWithOutExt: string;
    duration: number;
    ext: string;
    mimetype: string;
    size: number;
};

export class AudioDto {
    public id: string;
    public name: string;
    public nameWithOutExt: string;
    public duration: number;
    public ext: string;
    public mimetype: string;
    public size: number;

    constructor(props: Options) {
        this.duration = props.duration;
        this.ext = props.ext;
        this.id = props.id;
        this.mimetype = props.mimetype;
        this.name = props.name;
        this.nameWithOutExt = props.nameWithOutExt;
        this.size = props.size;
    }

    public static fromEntity = (audio: AudioEntity): AudioDto => {
        return new AudioDto({
            id: audio.id,
            ext: audio.ext,
            duration: audio.duration,
            mimetype: audio.mimetype,
            name: audio.originalName,
            nameWithOutExt: audio.originalNameWithOutExt,
            size: audio.size,
        });
    };
}
