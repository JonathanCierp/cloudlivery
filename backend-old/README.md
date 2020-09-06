# CloudLivery

Projet étudiant

## Getting Started

```
// Install dependencies, this will generate in /src/generated/nexus.ts the schema
npm install

// Feel free to use GraphQL playground at http://localhost:4000
npm run dev
```

## Example

### Use mailing

```
import { mail } = from "./mail"

mail.send([to]], [subject]], [path of template in template directory]])*/
```

#### Signup mutation

```
mutation {
  signup(lastname: "test", firstname: "test", email: "test@test.fr", password:"test") {
    token
    user {
      id
      lastname
      firstname
      email
      updatedAt
      createdAt
    }
  }
}
```

#### Signin mutation

```
mutation {
  login(email: "test@test.fr", password: "test") {
    token
    user {
      id
      lastname
      firstname
      email
      updatedAt
      createdAt
    }
  }
}
```

#### Me query

```
query {
  me {
    id
    lastname
    firstname
    email
    updatedAt
    createdAt  
  }
}

// Headers

{
  "Authorization": "Bearer `token`"
}
```

## Deployment

```
// Generate dist directory
npm run build

// Feel free to use GraphQL playground at http://localhost:4000
npm run start
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Class OK : 
* src/auth/Auth.ts ---> OK
* src/auth/CustomError.ts ---> OK (Move to error folder)
* src/auth/WebAuth.ts ---> OK
* src/auth/GoogleAuth.ts ---> OK (a finir de commenter nouvelles fonctions)
* src/permissions/index.ts ---> OK
* src/redis/Redis.ts ---> OK
* src/resolvers/index.ts ---> OK