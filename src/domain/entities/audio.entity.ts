export enum AudioType {
    converted = 'CONVERTED',
    original = 'ORIGINAL',
    trimmed = 'TRIMMED',
}

type Options = {
    id: string;
    originalName: string;
    originalNameWithOutExt: string;
    duration: number;
    extLongName: string;
    bitRate: number;
    ext: string;
    mimetype: string;
    size: number;
    type: AudioType;
    originalId?: string;
    createdAt?: Date;
};

export class AudioEntity {
    public id: string;
    public originalName: string;
    public originalNameWithOutExt: string;
    public duration: number;
    public extLongName: string;
    public bitRate: number;
    public ext: string;
    public mimetype: string;
    public size: number;
    public type: AudioType;
    public originalId?: string;
    public createdAt?: Date;

    constructor(props: Options) {
        this.bitRate = props.bitRate;
        this.createdAt = props.createdAt;
        this.duration = props.duration;
        this.ext = props.ext;
        this.extLongName = props.extLongName;
        this.id = props.id;
        this.mimetype = props.mimetype;
        this.originalId = props.originalId;
        this.originalName = props.originalName;
        this.originalNameWithOutExt = props.originalNameWithOutExt;
        this.size = props.size;
        this.type = props.type;
    }

    static fromJson(props: { [key: string]: any }) {
        const { id, originalName, originalNameWithOutExt, duration, extLongName, bitRate, ext, mimetype, size, type, originalId, createdAt } = props;
        return new AudioEntity({ id, originalName, originalNameWithOutExt, duration, extLongName, bitRate, ext, mimetype, size, type, originalId, createdAt });
    }
}
