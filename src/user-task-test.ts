import { fail, group, sleep } from "k6";
import { findUser, finishTask, getTask, getTasks, getUser, startProcess } from "./api/api";
import { SharedArray } from "k6/data";
// @ts-ignore
import { scenario } from 'k6/execution';
import { Data, HumanTaskDetailTO } from "./api/model";
import { authToken } from "./api/auth-helper";
import { randFullName, randNumber, randSequence, randUserName } from "@ngneat/falso";


// helper constants
const SLEEP_DURATION = 0.3;
const USERNAME = __ENV.USERNAME;
const NAME = __ENV.NAME;
const PASSWORD = __ENV.PASSWORD;
const CLIENT_SECRET = __ENV.CLIENT_SECRET;
const PROCESS = "test-usertask-process_V01";

// generate test users with random names
const randomTestsUsers: string[] = [];
const maxTestUsers = __ENV.MAX_TESTUSERS || 10;

for (let i = 0; i < maxTestUsers; i++) {
    randomTestsUsers.push(randUserName());
}

// test users shared between iterations
const users = new SharedArray("users", () => {
    return randomTestsUsers;
});

export const options = {
    insecureSkipTLSVerify: true,
    setupTimeout: "120s",
    scenarios: {
        do_user_task: {
            executor: "shared-iterations",
            exec: "doUserTasks",
            vus: 2,
            iterations: users.length,
        }
    },
    thresholds: {
        http_req_failed: ["rate<0.01"], // http errors should be less than 1%
        http_req_duration: ["p(90)<200", "p(95)<700"], // 90% of requests should be below 200ms and 95% below 700ms
        "RTT": ["p(95)<700", "p(70)<250", "avg<100", "med<150", "min<100"],
        "Content OK": ["rate>0.95"], // 95% response status OK
    }
}

export function setup() {
    const data = authToken(CLIENT_SECRET, USERNAME, PASSWORD);

    // start process instances for testing tasks
    const ldapUser = findUser(NAME, data.access_token)
        .filter(u => u.username === USERNAME)[0];
    if (!ldapUser.lhmObjectId) {
        console.error(`Could not start new process! ${ldapUser.lhmObjectId} is missing.`);
    }

    users.forEach(testUser => {
        const variables =  {
            "FORMFIELD_User": ldapUser.lhmObjectId,
            "FORMFIELD_testuser": testUser
        };
        startProcess(variables, PROCESS, data.access_token);
    });

    const userTasks: HumanTaskDetailTO[] = [];
    getTasks(data.access_token).forEach(task => {
        // @ts-ignore
        userTasks.push(getTask(task.id, data.access_token));
    });
    data["tasks"] = userTasks;
    return data;
}

/**
 * finish user tasks in the loadtest-process
 */
export function doUserTasks(data: Data) {
    group("user-task", () => {
        if (!data.tasks) {
            fail("Tasks not available");
        }

        const testUser = users[scenario.iterationInTest];
        // @ts-ignore
        const userTasks = data.tasks.filter(task => task.variables["FORMFIELD_testuser"] === testUser && task.name === "User Task");

        // Obtain tasks to replicate scenario
        // Output is not used in this test
        getTasks(data.access_token);
        sleep(SLEEP_DURATION);

        // finish first task from the list
        if (userTasks.length === 0) {
            fail("No tasks available");
        }
        if (!userTasks[0].id) {
            fail("Task id is not defined");
        }

        const taskId = userTasks[0].id;
        const task = getTask(taskId, data.access_token);
        if (!task.variables || !task.id) {
            fail("Task does not have variables.")
        }

        const ldapUser = getUser(task.variables["FORMFIELD_User"], data.access_token);
        sleep(SLEEP_DURATION);

        const variables = {
            "FORMFIELD_stringProp1": randFullName(),
            "FORMFIELD_numberProp1": randNumber(),
            "FORMFIELD_textarea1": randSequence({ size: 100 }),
            "FORMFIELD_User": ldapUser.lhmObjectId,
            "FORMFIELD_testuser": testUser
        }
        finishTask(task.id, variables, data.access_token);
        sleep(SLEEP_DURATION);
    });
}
