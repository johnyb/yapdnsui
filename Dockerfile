FROM node:6
MAINTAINER Julian Bäume <julian@svg4all.de>

# Install `yapdnsui` from git
RUN mkdir /app && \
  cd /app && \
  mkdir /app/yapdnsui
  #git clone https://github.com/johnyb/yapdnsui

# Define working directory.
WORKDIR /app/yapdnsui

RUN yarn --production

COPY ["startup.sh", "/app/startup.sh"]
RUN chmod +x /app/startup.sh

# Define default command.
# Start ssh and other services.
ENTRYPOINT ["/app/startup.sh"]
CMD ["start"]

# Expose ports.
EXPOSE 8080
