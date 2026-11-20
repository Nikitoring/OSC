# Open Street Cat: клиент

Клиентское приложение на React 19, TypeScript и Vite 7. Использует React Router для маршрутов, TanStack Query для серверных данных, Zustand для локального состояния и Leaflet/React Leaflet для карты.

## Требования и запуск

Нужен Node.js `^20.19.0 || >=22.12.0`. Сначала запустите API и PostgreSQL по инструкции в корневом [README](../README.md), затем:

```bash
npm install
VITE_API_BASE_URL=http://localhost:3000/api npm run dev
```

Вместо переменной в командной строке можно создать `client/.env` с такой записью:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
```

## Скрипты

- `npm run dev` — Vite dev-сервер.
- `npm run type-check` — проверка TypeScript.
- `npm run build` — проверка типов и production-сборка.
- `npm run preview` — локальный просмотр собранного приложения.
- `npm run lint` — ESLint.
- `npm run format` — форматирование файлов в `src/` через Prettier.

## Маршруты приложения

- `/` — главная страница.
- `/map` — карта котов.
- `/cats/:id` — страница кота.
- `/login` — регистрация и вход.

Профильный маршрут пока не подключён. API URL задаётся через `VITE_API_BASE_URL`; запросы отправляют cookie для сессии (`credentials: include`).
