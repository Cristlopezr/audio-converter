FROM node:22.14.0

RUN apt update
RUN apt install -y ffmpeg

WORKDIR /app