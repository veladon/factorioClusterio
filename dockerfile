# Run master in docker container
# build with > docker build -t clusterioMaster .
# run with > docker run -it -P --rm --name clusterioMasterTemp clusterioMaster
FROM node:latest
RUN sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && sudo apt install -y git nodejs && git clone https://github.com/Danielv123/factorioClusterio.git && cd factorioClusterio && npm install && curl -o factorio.tar.gz -L https://www.factorio.com/get-download/latest/headless/linux64 && tar -xvzf factorio.tar.gz
EXPOSE 8080
