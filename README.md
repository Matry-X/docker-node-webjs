# docker-node-webjs
[nezha agent 1.*](https://github.com/nezhahq/agent) + [node webjs](https://github.com/Matry-X/Xray-core) + [cloudflare tunnel](https://github.com/cloudflare/cloudflared)

**still on testing**

## Demo

![demo](https://pic.2rmz.com/1734947847381.png)

**NOTICE**

> ONLY support x64 platform  
> download required applications while build  
> if you have any nice idea, please ISSUE  

## HOW TO USE

### build

```bash
git clone https://github.com/Matry-X/docker-node-webjs.git
cd docker-node-webjs
docker build -t your-tag .
```

### run

variables
```env
# required
ARGO_DOMAIN='test.example.com'
ARGO_TOKEN='ey****J9'
CLIENT_HOST='nezha.example.com'
CLIENT_SECRET='zk****ol'
# optional
WSPATH='argo'
WEB_USERNAME='admin'
WEB_PASSWORD='password'
UUID='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
```

run in docker
```bash
docker run -d \
  -e ARGO_DOMAIN="test.example.com" \
  -e ARGO_TOKEN="ey****J9" \
  -e CLIENT_HOST='nezha.example.com' \
  -e CLIENT_SECRET='zk****ol' \
  -e WSPATH='argo' \
  -e WEB_USERNAME='admin' \
  -e WEB_PASSWORD='password' \
  -e UUID='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' \
  --name "webjs" \
  your-tag:latest
```

## INSPIRATION

[nezhahq/nezha](https://github.com/nezhahq/nezha)  
[nezhahq/agent](https://github.com/nezhahq/agent)  
[fscarmen2/Argo-X-Container-PaaS](https://github.com/fscarmen2/Argo-X-Container-PaaS)  
[fscarmen2/Argo-Nezha-Service-Container](https://github.com/fscarmen2/Argo-Nezha-Service-Container)  
