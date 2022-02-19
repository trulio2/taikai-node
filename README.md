## Description

NodeJs REST API where companies can create job offers and those new jobs are sent to every
user subscribed to the platform. Users can also search for individual jobs by title, description,
location, skills and technologies required and jobs from a company name

## Routes

- GET /job => Return every Job
- GET /job/key/text => Return every Job that has a text match in the key field
- GET /job/text => Return every Job that has a text match in any field
- POST /job => Create an Job (Params: title, description, skils, market, type, location, companyId)
- PUT /job/id => Update the Job with this id
- DELETE /job/id => Delete the Job with this id
- GET /company => Return every Company
- POST /company => Create an Company (Params: title, description)
- PUT /company/id => Update the Company with this id
- DELETE /company/id => Delete the Job with this id

- GET /user => Return every User
- POST /user => Create an User (Params: name, email)
- DELETE /user => Delete User by user email
- DELETE /user/id => Delete User by user id

## Stack

- NodeJs
- ExpressJs
- Prisma
- Joi
- AWS EC2
- Docker postgres:alpine

## Start

1.  `npm install` in the source folder where `package.json` is located
2.  Run in terminal `npm start`.

## File Structure

```
.
├── README.md
├── index.js
├── package.json
├── prisma
│   └── schema.prisma
└── src
    ├── routes.js
    ├── constrollers
    │   ├── CompanyController.js
    │   ├── JobController.js
    │   └── UserController.js
    └── library
        ├── emailHandler.js
        └── validade.js
```

## Links

- [Linkedin](https://www.linkedin.com/in/tulio-santos-santos/)
- [Github](https://www.github.com/trulio2)
