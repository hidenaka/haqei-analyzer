# HaQei アナライザー デプロイメントガイド

**Version**: 1.0.0  
**Last Updated**: 2025年8月3日  
**対象環境**: プロダクション・ステージング・開発

---

## 📋 概要

このガイドでは、HaQei アナライザーを各種環境にデプロイする手順を説明します。Docker、Kubernetes、従来のサーバー環境すべてに対応しています。

---

## 🚀 クイックスタート

### 前提条件
- Node.js 18以上
- Docker & Docker Compose
- Git
- SSL証明書（本番環境）

### 1分デプロイ（Docker使用）

```bash
# リポジトリクローン
git clone https://github.com/hidenaka/haqei-analyzer.git
cd haqei-analyzer

# 環境変数設定
cp .env.example .env.production
# .env.productionを編集

# Docker Composeでデプロイ
docker-compose -f deployment/docker-compose.yml up -d

# 確認
curl -k https://localhost
```

---

## 🔧 環境別デプロイ手順

### 📱 開発環境

```bash
# 依存関係インストール
npm install
cd haqei-vue && npm install

# 開発サーバー起動
npm run dev
cd haqei-vue && npm run dev

# 確認
open http://localhost:5173
```

### 🧪 ステージング環境

```bash
# プロダクションビルド
cd haqei-vue
npm run build

# ステージング設定でデプロイ
export NODE_ENV=staging
docker-compose -f deployment/docker-compose.staging.yml up -d

# ヘルスチェック
curl https://staging.haqei-analyzer.com/health
```

### 🏭 プロダクション環境

```bash
# セキュリティ設定生成
npm run security:generate

# プロダクション環境セットアップ
npm run production:setup

# SSL証明書配置
cp your-certificate.crt ssl/certificate.crt
cp your-private.key ssl/private.key

# デプロイ実行
docker-compose -f deployment/docker-compose.yml up -d

# 最終確認
npm run production:validate
```

---

## 🐳 Docker デプロイ

### 基本Docker設定

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 依存関係インストール
COPY package*.json ./
COPY haqei-vue/package*.json ./haqei-vue/
RUN npm ci --only=production
RUN cd haqei-vue && npm ci --only=production

# アプリケーションコピー
COPY . .

# ビルド
RUN cd haqei-vue && npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose設定

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  haqei-analyzer:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./security-configs/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
      - ./haqei-vue/dist:/var/www/html
    depends_on:
      - haqei-analyzer
    restart: unless-stopped

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

### マルチステージビルド

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY haqei-vue/package*.json ./haqei-vue/
RUN npm ci
RUN cd haqei-vue && npm ci

COPY . .
RUN cd haqei-vue && npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/haqei-vue/dist /usr/share/nginx/html
COPY security-configs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
```

---

## ☸️ Kubernetes デプロイ

### Namespace作成

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: haqei-analyzer
```

### ConfigMap設定

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: haqei-config
  namespace: haqei-analyzer
data:
  NODE_ENV: "production"
  API_URL: "https://api.haqei-analyzer.com"
```

### Secret設定

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: haqei-secrets
  namespace: haqei-analyzer
type: Opaque
data:
  SUPABASE_URL: <base64-encoded-url>
  SUPABASE_ANON_KEY: <base64-encoded-key>
```

### Deployment設定

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: haqei-analyzer
  namespace: haqei-analyzer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: haqei-analyzer
  template:
    metadata:
      labels:
        app: haqei-analyzer
    spec:
      containers:
      - name: haqei-analyzer
        image: haqei-analyzer:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: haqei-config
              key: NODE_ENV
        envFrom:
        - secretRef:
            name: haqei-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service設定

```yaml
apiVersion: v1
kind: Service
metadata:
  name: haqei-analyzer-service
  namespace: haqei-analyzer
spec:
  selector:
    app: haqei-analyzer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

### Ingress設定

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: haqei-analyzer-ingress
  namespace: haqei-analyzer
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - haqei-analyzer.com
    secretName: haqei-analyzer-tls
  rules:
  - host: haqei-analyzer.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: haqei-analyzer-service
            port:
              number: 80
```

---

## 🌐 CDN・DNS設定

### CloudFlare設定

```yaml
# cloudflare-config.yml
zone: haqei-analyzer.com
dns_records:
  - name: "@"
    type: "A"
    value: "your-server-ip"
    proxied: true
  - name: "www"
    type: "CNAME"
    value: "haqei-analyzer.com"
    proxied: true
  - name: "api"
    type: "A"
    value: "your-api-server-ip"
    proxied: true

page_rules:
  - url: "*.haqei-analyzer.com/static/*"
    settings:
      cache_level: "cache_everything"
      edge_cache_ttl: 2592000  # 30 days
```

### AWS CloudFront設定

```json
{
  "DistributionConfig": {
    "CallerReference": "haqei-analyzer-2025",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "haqei-origin",
          "DomainName": "your-server.com",
          "CustomOriginConfig": {
            "HTTPPort": 443,
            "HTTPSPort": 443,
            "OriginProtocolPolicy": "https-only"
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "haqei-origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "managed-caching-optimized"
    },
    "Comment": "HaQei Analyzer CDN",
    "Enabled": true
  }
}
```

