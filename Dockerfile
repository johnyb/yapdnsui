FROM node:5.5
MAINTAINER Francois Lacroix <xbgmsharp@gmail.com>

# Add app directory
RUN mkdir /app

# Install `yapdnsui` from git
RUN cd /app && \
  git clone https://github.com/xbgmsharp/yapdnsui

# Define working directory.
WORKDIR /app/yapdnsui

RUN \
  npm i --silent -g bower nodemon &&\
  npm install --silent --production --unsafe-perm && \
  bower --silent --allow-root install

COPY ["startup.sh", "/app/startup.sh"]
RUN chmod +x /app/startup.sh

# Define default command.
# Start ssh and other services.
ENTRYPOINT ["/app/startup.sh"]
CMD ["start"]

# Expose ports.
EXPOSE 8080
