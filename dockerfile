# Run master in docker container
# build with > sudo docker build --force-rm --tag clusterio:master --no-cache factorioClusterio/
# run with > sudo docker run -it -p 8080:8080 --rm --name clusterioMasterTemp clusterio:master node factorioClusterio/master.js
FROM node:latest
# NO SUDO!
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - && apt install -y git nodejs && git clone https://github.com/Danielv123/factorioClusterio.git && cd factorioClusterio && npm install && curl -o factorio.tar.gz -L https://www.factorio.com/get-download/latest/headless/linux64 && tar -xvzf factorio.tar.gz
EXPOSE 8080
WORKDIR /factorioClusterio/
CMD node master.js
