# Лабораторна робота №3. Node.js. Варіант 3

У цьому архіві підготовлено дві реалізації індивідуального завдання Book Catalog:

- `Lab_3_Common` - реалізація з CommonJS;
- `Lab_3_ESM` - реалізація з ECMAScript Modules.

Для кожної реалізації:

```bash
npm install
npm run dev
```

Перевірка API:

- `GET http://localhost:3000/health`
- `GET http://localhost:3000/books`
- `GET http://localhost:3000/books?author=Shevchenko`
- `GET http://localhost:3000/books/1`
- `POST http://localhost:3000/books`
- `PATCH http://localhost:3000/books/1`
- `PUT http://localhost:3000/books/1`
- `DELETE http://localhost:3000/books/1`

Команда `npm run dev` має lifecycle hook `predev`, тому перед запуском автоматично виконується `npm run check`.
