# node builder image
FROM node:20-slim as builder 

# always good practice to upgrade our package manager index and upgrade all packages
RUN apt-get update && apt-get upgrade -y

# yarn is already installed in the node image, so no need to install it

# set the working directory to be /app (create it since it doesn't exist)
WORKDIR /app

# copy all our local files (this will be ran from the context provided when running docker build)
COPY . .

# install our dependencies 
RUN yarn install
# build the production react application
RUN yarn build

# create a new stage for our runtime image 
FROM python:3.11-slim-bookworm as runtime

# always good practice to upgrade our package manager index and upgrade all packages
RUN apt-get update && apt-get upgrade -y

# set the working directory to be /app (create it since it doesn't exist)
WORKDIR /app

# copy our requirements file
COPY requirements.txt .

# install our dependencies
RUN pip install -r requirements.txt

# copy over the api code
COPY api ./api

# copy over the build from our builder stage 
COPY --from=builder /app/build ./build

# expose port 8080 to the outside world
EXPOSE 8080

# run the fastapi application
ENTRYPOINT ["fastapi", "run", "api/main.py"]

# ensure that we're listening on all interfaces and port 8080
CMD ["--host", "0.0.0.0", "--port", "8080"]