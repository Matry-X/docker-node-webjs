FROM node:latest

WORKDIR /app

RUN apt-get update && \
    apt-get install -y iproute2 sed supervisor unzip uuid-runtime wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN wget -q https://github.com/cloudflare/cloudflared/releases/download/2024.12.2/cloudflared-linux-amd64 && \
    mv cloudflared-linux-amd64 cloudflared && \
    wget -q https://github.com/nezhahq/agent/releases/download/v1.2.0/nezha-agent_linux_amd64.zip && \
    unzip nezha-agent_linux_amd64.zip && rm nezha-agent_linux_amd64.zip && mv nezha-agent agent

COPY package.json .

RUN npm install -r package.json && \
    npm cache clean --force

COPY . .

RUN chmod +x cloudflared entrypoint.sh web.js

EXPOSE 3000

ENTRYPOINT [ "node", "server.js" ]
