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


## Install on DockerHub
TODO

## Run Container 
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

