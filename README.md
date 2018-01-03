# FsocietyEAD
Open source LMS for Fsociety Brasil

## Documentation: 

### Running application in development environment

Assuming you have:
  * Docker installed
  * Docker Compose Installed

#### Hands-on

##### Building the application

To build the application in Docker compose environment, you should have the last version of the application. Then, inside the project root, run the following command

`$ docker-compose build`

It will build the project image

```
$ docker images | grep fsoc
fsocietyead_fsead_app                         latest              0519b50d4962        About a minute ago   1.01GB
```

##### Running the application

After build the project image, you will be able to start the application running the command below

`$ docker-compose up`

It will pull the mongoDB image, creates a volume to mongoDB, creates the containers  and a network between the containers

```
Pulling db (mongo:latest)...
latest: Pulling from library/mongo
c4bb02b17bb4: Pull complete
3f58e3bb3be4: Pull complete
a229fb575a6e: Pull complete
8f5ddc533743: Pull complete
5e9d2af6e206: Pull complete
3b6c28c0235b: Pull complete
fd6b165aa317: Pull complete
772467f0b4cd: Pull complete
a94d919fbb86: Pull complete
b0cad17917cd: Pull complete
Digest: sha256:c78f6debfb5b10fe2ed390105a729123f3365a33e5aada6f5539922d1d7c75dc
Status: Downloaded newer image for mongo:latest
Creating mongodb ...
Creating mongodb ... done
Creating fsocietyEAD_app ...
Creating fsocietyEAD_app ... done
Attaching to mongodb, fsocietyEAD_app
fsocietyEAD_app | the options [useMongoClient] is not supported
fsocietyEAD_app | UP And Running!
fsocietyEAD_app | MongoDB Connected...
```

##### Doing both steps above in only one command

You can build and run the project using the following command/flag

`docker-compose up --build`

You will see both commands outputs at the same time

```
Pulling db (mongo:latest)...
latest: Pulling from library/mongo
c4bb02b17bb4: Pull complete
3f58e3bb3be4: Pull complete
a229fb575a6e: Pull complete
8f5ddc533743: Pull complete
5e9d2af6e206: Pull complete
3b6c28c0235b: Pull complete
fd6b165aa317: Pull complete
772467f0b4cd: Pull complete
a94d919fbb86: Pull complete
b0cad17917cd: Pull complete
Digest: sha256:c78f6debfb5b10fe2ed390105a729123f3365a33e5aada6f5539922d1d7c75dc
Status: Downloaded newer image for mongo:latest
Building fsead_app
Step 1/6 : FROM node
 ---> 3d1823068e39
Step 2/6 : RUN mkdir fsead
 ---> Using cache
 ---> 87bbeb753ec9
Step 3/6 : WORKDIR fsead
 ---> Using cache
 ---> e5e71defb8f0
Step 4/6 : COPY . .
 ---> 1629f0692e7c
Step 5/6 : RUN rm -f package-lock.json
 ---> Running in 20cc8010c3a9
 ---> 7f1e1d212150
Removing intermediate container 20cc8010c3a9
Step 6/6 : RUN npm install
 ---> Running in 73dd07b7e108
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN fsocietylms@1.0.0 No repository field.

removed 1 package in 0.781s
 ---> 5434133e0ed6
Removing intermediate container 73dd07b7e108
Successfully built 5434133e0ed6
Successfully tagged fsocietyead_fsead_app:latest
Creating mongodb ...
Creating mongodb ... done
Creating fsocietyEAD_app ...
Creating fsocietyEAD_app ... done
Attaching to mongodb, fsocietyEAD_app
fsocietyEAD_app | the options [useMongoClient] is not supported
fsocietyEAD_app | UP And Running!
fsocietyEAD_app | MongoDB Connected...
```

##### Browsing the project

After that, you can access the FScociety EAD project using the [http://localhost:3098](http://localhost:3098)

>Important: If you want change the port, you should change it in app.js and docker-compose.yaml files. In a close future we will start it over environment variables.

## Project Stack, (MEAN): 

  #### Node
  #### Express
  #### Mongoose
  ### Angular 4.X (Em breve)

