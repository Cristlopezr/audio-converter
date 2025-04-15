export const audioMimeTypes = [
    'audio/mpeg', // .mp3
    'audio/wav', // .wav
    'audio/x-wav', // también .wav
    'audio/ogg', // .ogg
    'audio/mp4', // .m4a
    'audio/x-aac', // .aac
    'audio/flac', // .flac
    'audio/webm', // .webm
];

export const audioExtensionToMimeTypeMap: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    aac: 'audio/x-aac',
    flac: 'audio/flac',
    webm: 'audio/webm',
};
