---
title: myapp HTTP 测试与回归注意事项
published: 2026-05-20
updated: 2026-05-20
description: 从 myapp 测试文档整理 HTTP 测试优先级、环境变量、运行命令、bench Python 和常见误判。
tags: [Frappe, ERPNext, myapp, HTTP Test, unittest, 项目笔记, 排错, 速查]
category: 笔记
draft: false
---

这篇从 `apps/myapp/TESTING.zh-CN.md` 和 README 整理。

## 核心原则

对 `myapp.api.gateway.*` 这类对外接口，优先用 HTTP 测试，而不是在 WSL 宿主机里直接导入 Frappe 服务层。

原因：

- 更接近前端和移动端真实调用路径
- 能覆盖鉴权、权限、路由、响应包装和站点上下文
- 更容易暴露 devcontainer、站点权限和真实主数据问题

## 测试环境文件

复制示例：

```bash
cp apps/myapp/.env.http-test.example apps/myapp/.env.http-test
```

常用配置：

```txt
MYAPP_HTTP_BASE_URL=http://localhost:8080
MYAPP_HTTP_USERNAME=Administrator
MYAPP_HTTP_PASSWORD=<password>
MYAPP_HTTP_API_KEY=<api-key>
MYAPP_HTTP_API_SECRET=<api-secret>
MYAPP_HTTP_BEARER_TOKEN=<jwt-token>
MYAPP_HTTP_PRINT_RESPONSES=1
MYAPP_HTTP_SAVE_RESPONSES=1
```

宿主机执行时：

```txt
MYAPP_HTTP_BASE_URL=http://localhost:8080
```

backend 容器内直接执行时：

```txt
MYAPP_HTTP_BASE_URL=http://localhost:8000
```

当前约定：宿主机侧保持 `http://localhost:8080`，不要随意改成 `127.0.0.1`。

## 鉴权优先级

HTTP 测试鉴权优先级：

```txt
MYAPP_HTTP_BEARER_TOKEN
MYAPP_HTTP_API_KEY / MYAPP_HTTP_API_SECRET
MYAPP_HTTP_USERNAME / MYAPP_HTTP_PASSWORD
```

建议：

- 移动端和前后端分离场景优先用 JWT Bearer Token
- 服务端联调用 API key / secret
- 用户名密码适合兼容历史流程，不建议长期依赖管理员密码

## 跑 HTTP 测试

销售与采购主链路：

```bash
python3 -m unittest apps.myapp.myapp.tests.http.test_gateway_http
```

v2 商品与销售状态聚合：

```bash
python3 -m unittest apps.myapp.myapp.tests.http.test_gateway_v2_http
```

采购快捷链路：

```bash
python3 -m unittest apps.myapp.myapp.tests.http.test_purchase_quick_http
```

跑单个测试方法：

```bash
python3 -m unittest \
  apps.myapp.myapp.tests.http.test_gateway_v2_http.GatewayV2HttpTestCase.test_create_product_and_stock_idempotent_replay
```

## 性能基线

默认采样：

```bash
python3 -m apps.myapp.myapp.tests.http.benchmark_gateway_http
```

指定采样次数：

```bash
python3 -m apps.myapp.myapp.tests.http.benchmark_gateway_http --samples 10
```

指定输出：

```bash
python3 -m apps.myapp.myapp.tests.http.benchmark_gateway_http \
  --output /tmp/myapp-perf-baseline.json
```

适合在这些情况下运行：

- 工作台查询有改动
- 详情聚合接口有改动
- 数据库索引调整后
- 上线前做本机基线复核
- 出现“接口变慢”反馈后做对比

## 容器内测试必须用 bench Python

如果在 backend 容器内跑单元测试，不要直接用系统 Python。

推荐：

```bash
docker exec frappe_docker-backend-1 bash -lc '
  cd /home/frappe/frappe-bench &&
  env/bin/python -m unittest apps.myapp.myapp.tests.unit.test_order_service
'
```

原因：

- 系统 Python 可能找不到 `frappe`
- 系统 Python 可能缺少 bench 环境依赖
- 容易出现误导性的 `ModuleNotFoundError`

检查方式：

```bash
docker exec frappe_docker-backend-1 bash -lc '
  cd /home/frappe/frappe-bench &&
  env/bin/python - << "PY"
import importlib.util
print("frappe:", importlib.util.find_spec("frappe"))
print("orjson:", importlib.util.find_spec("orjson"))
PY'
```

## 销售单位换算与库存链路

在 backend 容器中运行：

```bash
docker exec frappe_docker-backend-1 bash -lc '
  cd /home/frappe/frappe-bench &&
  env/bin/python -m unittest apps.myapp.myapp.tests.integration.test_sales_uom_stock_chain
'
```

重点校验：

- `Sales Order Item.stock_qty`
- `Bin.actual_qty`
- `Stock Ledger Entry.actual_qty`

也就是不只看订单换算，还要看真实库存是否按库存单位准确结算。

## 常见误判

日志中出现 `422` 不一定是主链路失败。

如果测试本来就是探测不存在主数据、校验参数或触发业务规则，`422` 可能是预期结果。

判断时要看响应包络：

```json
{
  "ok": false,
  "status": "error",
  "code": "VALIDATION_ERROR"
}
```

而不是只看 HTTP 状态码。

## 测试分层建议

```txt
myapp/tests/http/         HTTP 冒烟、链路、幂等、并发测试
myapp/tests/unit/         服务层与工具函数单元测试
myapp/tests/integration/  依赖真实站点上下文的服务链路回归
```

推荐顺序：

1. 先跑单接口测试
2. 再跑幂等和并发测试
3. 最后跑链路 smoke test
4. 需要全量回归时再跑整份文件
