# ACTION
# 抽奖系统 API 文档 / Lottery System API Documentation

## 项目概述 / Project Overview

这是一个基于 Node.js 和 Express 开发的抽奖系统 API，支持创建抽奖活动、添加奖品、注册参与者、抽取获奖者等核心功能。

This is a lottery system API built with Node.js and Express, supporting core features such as creating lottery events, adding prizes, registering participants, and drawing winners.

## 技术栈 / Technology Stack

- Node.js
- Express
- SQLite
- CORS

## 快速开始 / Quick Start

### 安装依赖 / Install Dependencies

```bash
npm install
```

### 启动服务器 / Start Server

```bash
npm start
```

服务器将在 `http://localhost:3000` 上运行。

The server will run on `http://localhost:3000`.

### 开发模式 / Development Mode

```bash
npm run dev
```

## API 端点 / API Endpoints

### 健康检查 / Health Check

- **URL**: `/health`
- **方法 / Method**: `GET`
- **描述 / Description**: 检查服务器是否正常运行 / Check if the server is running normally
- **响应示例 / Response Example**:
  ```json
  {
    "status": "ok",
    "message": "Lottery system is running"
  }
  ```

### 抽奖活动管理 / Lottery Management

#### 创建抽奖活动 / Create Lottery

- **URL**: `/api/lotteries`
- **方法 / Method**: `POST`
- **描述 / Description**: 创建一个新的抽奖活动 / Create a new lottery event
- **请求体 / Request Body**:
  ```json
  {
    "name": "Test Lottery",
    "description": "A test lottery",
    "startTime": "2025-11-30T12:00:00Z",
    "endTime": "2025-12-01T12:00:00Z"
  }
  ```
- **响应示例 / Response Example**:
  ```json
  {
    "id": 1,
    "name": "Test Lottery",
    "description": "A test lottery",
    "startTime": "2025-11-30T12:00:00Z",
    "endTime": "2025-12-01T12:00:00Z"
  }
  ```

#### 获取所有抽奖活动 / Get All Lotteries

- **URL**: `/api/lotteries`
- **方法 / Method**: `GET`
- **描述 / Description**: 获取所有抽奖活动列表 / Get all lottery events
- **响应示例 / Response Example**:
  ```json
  [
    {
      "id": 1,
      "name": "Test Lottery",
      "description": "A test lottery",
      "start_time": "2025-11-30T12:00:00Z",
      "end_time": "2025-12-01T12:00:00Z",
      "created_at": "2025-11-30T12:29:05Z"
    }
  ]
  ```

#### 获取抽奖活动详情 / Get Lottery Details

- **URL**: `/api/lotteries/:id`
- **方法 / Method**: `GET`
- **描述 / Description**: 获取指定抽奖活动的详细信息 / Get details of a specific lottery event
- **响应示例 / Response Example**:
  ```json
  {
    "id": 1,
    "name": "Test Lottery",
    "description": "A test lottery",
    "start_time": "2025-11-30T12:00:00Z",
    "end_time": "2025-12-01T12:00:00Z",
    "created_at": "2025-11-30T12:29:05Z",
    "prizes": [
      {
        "id": 1,
        "lottery_id": 1,
        "name": "First Prize",
        "description": "Grand prize",
        "quantity": 1,
        "remaining": 0
      }
    ],
    "participantsCount": 8
  }
  ```

#### 删除抽奖活动 / Delete Lottery

- **URL**: `/api/lotteries/:id`
- **方法 / Method**: `DELETE`
- **描述 / Description**: 删除指定的抽奖活动 / Delete a specific lottery event
- **响应示例 / Response Example**:
  ```json
  {
    "success": true,
    "message": "Lottery deleted successfully"
  }
  ```

### 奖品管理 / Prize Management

#### 添加奖品 / Add Prize

- **URL**: `/api/lotteries/:lotteryId/prizes`
- **方法 / Method**: `POST`
- **描述 / Description**: 为指定抽奖活动添加奖品 / Add a prize to a specific lottery event
- **请求体 / Request Body**:
  ```json
  {
    "name": "First Prize",
    "description": "Grand prize",
    "quantity": 1
  }
  ```
