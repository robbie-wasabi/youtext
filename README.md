# YouText

A simple open source api to extract and display YouTube transcripts in plain text.

## Why

Read succinct summaries of dialogue-heavy youtube videos like podcasts, documentaries, tutorials, news, etc...

(I wanted this myself)

## Tutorial

1. simply grab the youtube video id that you want to summarize

you can find this in the youtube video url:

```
                           here ↓↓↓↓↓↓↓↓↓↓↓
https://www.youtube.com/watch?v=L_Guz73e6fw&t=117s&ab_channel=LexFridman
```

or click the "share button"
```
            here ↓↓↓↓↓↓↓↓↓↓↓ 
https://youtu.be/L_Guz73e6fw
```

2. simply provide the video id after the youtext.io url

```bash
$ curl https://youtext.io/L_Guz73e6fw/interpretation

# specify view=1 to return the interpretation *only*
$ curl https://youtext.io/L_Guz73e6fw/interpretation?view=1
```

or for just the transcript

```bash
$ curl https://youtext.io/L_Guz73e6fw
```

## WIP

1. summaries of dialogues (with more than 1 speaker) have formatting inconsistencies and may be difficult to read. there is plenty of room for improvement here:
    [ ] split summary into paragraphs for better readability
    [ ] TODO
2. probably should have written this in typescript :/


## Contribution

Submit a PR!

## Development

_run your own instance locally_

### Architecture

NodeJS, express, OpenAI API, Firebase

### Setup

create .env and fill in values
```bash
$ cp .env.local .env
```

install deps
```bash
$ npm i
```

### Run

run with npm script
```bash
$ npm start
```

### Docker

run with docker
```bash
# build and run
$ docker build . -t rrossilli/youtext<version>
$ docker run -p 3000:3000 rrossilli/youtext<version>

# or with docker compose
$ docker-compose up --build
```

### Versioning

install bumpversion if you don't have it already
```bash
$ brew install bumpversion
```

incremement version using one of these (self explanatory)
```bash
$ make bumpversion-patch
$ make bumpversion-minor
$ make bumpversion-major
```