# load tests with k6


## Overview Lasttests

Currently, only load tests are available for digiWF-Engine.

### DigiWF Engine

Start the digiWF engine with the profile `loadtest`.
The `loadtest` profile deploys the processes and json schemas required for the load tests automatically.

#### load tests starting processes

[src/start-process-test.ts](../src/start-process-test.ts)

##### Setup

Obtain an authentication token and pass it to the scenarios.

##### Scenarios

1. Start user task process

Start as many *test-usertask-process_V01* (`load test-usertask-process.bpmn`) processes as possible in a defined time.

2. Start group task process

Start as many *test-grouptask-process_V01* (`load test-grouptask-process.bpmn`) processes as possible in a defined time.

3. Check task list performance

Get all tasks assigned to the user.

##### Goals

* Verify that starting processes works
* Verify the task lists performance

#### load test single usertasks

[src/user-task-test.ts](../src/user-task-test.ts)

Execute the *test-usertask-process_V01* (`load test-usertask-process.bpmn`) process by a defined number of virtual users. 
The number of users is customizable with the environment variable `MAX_TESTUSERS`.

![load test Usertask](img/load test-usertask-process.png)

##### Setup

* Obtain an authentication token
* Start processes and obtains tasks details
  * Note: It's not possible to assign tasks to virtual users. Therefore, the tasks are assigned to the logged in user and the virtual user that executes the task is passed as a variable (`FORMFIELD_testuser`). To obtain the data from `FORMFIELD_testuser` we have to query the task details api for every task.
* Pass the task list and the token to the scenarios

##### Scenarios

1. Do user task

The *do user task* scenario follows the workflow of getting a user task and finishing it.
Therefor the following steps are simulated:

1. Get all tasks that are assigned to the user and pick one
2. Get the task details for the picked task
3. Perform requests to get additional requests like get the users `lhmObjectId`
4. Fill out the form to finish the task

##### Goals

* Verify task list performance
* Verify performance of executing user tasks

#### load test process with group assignments

[src/group-task-test.ts](../src/group-task-test.ts)

This load test is very similar to the previous test.
This test uses the *test-grouptask-process_V01* (`load test-grouptask-process.bpmn`) process and assigns task to the group *ITM-KM8*.
Again this task is executed by a defined amount of virtual users.
The number of users is customizable with the environment variable `MAX_TESTUSERS`.

![load test Grouptask](img/load test-grouptask-process.png)

##### Setup

* Obtain an authentication token
* Start processes and obtains tasks assigned to the group *ITM-KM8* details
    * Note: It's not possible to assign tasks to virtual users. Therefore, the tasks are assigned to the logged in user and the virtual user that executes the task is passed as a variable (`FORMFIELD_testuser`). To obtain the data from `FORMFIELD_testuser` we have to query the task details api for every task.
* Pass the task list and the token to the scenarios

##### Scenarios

1. Do group task

The *do group task* scenario follows the workflow of getting a user task that is assigned to a user group and finish this task.
Therefor the following steps are simulated:

1. Get all tasks that are assigned to the group *ITM-KM8*
2. Get the task details for the picked task
3. Assign the task to the current user
5. Fill out the form to finish the task

##### Goals

* Verify task list for group assignments performance 
* Verify performance of assigning user tasks and finishing them


## Develop load tests

Checkout k6s documentation:

* [K6 Documentation](https://k6.io/docs/getting-started/running-k6/)
* [K6 Examples](https://k6.io/docs/examples/)
* [Typescript Template](https://github.com/grafana/k6-template-typescript)

### Setup dev environment

We use k6 and typescript to create our load tests. K6 is a go application that executes test cases written in javascript.
Therefore, it is required to install k6 and nodejs. Nodejs is used to compile the typescript tests to javascript.

There are multiple ways to run k6 including docker. The full list of install options is available at [k6.io](https://k6.io/docs/getting-started/installation/).

For developers at it@m it is recommended to set up wsl and follow the linux (debian/ubuntu) installation instructions ([https://k6.io/docs/getting-started/installation/](https://k6.io/docs/getting-started/installation/)).

### Install javascript dependencies

Run `npm install` to install all required javascript/typescript dependencies. We use the following libraries to develop load tests:

* **k6** javascript api
* **webpack** and **babel** for compiling typescript to javascript and bundling
* **typescript**
* **falso** to generate fake data

### Execute tests

1. Compile the test sources from typescript to javascript

```
npm run build
```

2. Set required env variables

```
# set required env variables
export ENGINE="http://localhost:39147"
export AUTH_URL="https://ssodev.muenchen.de/auth/realms/P82/protocol/openid-connect/token"
export USERNAME="<your-ssodev-username>"
export NAME="<your-name>"
export PASSWORD="<your-password-for-ssodev>"
export CLIENT_SECRET="0630b79a-19ed-4f98-ac21-533f324e1cad"
```

3. Execute the tests

```
# execute tests
k6 run dist/start-process-test.js
k6 run dist/user-task-test.js
k6 run dist/group-task-test.js
```

### Repository structure

```
src/
├── api
│   ├── api.ts
│   └── model.ts
└── your-test.ts 
```

Put your api requests in `src/api/api.ts`. In `src/api/model.ts` you save the datatypes you use.
Your tests reside in the `src` folder. It's important that you name your tests `<testname>-test.ts`.
Otherwise, k6 (and webpack) won't recognize the test.

### Generate test cases from OpenAPI specification

There are various ways to install [OpenAPI generator](https://github.com/OpenAPITools/openapi-generator).

* You can follow the [K6 docs](https://k6.io/blog/load-testing-your-api-with-swagger-openapi-and-k6/) and use the Docker image of OpenAPI generator
* Or you can use the Intellij plugin [OpenAPI Generator](https://plugins.jetbrains.com/plugin/8433-openapi-generator)

So far there is no option to generate k6 tests from an OpenAPI specification using typescript.
But you can generate javascript k6 tests and transform them manually to typescript.
Additionally, you can generate the typescript datatypes.

### Deploy processes and json schemas

Add new `*.bpmn` and `*.schema.json` files to `resources/prozesse/feature/loadtest`.
Files in the directory `resources/prozesse/feature/loadtest` are automatically deployed with the `loadtest` profile activated.