- **响应示例 / Response Example**:
  ```json
  {
    "id": 1,
    "lotteryId": 1,
    "name": "First Prize",
    "description": "Grand prize",
    "quantity": 1,
    "remaining": 1
  }
  ```

### 参与者管理 / Participant Management

#### 注册参与者 / Register Participant

- **URL**: `/api/lotteries/:lotteryId/participants`
- **方法 / Method**: `POST`
- **描述 / Description**: 为指定抽奖活动注册参与者 / Register a participant for a specific lottery event
- **请求体 / Request Body**:
  ```json
  {
    "userId": "user1",
    "userName": "User One"
  }
  ```
- **响应示例 / Response Example**:
  ```json
  {
    "success": true,
    "message": "Participant registered successfully"
  }
  ```

### 抽奖管理 / Draw Management

#### 抽取获奖者 / Draw Winner

- **URL**: `/api/lotteries/:lotteryId/draw/:prizeId`
- **方法 / Method**: `POST`
- **描述 / Description**: 为指定抽奖活动的指定奖品抽取获奖者 / Draw a winner for a specific prize in a lottery event
- **响应示例 / Response Example**:
  ```json
  {
    "success": true,
    "winner": {
      "userId": "user1",
      "userName": "User One",
      "prizeId": 1,
      "prizeName": "First Prize"
    }
  }
  ```

### 获奖者管理 / Winner Management

#### 获取抽奖活动的所有获奖者 / Get All Winners for Lottery

- **URL**: `/api/lotteries/:lotteryId/winners`
- **方法 / Method**: `GET`
- **描述 / Description**: 获取指定抽奖活动的所有获奖者 / Get all winners for a specific lottery event
- **响应示例 / Response Example**:
  ```json
  [
    {
      "id": 1,
      "lottery_id": 1,
      "prize_id": 1,
      "user_id": "user1",
      "user_name": "User One",
      "won_at": "2025-11-30T12:29:05Z",
      "prize_name": "First Prize"
    }
  ]
  ```

#### 获取指定奖品的获奖者 / Get Winners by Prize

- **URL**: `/api/prizes/:prizeId/winners`
- **方法 / Method**: `GET`
- **描述 / Description**: 获取指定奖品的所有获奖者 / Get all winners for a specific prize
- **响应示例 / Response Example**:
  ```json
  [
    {
      "id": 1,
      "lottery_id": 1,
      "prize_id": 1,
      "user_id": "user1",
      "user_name": "User One",
      "won_at": "2025-11-30T12:29:05Z",
      "prize_name": "First Prize"
    }
  ]
  ```

## 数据库结构 / Database Structure

### 抽奖活动表 (lotteries) / Lotteries Table

| 字段名 / Field | 类型 / Type | 描述 / Description |
|----------------|-------------|-------------------|
| id | INTEGER | 主键，自增 / Primary key, auto-increment |
| name | TEXT | 抽奖活动名称 / Lottery name |
| description | TEXT | 抽奖活动描述 / Lottery description |
| start_time | DATETIME | 开始时间 / Start time |
| end_time | DATETIME | 结束时间 / End time |
| created_at | DATETIME | 创建时间 / Creation time |

### 奖品表 (prizes) / Prizes Table

| 字段名 / Field | 类型 / Type | 描述 / Description |
|----------------|-------------|-------------------|
| id | INTEGER | 主键，自增 / Primary key, auto-increment |
| lottery_id | INTEGER | 关联的抽奖活动ID / Associated lottery ID |
| name | TEXT | 奖品名称 / Prize name |
| description | TEXT | 奖品描述 / Prize description |
| quantity | INTEGER | 奖品数量 / Prize quantity |
| remaining | INTEGER | 剩余奖品数量 / Remaining prizes |

### 参与者表 (participants) / Participants Table

| 字段名 / Field | 类型 / Type | 描述 / Description |
|----------------|-------------|-------------------|
| id | INTEGER | 主键，自增 / Primary key, auto-increment |
| lottery_id | INTEGER | 关联的抽奖活动ID / Associated lottery ID |
| user_id | TEXT | 用户ID / User ID |
| user_name | TEXT | 用户名 / User name |
| created_at | DATETIME | 注册时间 / Registration time |

