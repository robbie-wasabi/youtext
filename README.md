# YouText

Read succinct AI-interpreted summaries of dialogue-heavy youtube videos like podcasts, documentaries, tutorials, news, etc...

## Why

Today, a vast portion of essential content and discourse is disseminated via online videos. While videos, including lectures and podcasts, offer an engaging medium, they often don't match the efficiency of reading. YouText aims to bridge this gap, providing users with a more streamlined method to absorb this information.

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
    a. split summary into paragraphs for better readability
    b. TODO
2. probably should have written this in typescript :/
3. detect and omit ads

## Contribution

Submit a PR!

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

### K8s

deploy to kubernetes cluster
```bash
$ kubectl apply -f k8s/deploy.<environment>.yml
```