---

## 🔍 モニタリング・ログ設定

### Prometheus設定

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'haqei-analyzer'
    static_configs:
      - targets: ['haqei-analyzer:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:9113']
```

### Grafana ダッシュボード

```json
{
  "dashboard": {
    "title": "HaQei Analyzer Monitoring",
    "panels": [
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "http_request_duration_seconds_bucket{job=\"haqei-analyzer\"}"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      }
    ]
  }
}
```

### ELK Stack設定

```yaml
# docker-compose.elk.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logs:/usr/share/logstash/logs

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

---

## 🔒 セキュリティ設定

### SSL/TLS設定

```bash
# Let's Encrypt証明書取得
certbot certonly --standalone -d haqei-analyzer.com -d www.haqei-analyzer.com

# 証明書の配置
cp /etc/letsencrypt/live/haqei-analyzer.com/fullchain.pem ssl/certificate.crt
cp /etc/letsencrypt/live/haqei-analyzer.com/privkey.pem ssl/private.key

# 権限設定
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt
```

### Firewall設定

```bash
# UFW設定
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# iptables設定
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j DROP
```

### WAF設定（CloudFlare）

```yaml
# WAF Rules
rules:
  - description: "Block SQL Injection"
    expression: 'http.request.uri.query contains "union select"'
    action: "block"
    
  - description: "Rate Limit API"
    expression: 'http.request.uri.path matches "^/api/"'
    action: "rate_limit"
    ratelimit:
      requests_per_period: 100
      period: 60
```

---

## 📊 パフォーマンス最適化

### Nginx最適化

```nginx
# nginx.conf
worker_processes auto;
worker_connections 1024;

http {
    # Gzip圧縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # キャッシュ設定
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # HTTP/2設定
    listen 443 ssl http2;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
}
```

### Node.js最適化

```javascript
// production.js
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  cluster.on('exit', (worker) => {
    cluster.fork()
  })
} else {
  // アプリケーション起動
  require('./app.js')
}
```

---

## 🔄 CI/CD パイプライン

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd haqei-vue && npm ci
    
    - name: Run tests
      run: |
        npm run test
        cd haqei-vue && npm run test
    
    - name: Build application
      run: |
        cd haqei-vue && npm run build
    
    - name: Security scan
      run: npm run security:scan
    
    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: npm run deploy:staging
      
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: npm run deploy:production
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/hidenaka/haqei-analyzer.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'cd haqei-vue && npm ci'
                sh 'cd haqei-vue && npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test'
                sh 'cd haqei-vue && npm run test'
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'npm run security:scan'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker build -t haqei-analyzer:latest .'
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        failure {
            mail to: 'dev@haqei-analyzer.com',
                 subject: 'Deployment Failed',
                 body: 'The deployment pipeline failed. Please check the logs.'
        }
    }
}
```

---

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. ビルドエラー

```bash
# 問題: npm build失敗
# 解決: 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
cd haqei-vue && rm -rf node_modules package-lock.json && npm install
```

#### 2. SSL証明書エラー

```bash
# 問題: SSL証明書の有効期限切れ
# 解決: 証明書の更新
certbot renew --dry-run
systemctl reload nginx
```

#### 3. メモリ不足

```bash
# 問題: Node.jsアプリケーションのメモリ不足
# 解決: メモリ制限の調整
node --max-old-space-size=4096 app.js
```

#### 4. データベース接続エラー

```bash
# 問題: Supabase接続エラー
# 解決: 接続設定の確認
curl -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/"
```

### ログ確認方法

```bash
# アプリケーションログ
docker-compose logs -f haqei-analyzer

# Nginxログ
docker-compose logs -f nginx

# システムログ
journalctl -u haqei-analyzer -f

# エラーログの検索
grep -r "ERROR" /var/log/haqei-analyzer/
```

---

## 📋 デプロイメントチェックリスト

### 本番デプロイ前

- [ ] 環境変数設定完了
- [ ] SSL証明書設定完了
- [ ] セキュリティヘッダー設定完了
- [ ] バックアップ戦略設定完了
- [ ] モニタリング設定完了
- [ ] ロードテスト実施完了
- [ ] セキュリティテスト完了
- [ ] DNS設定完了
- [ ] CDN設定完了
- [ ] 緊急連絡先設定完了

### デプロイ後

- [ ] ヘルスチェック正常
- [ ] SSL証明書有効
- [ ] セキュリティヘッダー動作確認
- [ ] ログ出力確認
- [ ] メトリクス収集確認
- [ ] アラート動作確認
- [ ] パフォーマンス確認
- [ ] ユーザー機能テスト完了

---

## 📞 サポート・問い合わせ

- **技術サポート**: dev@haqei-analyzer.com
- **緊急連絡**: emergency@haqei-analyzer.com
- **ドキュメント**: https://docs.haqei-analyzer.com
- **ステータス**: https://status.haqei-analyzer.com

---

**更新履歴**:
- v1.0.0 (2025-08-03): 初版作成
- Docker・Kubernetes対応
- セキュリティ強化設定追加
- CI/CD パイプライン設定追加

*このドキュメントはプロダクション環境での実証済み設定に基づいています。*