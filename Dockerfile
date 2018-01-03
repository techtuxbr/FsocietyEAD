FROM node

#Adding application root
RUN mkdir fsead
WORKDIR fsead

#Copying all files and removing package-lock
COPY . .
RUN rm -f package-lock.json

# Installing all packages
RUN npm install 
