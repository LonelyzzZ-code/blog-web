# CLAUDE.md

这是 blog-web 项目，基于 Vue 3 + TypeScript 的博客前端，对接 blog-api 后端。

## 行为准则

以下 4 条来自 Andrej Karpathy 的 LLM 编码规范。**权衡：这些原则倾向谨慎而非速度，简单任务可灵活调整。**

### 1. 先想清楚再写代码

**不要假设，不要掩盖困惑，明确说出权衡。**

- 写代码前先陈述你的假设，不确定就问
- 如果有多种理解方式，列出来让用户选
- 如果有更简单的方式，指出来
- 如果不清楚就停，指出哪里不懂然后问

### 2. 简单优先

**用最少的代码解决问题，不写投机性代码。**

- 不添加需求之外的功能
- 不为一次性的代码做抽象
- 不做没有被要求的「灵活性」或「可配置性」
- 如果写了 200 行但 50 行就能搞定，重写

### 3. 精确修改

**只动必须动的，只清理你自己弄乱的东西。**

- 不「顺便优化」无关代码、注释、格式
- 不重构没坏的东西
- 匹配原有风格
- 你的改动产生的孤儿（无用 import、变量），清理掉

### 4. 目标驱动执行

**定义成功标准，循环直到验证通过。**

- "加功能" → "先写用户操作流程，再验证页面渲染正确"
- "改样式" → "先截图对比，再调整"

### 5. 工作要求

**只做用户要求做的，别做自我决定**
**只做用户要求做的，别做自我决定**
**只做用户要求做的，别做自我决定**
**只做用户要求做的，别做自我决定**
**只做用户要求做的，别做自我决定**

---

## 技术栈

- **框架**: Vue 3（Composition API，`<script setup lang="ts">`）
- **语言**: TypeScript（strict 模式）
- **路由**: Vue Router 4（history 模式）
- **HTTP 请求**: Axios
- **构建工具**: Vite 5
- **后端对接**: blog-api（FastAPI，运行在 localhost:8000）

## 项目结构

```
blog-web\
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src\
│   ├── main.ts            ← 入口
│   ├── App.vue            ← 根组件
│   ├── vite-env.d.ts      ← 类型声明
│   ├── router\
│   │   └── index.ts       ← 路由配置
│   ├── api\
│   │   ├── client.ts      ← Axios 实例
│   │   ├── articles.ts    ← 文章 API
│   │   └── comments.ts    ← 评论 API
│   ├── types\
│   │   └── index.ts       ← 类型定义
│   ├── views\
│   │   ├── Home.vue       ← 文章列表页
│   │   └── ArticleDetail.vue ← 文章详情页
│   └── assets\
│       └── main.css       ← 全局样式
```

## 约定

- **组件语法**: `<script setup lang="ts">`，不写 `defineComponent`
- **API 调用**: 统一通过 `api/` 目录下的函数，不在组件里直接 `axios.get`
- **类型**: 所有 API 返回值标注类型，用 `src/types/index.ts` 的接口
- **路由参数**: `article/:id` 通过 `useRoute().params.id` 获取
- **样式**: 全局样式放 `assets/main.css`，组件内样式用 `scoped`
- **代理**: 开发环境通过 Vite proxy 转发 `/api` 到后端，不写死 `localhost:8000`

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器（热更新）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 编码风格

- 所有新组件用 Composition API + `<script setup lang="ts">`
- 异步请求用 `async/await`，包 `try/catch`
- 组件按 `<template>` → `<script>` → `<style>` 顺序
- 变量命名：驼峰（camelCase），组件文件大驼峰（PascalCase）
- 不写无意义的注释，代码自解释优先

## 注意事项

- Vite proxy 只在开发环境生效，生产环境需 Nginx 反向代理
- 确保后端 `uvicorn` 先启动，前端才能拿到数据
- 代码生成参考：`blog-web-代码生成指南.txt`，生成/修改任何文件前先对照该指南
- 全程用中文回复
