FROM node:6
MAINTAINER Julian Bäume <julian@svg4all.de>

# Add app directory
RUN mkdir /app

# Install `yapdnsui` from git
RUN cd /app && \
  git clone https://github.com/johnyb/yapdnsui

# Define working directory.
WORKDIR /app/yapdnsui

RUN \
  npm i --silent -g grunt-cli nodemon &&\
  npm install --silent --production --unsafe-perm

COPY ["startup.sh", "/app/startup.sh"]
RUN chmod +x /app/startup.sh

# Define default command.
# Start ssh and other services.
ENTRYPOINT ["/app/startup.sh"]
CMD ["start"]

# Expose ports.
EXPOSE 8080
