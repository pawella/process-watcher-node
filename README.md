# pawella/process-watcher-node
Hub do udostępniania danych oraz stanów procesów aplikacji.

## Install on GitHub
**Get Source**
```shell
git clone https://github.com/pawella/process-watcher-node && cd process-watcher-node
```
**Make Docker Image**
```shell
docker build -t pawella/process-watcher-node .
```

## Run application in console
```shell
npm install 
```
```shell
cd src 
```
```shell
npm app.js 
```

## Install on DockerHub
TODO

## Run as Docker Container 
**Run Default**
```shell
docker run -p 9999:8822 pawella/process-watcher-node .
```
**Run and share source**
```shell
docker run -p 8888:8822 pawella/process-watcher-node -v /my/local-prject-path:/home/node/app
```
**Run in Windows (use image ID)**
```shell
docker run -p 8888:8822 {YouProcessID} 
```
## Examples

Register information in hub.

```http request
POST  http://localhost:8822/api/{{instance}}/item
Content-Type: application/json

{
  "id": 999,
  "value": "content",
  "owner": "{{owner}}"
  "data": {
    "time": {{$timestamp}},
  }
}
```

**Get** information **from instance**.

```http request
GET  http://localhost:8822/api/{{instance}}/items
Content-Type: application/json
```

**Get** information **from owner**.

```http request
GET  http://localhost:8822/owner/{{owner}}/items
Content-Type: application/json
```

**Get** information **from owner and instance**.

```http request
GET  http://localhost:8822/owner/{{owner}}/{{insance}}/items
Content-Type: application/json
```

**Remove** item

```http request
DELETE  http://localhost:8822/api/{{instance}}/item
Content-Type: application/json

{
  "id": 999
}
```