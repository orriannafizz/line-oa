# ![Line](https://line.me/static/c5bc5abac963fd619ec6d22240641a90/621c6/icon-line.png) Line

## Folder Structure

```
.
├── README.md
├── docker-compose.yaml # docker of PostgreSQL DB
├── nest-cli.json
├── package.json
├── prisma
│   ├── schema.prisma # prisma schema
│   └── seed
│       ├── data.ts # seed data
│       └── index.ts # init database script
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── common
│   │   ├── filters
│   │   │   ├── http-exception.filter.ts # HTTP-exception filter
│   │   │   └── http-exception.spec.ts
│   │   ├── index.ts
│   │   ├── intercepters
│   │   │   ├── transform.interceptor.ts # interceptor
│   │   │   └── transform.spec.ts
│   │   └── middlewares
│   │       ├── logger.middleware.spec.ts
│   │       └── logger.middleware.ts # logger
│   ├── main.ts
│   ├── modules
│   │   └── customer
│   │       ├── __test__
│   │       │   ├── customer.controller.spec.ts # unit and integration test for customer.controller.ts
│   │       │   ├── customer.service.spec.ts # unit test for customer.service.ts
│   │       │   └── stubs # fake data for testing
│   │       │       ├── customer.stub.ts
│   │       │       └── index.ts
│   │       ├── customer.controller.ts
│   │       ├── customer.module.ts
│   │       ├── customer.service.ts
│   │       ├── dto # data transform object
│   │       │   └── birthday-message-v6.dto.ts
│   │       └── entities # entities that implements prisma object
│   │           ├── birthday.entity.ts
│   │           └── customer.entity.ts
│   └── shared
│       ├── __test__
│       │   └── prisma.spec.ts # unit test fot prisma.service.ts
│       └── prisma.service.ts # Injectable prisma service
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

## Branch

### version1

- req:`GET` `http://localhost:3000/api/v0/customer/message/version1`
- res:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "Subject: Happy birthday!\n Happy birthday, dear Robert!\nSubject: Happy birthday!\n Happy birthday, dear Sherry!",
  "timestamp": "2023-12-05T10:18:07.403Z"
}
```

### version2

- req:`GET` `http://localhost:3000/api/v0/customer/message/version2`
- res:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "Subject: Happy birthday!\nHappy birthday, dear Robert!\nWe offer special discount 20% off for the following items:\nWhite Wine, iPhone X\nSubject: Happy birthday!\nHappy birthday, dear Sherry!\nWe offer special discount 50% off for the following items:\nCosmetic, LV Handbags",
  "timestamp": "2023-12-05T10:19:28.722Z"
}
```

### version3

- Assume that Robert is older than 49
- req:`GET` `http://localhost:3000/api/v0/customer/message/version3`
- res:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "Subject: Happy birthday! Happy birthday, dear `Robert`!\n![Happy Birthday](https://tonsofthanks.com/wp-content/uploads/2023/08/Hot-Dog-Funny-Birthday-Meme.jpg)\nSubject: Happy birthday! Happy birthday, dear `Sherry`!\n",
  "timestamp": "2023-12-05T10:21:27.487Z"
}
```

### version4

- req:`GET` `http://localhost:3000/api/v0/customer/message/version4`
- res:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "Subject: Happy birthday!\n Happy birthday, dear Yen, Robert!\nSubject: Happy birthday!\n Happy birthday, dear Chang, Sherry!",
  "timestamp": "2023-12-05T10:20:25.509Z"
}
```

### version5

- req:`GET` `http://localhost:3000/api/v0/customer/message/version5`
- res:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "Subject: Happy birthday! Robert!\n\nSubject: Happy birthday! Sherry!",
  "timestamp": "2023-12-05T10:23:48.075Z"
}
```

- Original DB: PostgreSQL
- Version5 DB: MySQL

### version6

- req:`GET` `http://localhost:3000/api/v0/customer/message/version6/json`
- res:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "title": "Subject: Happy birthday!",
      "content": "Happy birthday, dear Robert!"
    },
    {
      "title": "Subject: Happy birthday!",
      "content": "Happy birthday, dear Sherry!"
    }
  ],
  "timestamp": "2023-12-05T10:26:37.364Z"
}
```

- req:`GET` `http://localhost:3000/api/v0/customer/message/version6/xml`
- res:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "<root>\n<title>Subject: Happy birthday!</title>\n  <content>Happy birthday, dear Robert!</content>\n<title>Subject: Happy birthday!</title>\n  <content>Happy birthday, dear Sherry!</content>\n</root>",
  "timestamp": "2023-12-05T10:27:10.670Z"
}
```

## Extra Feature

### branch `master`

- github action will notificate me the ci result via line

  ![Line bot picture](/static/ci_message.png)
