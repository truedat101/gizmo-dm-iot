# Overview

This is the quick and dirty backend

## Attributions

### node-jwt-authentication-api

Node.js + Express 4 - JWT Authentication API

Documentation at https://jasonwatmore.com/nodejs-jwt-authentication-tutorial-with-example-api

Original Source: https://github.com/cornflourblue/node-jwt-authentication-api

## Build

- use node v18
- pnpm install .

## Docker

### Build

docker build -t gizmo-api -f Dockerfile

### Run

Note: copy the json files into place.  This ensures you don't lose data between restarts.

docker run -itd -v $(pwd)/config.json:/opt/gizmo-api/config-debug -v $(pwd)/gizmobits.json:/opt/gizmo-api/gizmodevices.json:ro  --init -p 3000:3000 --name my-gizmoapi 



