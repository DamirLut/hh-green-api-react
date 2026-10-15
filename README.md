# Тестовое для green-api на react разработчик

Минимальный веб-мессенджер поверх [Green API](https://green-api.com): вход по креденшелам инстанса, список чатов, история переписки, отправка сообщений и приём входящих.

Live Demo: https://hh-green-api-react.damirlut.dev

## Стек

- **React 19** + **React Compiler** (babel preset в Vite)
- **TypeScript**
- **Vite 8** (rolldown), CSS Modules — без UI-библиотек
- **react-router 8** — data router
- **@tanstack/react-query 5** — api состояние
- **zustand** — клиентское состояние (auth, тема, модалки)
- **oxlint** — линтер
- **Bun** — mock-сервер Green API

## Как запустить

### Приложение (Vite)

Node ≥ 20 или Bun; пакетный менеджер любой — npm / yarn / pnpm / bun:

```sh
npm install
npm run dev        # http://localhost:5173
```

### Mock Green API

Требуется [Bun](https://bun.sh) (`Bun.serve`, без зависимостей):

```sh
bun run mock       # http://localhost:3000
```

### Вход без авторизации

Чтобы при разработке не вводить `idInstance` и `apiTokenInstance` каждый раз, скопируйте `.example.env` в `.env` и заполните значения:

```sh
cp .example.env .env
```

```env
VITE_GREEN_API_ID_INSTANCE=41002...
VITE_GREEN_API_TOKEN_INSTANCE=85f0...
```

Если переменные заданы, приложение при старте сразу открывает список чатов, минуя форму авторизации. Для мока подойдут любые непустые значения; для реального инстанса — настоящие креденшелы.

### Mock-сервер

Эмулирует Green API (`getAccountSettings`, `getChats`, `getContactInfo`, `getChatHistory`, `checkAccount`, `sendMessage`, `receiveNotification` long-poll, `deleteNotification`), состояние — в `mock/db.json`.

- на каждое отправленное сообщение через ~1 секунду приходит автоответ `pong: <текст>`;
- входящее можно инжектить вручную:

```sh
curl -X POST http://localhost:3000/test/incoming \
  -H 'Content-Type: application/json' \
  -d '{"chatId":"79001234567","text":"привет"}'
```

- номера, «находящиеся» через `checkAccount` (создают новый чат): `79017773344`, `79024445566`.


## Архитектура

```
src/
├── lib/green-api/     # слой API
│   ├── client.ts      #   GreenApiClient: типизированные методы, 429/rate-limit обработка
│   ├── config.ts      #   env, таблица лимитов методов, instanceApiUrl()
│   ├── types.ts       #   типы webhook/response
│   ├── query.ts       #   ключи квери и queryOptions-фабрики
│   └── client-context.ts  # ApiClientContext + useApiClient()
├── hooks/             # use-notifications (long-poll цикл), чат-квери, use-mobile, use-current-chat-id
├── store/             # zustand: auth (инстанс GreenApiClient), theme, modal
├── components/        # UI-примитивы: Avatar, Button, Input, Dialog, ModalHost, Spinner, …
├── pages/
│   ├── auth/          # AuthPage — форма входа, валидация getAccountSettings
│   └── chat/          # ChatPage: chatlist (header/footer, ChatItem, new-chat-modal)
│                      #   + chatview (Topbar, MessageList, ChatInput), resizable-сплит
└── styles/            # дизайн-токены (vars.css), global, view-transition
```
