### Физическая модель базы данных

![Схема бд]((https://github.com/Shveder/refactoring/blob/master/Files/schemas/DB.jpg))

# Проектное руководство

## Пользовательский интерфейс

### User Flow диаграммы

**User Flow** – это схема движения пользователя, наглядный разветвлённый сценарий его взаимодействия с конкретным цифровым продуктом: приложением или сайтом. User Flow показывает точки входа в сценарий, все переходы и страницы на пути к достижению пользователем его цели. 

Проработка User Flow – важный этап проектирования интерфейса: от того, насколько понятным и быстрым будет путь пользователя, зависит удобство и простота конечного продукта [1]. 

User Flow для пользователя и администратора представлены на рисунках 1.1 – 1.2 соответственно.

![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/schemas/user-flow-user.jpg)

### Рисунок 1.1 – User Flow для пользователя

Диаграмма представляет собой описание последовательности действий пользователя при взаимодействии с системой, начиная с авторизации и заканчивая выбором основных функций. 

1. **Авторизация:**  
   Пользователь вводит данные для входа, и система проверяет их на корректность.  
   - Если данные неверные, отображается сообщение об ошибке.  
   - Если данные верны, пользователь переходит к следующему этапу – выбору пункта меню.  

2. **Выбор бизнес-процессов:**  
   После успешной авторизации пользователь может выбирать из нескольких ключевых функций:  
   - Работа с профилем (управление процессами);  
   - Анализ процессов;  

Каждый процесс соответствует конкретной функции системы и использует элементы интерфейса, которые обозначены цифрами под блоками.  

Диаграмма визуализирует логику пользовательского взаимодействия с системой через интерфейс, подчеркивая основные функциональные модули. Она помогает понять, как пользователи могут взаимодействовать с различными модулями системы через интуитивные интерфейсы.

![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/schemas/user-flow-admin.jpg)

### Рисунок 1.2 – User Flow для администратора

Диаграмма описывает взаимодействие администратора с системой, начиная с процесса авторизации и продолжая выбором доступных функций управления. 

1. **Авторизация:**  
   Администратор запускает процесс с начальной точки – **Старт**, после чего переходит на страницу авторизации.  
   - На этом этапе вводятся учетные данные, и система проверяет их на корректность.  
   - Если данные неверные, выводится уведомление об ошибке, и администратор должен снова попытаться авторизоваться.  
   - При успешной проверке данных процесс продолжается, и администратор получает доступ к функциям системы.  

2. **Выбор ключевых функций:**  
   После успешной авторизации администратор попадает на этап выбора меню, где представлены функции управления:  
   - Управление компаниями;
   - Управление процессами; 
   - Управление пользователями.  

Каждый процесс сопровождается цифровой маркировкой, указывающей на использование конкретных интерфейсов системы.  


### Примеры экранов UI

![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/1c.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/2р.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/3г.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/4п.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/5а.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/6п.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/7г.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/8к.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/9а.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/10c.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/11р.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/12р.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/13р.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/14р.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/15р.jpg)
![Описание изображения](https://github.com/Shveder/refactoring/blob/master/Files/screens/16р.jpg)

## Безопасность

Для обеспечения надежности системы реализованы следующие меры безопасности:

## Аутентификация через JWT

**JSON Web Token (JWT)** используется для управления аутентификацией и авторизацией. Основные преимущества использования JWT:  
- **Безопасность**: Токен шифруется, что позволяет передавать данные безопасно.  
- **Гибкость**: JWT работает независимо от платформы и может быть интегрирован в любые системы.  

#### Принцип работы:
1. После успешной авторизации пользователя сервер генерирует JWT.  
2. Токен содержит:  
   - Заголовок (**Header**): указывает тип токена и алгоритм шифрования (например, HS256).  
   - Полезная нагрузка (**Payload**): данные пользователя (например, `userId`, `role`) без конфиденциальной информации.  
   - Подпись (**Signature**): шифруется с использованием секрета сервера.  

Пример структуры токена:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

3. При запросах к защищенным ресурсам клиент отправляет токен в заголовке `Authorization`.  
4. Сервер проверяет подпись токена и определяет права доступа пользователя.  

---

## Хэширование паролей с использованием соли

Пароли пользователей никогда не хранятся в системе в открытом виде. Применяются следующие методы защиты:  

1. **Соль (Salt)**: уникальная случайная строка, добавляемая к паролю перед его хэшированием. Это предотвращает использование радужных таблиц для взлома.  
2. **Хэширование**: для преобразования пароля используется алгоритм (например, bcrypt или Argon2).  

#### Процесс хэширования:
1. Генерация случайной соли.
2. Добавление соли к паролю.
3. Хэширование результата.
4. Сохранение хэша и соли в базе данных.  

Пример:
- Пароль: `mypassword`  
- Соль: `r4nd0mS4lt`  
- Хэш: `bcrypt(mypassword + r4nd0mS4lt) -> $2b$12$...`  

Эти меры обеспечивают, что даже в случае утечки данных злоумышленник не сможет восстановить пароли пользователей.

---

## Развёртывание
Для развертывания программного средства, состоящего из сервера на .NET, веб-приложения на React и базы данных PostgreSQL, вы можете использовать Docker. Вот пошаговое руководство:
1 Убедитесь, что установлены:
Docker и Docker Compose.

Docker файл для серверной части:

# Используем базовый образ для .NET
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5000

# Сборка приложения
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Финальный образ
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "YourBackendProject.dll"]

	Docker для клиентской части:

# Используем базовый образ для Node.js
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Используем nginx для раздачи файлов
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

	Docker-compose файл:

version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "5000:5000"
    environment:
      - ConnectionStrings__DefaultConnection=Host=db;Database=app_db;Username=postgres;Password=postgres
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:80"

  db:
    image: postgres:13
    container_name: postgres_container
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

	2 Запустите проект с помощью docker-compose up –build
