# AirportMgt

機場營運管理 Web 應用（Vite + React + TypeScript），可在瀏覽器管理航班、登機門與旅客；資料預設保存在 `localStorage`，並內建示範資料。

## 功能

- **總覽**：登機中／延誤航班、已報到旅客、可用登機門
- **航班**：CRUD、指派登機門、狀態（排程／登機／離站／延誤／取消）
- **登機門**：航廈與門號、可用狀態
- **旅客**：關聯航班、座位、報到勾選

## 本機開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
npm run preview
```

## Netlify 部署

已包含 `netlify.toml`（建置 `dist`、SPA 重新導向）。連結 GitHub 儲存庫後即可自動部署。

## 技術備註

- 前端路由：`react-router-dom`
- 後續可改接 Netlify Database 或 Functions 做多人共用資料
