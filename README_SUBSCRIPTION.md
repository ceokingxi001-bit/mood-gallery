# Mood Gallery - Premium Subscription Setup

## 功能概述

### 免费用户
- 60分钟使用时间
- 可访问：Happy, Peaceful, Hopeful, Relaxed, Romantic

### 付费用户
- 无时间限制
- 可访问全部10个情绪类别
- PayPal 沙箱支付

---

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置 PayPal 沙箱

1. 注册 [PayPal 开发者账号](https://developer.paypal.com/)
2. 登录 [PayPal Sandbox](https://www.sandbox.paypal.com/)
3. 获取沙箱 API 凭证:
   - 进入 My Apps & Credentials
   - 选择 Sandbox 模式
   - 创建 App 获取 Client ID 和 Secret

4. 创建订阅产品:
   - 进入 PayPal Dashboard > Subscriptions
   - 创建 Billing Plan ($4.99/月)
   - 复制 Plan ID

5. 配置环境变量:
   ```bash
   cp .env.example .env
   # 编辑 .env 填入你的 PayPal 沙箱凭证
   ```

### 3. 启动服务

**终端1 - 后端服务器:**
```bash
cd server
npm start
```

**终端2 - 前端静态服务器:**
```bash
# 在项目根目录
python -m http.server 8000
```

### 4. 访问网站

打开浏览器访问: http://localhost:8000/index.html

---

## PayPal 沙箱配置步骤

### 获取沙箱 API 凭证

1. 登录 https://developer.paypal.com/
2. 点击 My Apps & Credentials
3. 确保选择 **Sandbox** 模式
4. 点击 Create App
5. 复制:
   - Client ID
   - Secret

### 创建订阅产品

1. 登录 https://www.sandbox.paypal.com/
2. 进入 Dashboard > Subscriptions
3. 点击 Create Plan
4. 设置:
   - Name: Mood Gallery Premium
   - Amount: 4.99 USD
   - Billing cycle: Monthly
5. 复制 Plan ID

### 配置 .env 文件

```
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_PLAN_ID=your_plan_id
YOUR_DOMAIN=http://localhost:8000
```

### 测试卡号

PayPal 沙箱提供测试卡号:
- 卡号: `4032035557576141`
- 到期日: 任意未来日期
- CVV: 任意3位数字

---

## 文件结构

```
情绪画廊/
├── index.html          # 主页面 (已更新 PayPal)
├── styles.css          # 样式
├── gallery.js          # 画廊功能
├── privacy-policy.html # 隐私政策
├── refund-policy.html  # 退款政策
└── server/
    ├── server.js       # Express + PayPal 后端
    ├── package.json
    └── .env.example    # 环境变量模板
```

---

## 沙箱测试流程

1. 打开网站，点击 Premium 按钮
2. 使用 PayPal 沙箱测试账号登录
3. 使用沙箱测试卡完成支付
4. 订阅成功后自动解锁 Premium

### 创建沙箱测试账号

1. 进入 https://developer.paypal.com/
2. 点击 Dashboard > Sandbox > Accounts
3. 点击 Create Account
4. 创建一个 Personal 账号用于测试购买

---

## 从沙箱切换到正式环境

当准备好上线时：

1. 在 PayPal Dashboard 创建正式 Product
2. 获取正式 Client ID 和 Secret
3. 更新 .env:
   ```
   PAYPAL_ENVIRONMENT=live
   PAYPAL_CLIENT_ID=正式ClientID
   PAYPAL_CLIENT_SECRET=正式Secret
   PAYPAL_PLAN_ID=正式PlanID
   ```

---

## 常见问题

### Q: PayPal 按钮不显示？
A: 检查浏览器控制台是否有 CORS 错误，确保后端服务器正常运行。

### Q: 沙箱测试失败？
A: 确保使用的是沙箱 Client ID 而不是正式环境 ID。

### Q: 如何取消订阅？
A: 用户可以在 PayPal 账户中取消订阅。

---

## 生产部署建议

1. 使用 HTTPS
2. 配置正确的域名和 CORS
3. 使用正式 PayPal 凭证
4. 设置 Webhook 接收订阅事件（可选）
5. 考虑添加用户登录系统

---

## 联系方式

如有问题，请检查 PayPal Developer Dashboard 的日志或后端控制台输出。
