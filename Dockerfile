FROM node:6
MAINTAINER Julian Bäume <julian@svg4all.de>

COPY . /tmp

RUN cd /tmp && yarn --cache-folder=/tmp/yarn-cache &&\
  yarn build &&\
  mkdir -p /app/yapdnsui &&\
  cp -r dist middleware bin startup.sh package.json yarn.lock /app/yapdnsui &&\
  chmod +x /app/yapdnsui/startup.sh &&\
  cd /app/yapdnsui &&\
  yarn --production --cache-folder=/tmp/yarn-cache &&\
  rm -rf /tmp/*

# Define working directory.
WORKDIR /app/yapdnsui

# Define default command.
# Start ssh and other services.
ENTRYPOINT ["/app/yapdnsui/startup.sh"]
CMD ["start"]

# Expose ports.
EXPOSE 8080
