# Mood Gallery - 服务器启动说明

## 快速启动

双击运行 `启动服务器.bat`，会自动启动：
- 前端服务器：http://localhost:8000
- API服务器：http://localhost:3001

## 手动启动

### 1. 启动API服务器
```bash
cd C:\Users\HONOR\Desktop\情绪画廊\server
node server.js
```

### 2. 启动前端服务器
```bash
cd C:\Users\HONOR\Desktop\情绪画廊
python -m http.server 8000
```

## 安装依赖
如果API服务器报错，先安装依赖：
```bash
cd C:\Users\HONOR\Desktop\情绪画廊\server
npm install
```

## 测试支付流程

1. 打开 http://localhost:8000
2. 点击 "Upgrade $1.99"
3. 使用PayPal沙盒账户测试支付
4. 支付成功后自动解锁Premium

## 查看已验证的支付
访问：http://localhost:3001/api/payments

## 注意事项

- API服务器使用PayPal沙盒环境，测试支付不会真实扣款
- 上线前需将沙盒URL改为生产URL
