import { Request, Response } from 'express';

const express = require('express');
const app = express();
const ffmpeg = require('fluent-ffmpeg');

const command = ffmpeg('./assets/audios/que-pasa.oga');

app.get('/', (req: Request, res: Response) => {
    command.ffprobe(function (err: any, metadata: any) {
        if (err) {
            res.json({
                err,
            });
            console.error('Error:', err);
            return;
        } else {
            res.json({
                test: 'reload',
                /*        metadata, */
            });
            console.log('2');
            console.log('Metadata:', 'test');
            return;
        }
    });
});

console.log("asd")

app.listen(3000, () => {
    console.log('App running');
});
