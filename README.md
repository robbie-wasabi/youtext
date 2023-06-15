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

## TODOs:

1. figure out the correct output for any transcript input, is a summary sufficient or an outline or something else?
2. automatic youtube video commenting
3. our prompt has bugs sometimes, revise this potentially.
4. etc... anything else you want