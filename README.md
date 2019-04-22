# socket.io-chat

![Imgur](https://i.imgur.com/slOEQIc.png)

A chat application made with socket.io

You can create a simple chat server with this project

## how to run

### local environment
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

## demo site

https://socket-chat-lastgleam.herokuapp.com/


## how to use

First, you access to the path. (e.g., localhost:3000)

Choose the chatroom on chatroom list of the top page.

If there is no room created, you can create new chatroom by clicking 'creat a room' button.

Once you get into the create page, input your name as the following message prompt appears.

Then you can chat with anyone who access the same chatroom. 



Now, feel free to chat :D!



