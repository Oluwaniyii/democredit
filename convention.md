<!-- @format -->

# Project Conventions

### Intro

This section focuses on the architecture of this project as well as style suggestions.
However, they are only personal recommendations, so you can take a few things and make changes as well. <br/>
Here is a link to an empty boilerplate with the similar structure <a href="https://github.com/Oluwaniyii/node-typescript-boilerplate">Node Typescript Boilerplate</a>

Please keep in mind that this assumes you have prior knowledge of node js and will not explain what a package is.json file is and and likes

Feel free to share your unique conventions as well
<br/>
Email: ayodeleyniyii@gmail.com

### Guide

- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Service Structure](#service-structure)
- [Error Handling](#error-handling)
- [Testing](#testing)

<br>

## Architecture

A monolith architecture
which mimicks the microservice architecture by seperating service logics and providing an entry point for communication with other services this makes it easier to migrate into a microservice when the need comes

## Folder structure

The important folders:

- App
- Config
- Libraries
- Services

### app

Contains an index.ts file, which is the entry point to our application; it can be named anything, but index or app is the common convention. Also contains Utility libraries such as loggers, service providers, error middleware which handles all errors thrown in the application, and the main router or controller, in this case router.ts

### config

This contains our configuration object files. It follows the standard of npm config <a href="https://www.npmjs.com/package/config">npm config</a> which is popularly recommended

### libraries

This contains third party libraries used in our applications. It is best to seperate libraries from your main application, this makes it easy to change them in future without having to touch your main logic.

```
Bcrypt.ts
Simplecrypt.ts
index.ts
```

Where the index points to the current active library. I only use index because i am certain there won't be any need for changes anytime soon

### services

Contains our individual services ir business component

## Service Structure

A service is simply a segmented business component e.g. auth, wallet, transaction etc
this is also a recommended style by collective node js practice <a href="https://github.com/goldbergyoni/nodebestpractices?tab=readme-ov-file#1-project-architecture-practices">Node JS Best Practices</a>

<b>Each service comprises of 4 important files:</b> <br>

- API
- Controller
- IRepository(interface repository)
- ResponseFormat
- Validation
- Service

Other files are usually actions. They perform a simple domain action. e.g `AccountRegister`. `AccountLogin` . `AccountView`

### Style

- Separating the `Controller`, `Repository`, and `ResponseFormats` from `Action` removes the web layer dependency making actions independent and testable
  Also allows for more flexibility as the action is not concerned with how data is stored, it just has requests and expectations.

  > I don't care how a user data is stored, just return complete user data when I request it

  For further explanation, visit <a href="https://github.com/goldbergyoni/nodebestpractices?tab=readme-ov-file#-12-layer-your-components-with-3-tiers-keep-the-web-layer-within-its-boundaries">Node JS Best Practices</a>

- API resource formats change often, separating the `ResponseFormat` helps you have a clearer view of the resource format and you can always make changes without having to touch the main action logic

- Making use of `IRepository` gives the option to change a repository at any point in time, as long as it meets the standard of the repository interface

- `Validation`: All request validations pertaining to the service are handled here

- `Service`: This is where we expose logics that are sure to be called by other services. This makes it possible for services to talk to one another while still maintaining good separation of concerns

- `Tests`: This Folder Contains Our unit tests and related files

## Error Handling

main actions are wrapped in a try-and-catch statement in the controller which catches errors thrown from anywhere in the application and passes it to express through the next function; next(error)

The error decorator in the error middleware adjusts express default error handling to fit personal standards

<br/>

## Testing

I only focus on unit testing all actions. Integration tests are done using Postman

Check out <a href="https://www.linkedin.com/pulse/10-best-practices-javascript-testing-debugging-saleh-imran/">Unit testing best Practices with Javascript</a>
