# Running the project

**important information**: run the project in the following order.

### On go folder

```

$ docker-compose up

$ go run cmd/trade/main.go
```

### On nestjs folder

```

$ docker-compose up

$ npm install

$ npx prisma generate

$ npm run start:dev

# prisma useful commands (no need to run them)
$ npx prisma init
$ npx prisma migrate dev
$ npx prisma studio --port 5555
```

### On nextjs folder

```

$ npm install

$ npm run dev
```

### Some Used Technologies

- Golang
- Apache Kafka
- Confluent control center
- ZooKeeper
- Nestjs
- Server Sent Events
- Nextjs
- Tailwind
- Docker Compose
- MongoDB
- Microservices
- Typescript
