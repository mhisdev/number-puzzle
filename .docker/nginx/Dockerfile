FROM nginx:1.25-bookworm

# Nginx default config 
COPY .docker/nginx/default.conf  /etc/nginx/conf.d/default.conf

# Dependencies required to install NodeJS
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg

# Install Node
ENV NODE_MAJOR=20
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get  install nodejs -y

# Update NPM
RUN npm install -g npm@latest

WORKDIR /usr/share/nginx
