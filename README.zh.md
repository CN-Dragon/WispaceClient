# WispaceClient 🌌

[English](./README.md) | **中文版**

---

### 📖 项目简介
Wispace 是一个基于 React 和 Three.js 构建的现代化、AI 驱动的 3D 工作空间与场景编辑器。它允许用户在一个无缝的交互式环境中动态创建、管理和编辑 3D 几何体。借助内置的 AI 能力，用户可以通过自然语言指令轻松生成或操作 3D 场景中的对象。

### ✨ 核心功能
- **交互式 3D 编辑器**：支持拖拽、变换（平移、缩放、旋转）各种基础几何体（如立方体、球体、圆柱体等）。
- **AI 智能助手**：集成 OpenAI，能够理解自然语言指令，并在 3D 场景中实时生成和修改对象。
- **场景图管理**：提供可视化的层级树状图（场景面板），方便管理工作空间中的对象和编组。
- **现代化 UI**：基于 Tailwind CSS 和 Ant Design 构建的简洁直观的用户界面。

### 🛠️ 技术栈
- **前端框架**：React 19, TypeScript, Vite
- **3D 引擎**：Three.js, React Three Fiber, React Three Drei
- **UI 与样式**：Tailwind CSS, Ant Design (antd)
- **状态管理**：Zustand
- **路由**：React Router DOM
- **AI 集成**：OpenAI API
- **网络请求**：Axios

### 🚀 快速开始

#### 环境要求
- Node.js (推荐 v18 及以上版本)
- npm 或 yarn 或 pnpm

#### 安装与运行
1. 克隆项目仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```

#### 生产环境构建
```bash
npm run build
```
