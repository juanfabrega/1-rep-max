# 1-rep-max

## Project setup
```
npm install
```

### Firebase Config
Follow the instructions here to initialize a firebase project to use as a DB for this app.

https://cloud.google.com/firestore/docs/client/get-firebase

### DB Structure
This project uses Firestore DB. It looks for data in the following collections, with the following schema:

`lift-types`
```js
{
  name: 'String',
  createdAt: `Firebase DateTime`,
  updatedAt: `Firebase DateTime`,
}
```

`sets`
```js
{
  bodyWeight: `Number`,
  date: `String` (`'YYYY-MM-DD'`),
  liftType: `String` (`Id of lift type`),
  reps: `Number`,
  weight: `Number`,
}
```


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Deployment
See firebase hosting deployment guide

https://firebase.google.com/docs/hosting/quickstart

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
