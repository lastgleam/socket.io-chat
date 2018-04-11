# socket.io-sandbox
A sandbox for socket.io

You can create a simple chat server with this project

## how to execute

### local
```
node index.js
```
### docker

the default Node.js version of this project is 'carbon' (Node.js 8.x LTS version)

If you want to change the version, you should edit the first line which starts from `FROM` of the `Dockerfile`

> e.g., `FROM node:carbon` to `FROM node:boron`

and you can also find the tag name of another Node.js version from [Dockerhub](https://hub.docker.com/_/node/)

```
docker build -t <your_name>/socket.io-sandbox  .
docker run -d -p <your port>:30000 <your_name>/socket.io-sandbox
```

## how to use

first, access to the path (default path is `localhost:30000`)

and enter the chatroom via chatroom list of the top page.

if thre are no rooms created, you should create new chatroom `create a room` button 

next, input your name as following message prompt.

finally, you can chat with someone who already entered the same chatroom.