### 获奖者表 (winners) / Winners Table

| 字段名 / Field | 类型 / Type | 描述 / Description |
|----------------|-------------|-------------------|
| id | INTEGER | 主键，自增 / Primary key, auto-increment |
| lottery_id | INTEGER | 关联的抽奖活动ID / Associated lottery ID |
| prize_id | INTEGER | 关联的奖品ID / Associated prize ID |
| user_id | TEXT | 获奖者用户ID / Winner's user ID |
| user_name | TEXT | 获奖者用户名 / Winner's user name |
| won_at | DATETIME | 获奖时间 / Winning time |

## 测试 / Testing

### 运行测试脚本 / Run Test Script

```bash
node test-lottery.js
```

测试脚本将自动测试抽奖系统的核心功能，包括创建抽奖活动、添加奖品、注册参与者、抽取获奖者等。

The test script will automatically test the core functions of the lottery system, including creating lottery events, adding prizes, registering participants, and drawing winners.

## 项目结构 / Project Structure

```
.
├── src/
│   ├── app.js              # 主应用文件 / Main application file
│   ├── db.js               # 数据库连接和初始化 / Database connection and initialization
│   ├── lotteryService.js   # 抽奖业务逻辑 / Lottery business logic
│   └── routes.js           # API 路由 / API routes
├── API-DOCS.md             # API 文档 / API documentation
├── package.json            # 项目配置 / Project configuration
├── test-lottery.js         # 测试脚本 / Test script
└── lottery.db              # SQLite 数据库文件 / SQLite database file
```

## 核心功能 / Core Features

1. **创建抽奖活动**：支持设置抽奖名称、描述、开始时间和结束时间 / **Create Lottery Events**: Support setting lottery name, description, start time and end time
2. **添加奖品**：支持为抽奖活动添加多个奖品，每个奖品可设置名称、描述和数量 / **Add Prizes**: Support adding multiple prizes to a lottery, each with name, description and quantity
3. **注册参与者**：支持参与者注册，每个参与者只能注册一次 / **Register Participants**: Support participant registration, each participant can register only once
4. **抽取获奖者**：支持为指定奖品抽取获奖者，确保每个参与者只能获得一个相同奖品 / **Draw Winners**: Support drawing winners for specific prizes, ensuring each participant can win the same prize only once
5. **查询功能**：支持查询抽奖活动详情、参与者列表、获奖者列表等 / **Query Functions**: Support querying lottery details, participant lists, winner lists, etc.
6. **事务处理**：确保抽奖过程的原子性，避免数据不一致 / **Transaction Processing**: Ensure atomicity of the drawing process and avoid data inconsistency

## 注意事项 / Notes

1. 抽奖活动只有在开始时间和结束时间之间才能注册参与者 / Lottery events only allow participant registration between start time and end time
2. 每个参与者只能为每个抽奖活动注册一次 / Each participant can register for each lottery event only once
3. 每个参与者可以获得不同奖品，但同一奖品只能获得一次 / Each participant can win different prizes, but can win the same prize only once
4. 抽奖过程使用事务处理，确保数据一致性 / The drawing process uses transaction processing to ensure data consistency
5. SQLite 数据库文件将自动创建在项目根目录下 / SQLite database file will be automatically created in the project root directory

## 扩展建议 / Extension Suggestions

1. 添加用户认证和授权机制 / Add user authentication and authorization mechanisms
2. 支持更多的抽奖算法（如权重抽奖） / Support more lottery algorithms (such as weighted lottery)
3. 添加邮件或短信通知功能 / Add email or SMS notification functions
4. 支持导出获奖者数据 / Support exporting winner data
5. 添加更详细的日志记录 / Add more detailed logging
6. 支持分布式部署 / Support distributed deployment
7. 支持更多的数据库类型（如 MySQL、PostgreSQL） / Support more database types (such as MySQL, PostgreSQL)
待添加

