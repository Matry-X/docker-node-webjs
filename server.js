
const username = process.env.WEB_USERNAME || "admin";
const password = process.env.WEB_PASSWORD || "password";
const port = process.env.PORT || 3000;

const express = require("express");
const app = express();

const os = require("os");
const auth = require("basic-auth");
const { legacyCreateProxyMiddleware } = require("http-proxy-middleware");

var exec = require("child_process").exec;
var path = require("path");

// static
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
  //res.status(200).send("hello world");
  res.redirect('/index.html')
});

// 页面访问密码
app.use((req, res, next) => {
  const user = auth(req);
  if (user && user.name === username && user.pass === password) {
    return next();
  }
  res.set("WWW-Authenticate", 'Basic realm="Node"');
  return res.status(401).send();
});

//获取系统进程表
app.get("/status", function (req, res) {
  let cmdStr = "pm2 list; ps -ef";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>获取守护进程和系统进程表：\n" + stdout + "</pre>");
    }
  });
});

//获取系统监听端口
app.get("/listen", function (req, res) {
    let cmdStr = "ss -nltp";
    exec(cmdStr, function (err, stdout, stderr) {
      if (err) {
        res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
      } else {
        res.type("html").send("<pre>获取系统监听端口：\n" + stdout + "</pre>");
      }
    });
  });

//获取节点数据
app.get("/list", function (req, res) {
    let cmdStr = "cat data/clash.yml";
    exec(cmdStr, function (err, stdout, stderr) {
      if (err) {
        res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
      }
      else {
        res.type("html").send("<pre>节点数据：\n\n" + stdout + "</pre>");
      }
    });
  });

//获取系统版本、内存信息
app.get("/info", function (req, res) {
  let cmdStr = "cat /etc/*release | grep -E ^NAME";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("命令行执行错误：" + err);
    }
    else {
      res.send(
        "命令行执行结果：\n" +
          "Linux System:" +
          stdout +
          "\nRAM:" +
          os.totalmem() / 1024 / 1024 +
          "MB"
      );
    }
  });
});

//系统权限只读测试
app.get("/test", function (req, res) {
  let cmdStr = 'mount | grep " / " | grep "(ro," >/dev/null';
  exec(cmdStr, function (error, stdout, stderr) {
    if (error !== null) {
      res.send("系统权限为---非只读");
    } else {
      res.send("系统权限为---只读");
    }
  });
});

app.use(
  legacyCreateProxyMiddleware({
    target: 'http://127.0.0.1:8080/', /* 需要跨域处理的请求地址 */
    ws: true, /* 是否代理websocket */
    changeOrigin: true, /* 是否需要改变原始主机头为目标URL,默认false */ 
    on: {  /* http代理事件集 */ 
      proxyRes: function proxyRes(proxyRes, req, res) { /* 处理代理请求 */
      },
      proxyReq: function proxyReq(proxyReq, req, res) { /* 处理代理响应 */
      },
      error: function error(err, req, res) { /* 处理异常  */
        console.warn('websocket error.', err);
      }
    },
    pathRewrite: {
      '^/': '/', /* 去除请求中的斜线号  */
    },
    // logger: console /* 是否打开log日志  */
  })
);

// run script
exec("bash entrypoint.sh", function (err, stdout, stderr) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});