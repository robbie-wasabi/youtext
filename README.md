# YouText

Simple extract and display YouTube transcripts in plain text.

## Why

Read dialogue-heavy youtube videos like podcasts and documentaries.

## Development

```bash
# install deps
$ npm i

# run client
$ npm start
```

docker

```bash
$ docker build . -t rrossilli/youtext<version>
$ docker run -p 3000:3000 rrossilli/youtext<version>
```

docker compose

```bash
$ docker-compose up --build
```

## How

1. Identify the video URL. It can be in one of these formats:

https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID

2. Append the video id

https://youtext.io/VIDEO_ID

## Future

1. Use AI to fix gramatical errors in transcript
2. Use AI to summarize transcript
3. Can we answer the thumbnail?