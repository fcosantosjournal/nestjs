# NestJS via Docker

Crie um arquivo **docker-composer.yml** na raiz do projeto com o seguinte conteudo.

```
version: "3"
services:
  front:
    image: node:16-alpine
    working_dir: /app
    user: node
    volumes:
      - ./:/app
    ports:
      - 7000:7000
    command: sh -c 'tail -f /dev/null'
```

Rode **docker compose up** para dar start ao container

Faça atach on the docker container e execute os seguintes comandos:

`npm i -g @nestjs/cli`
`nest new project-name`

Altere o arquivo **package.json** e adicione o seguinte conteúdo:

```
"scripts": {
    "nest": "nest",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
```

**npm run nest …** para rodar os comandos dentro do container.

## Base de dados

Rode os seguintes comandos:

```jsx
npm install ****@nestjs/typeorm
npm install sqlite3 /* Se for utilizar o sqlite claro */****
```

Arquivo **app.module.ts** adicionar ****o seguinte código para a configuração da base de dados:

```jsx
**import { TypeOrmModule } from '@nestjs/typeorm';**
```

**TypeOrmModule** faz a gestão da base de dados.

Lembrando que o imports abaixo está configurado para usar o sqlite e obviamente deve ser diferente para outras bases de dados

```
@Module({
  imports: [
    **TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [],
      synchronize: true,
    }),**
    UsersModule, 
    ReportsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
```
