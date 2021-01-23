# cnMessage

### Introduction

a simple chat room build with react, apollo, and graphql

### Deploy link

https://cnmessage.herokuapp.com/login

### Quick start

- installation
  ```
  npm install (or yarn)
  ```
- requirement

  - change MONGODB_URL link in `.env` file

- run server
  ```
  yarn server
  ```
- run app
  ```
  yarn client
  ```
- build app

  - change NODE_ENV to production in `.env` file

  ```
  yarn build
  yarn start
  ```

- deploy

  ```
  heroku git:remote cnmessage
  git push heroku master
  ```

### features

- [x] Add friend
- [x] File transfer
- [ ] Screen share
- [ ] Live stream
