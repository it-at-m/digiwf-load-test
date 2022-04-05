import { fail, group, sleep } from "k6";
import { findUser, getTasks, startProcess } from "./api/api";
import { Data } from "./api/model";
import { authToken } from "./api/auth-helper";
import { randUserName } from "@ngneat/falso";


const SLEEP_DURATION = 0.3;
// helper constants
const USERNAME = __ENV.USERNAME;
const NAME = __ENV.NAME;
const PASSWORD = __ENV.PASSWORD;
const CLIENT_SECRET = __ENV.CLIENT_SECRET;


export const options = {
    insecureSkipTLSVerify: true,
    scenarios: {
        start_user_task_process: {
            executor: "constant-vus",
            exec: "startUserTaskProcesses",
            vus: 10,
            duration: "5s"
        },
        start_group_task_process: {
            executor: "constant-vus",
            exec: "startGroupTaskProcesses",
            vus: 10,
            duration: "5s",
            startTime: "5s"
        },
        check_task_list: {
            executor: "shared-iterations",
            exec: "checkTaskList",
            vus: 5,
            iterations: 10,
            startTime: "10s"
        }
    },
    thresholds: {
        http_req_failed: ["rate<0.01"], // http errors should be less than 1%
        http_req_duration: ["p(95)<100", "p(99)<200"], // 95% of requests should be below 50ms and 99% below 100ms
        "RTT": ["p(99)<100", "p(70)<50", "avg<50", "med<30", "min<10"],
        "Content OK": ["rate>0.95"], // 95% response status OK
    }
}

export function setup() {
    return authToken(CLIENT_SECRET, USERNAME, PASSWORD);
}

/**
 * Start test-usertask-process_V01 process instances
 *
 * @param data
 */
export function startUserTaskProcesses(data: Data) {
    const process = "test-usertask-process_V01";

    group(`start-process-${process}`, () => {
        if (!data.access_token) {
            fail("Access token not available");
        }

        // Search for the user that becomes the assignee
        const ldapUser = findUser(NAME, data.access_token)
            .filter(u => u.username === USERNAME)[0];
        if (!ldapUser.lhmObjectId) {
            fail(`Could not start new process! ${ldapUser.lhmObjectId} is missing.`);
        }
        sleep(SLEEP_DURATION);

        // Start the process
        const variables =  {
            "FORMFIELD_User": ldapUser.lhmObjectId,
            "FORMFIELD_testuser": randUserName()
        };
        startProcess(variables, process, data.access_token);
        sleep(SLEEP_DURATION);
    });
}

/**
 * Start test-grouptask-process_V01 process instances
 *
 * @param data
 */
export function startGroupTaskProcesses(data: Data) {
    const process = "test-grouptask-process_V01";

    group(`start-process-${process}`, () => {
        if (!data.access_token) {
            fail("Access token not available");
        }
        // Start the process
        const variables =  {
            "FORMFIELD_testuser": randUserName()
        };
        startProcess(variables, process, data.access_token);
        sleep(SLEEP_DURATION);
    });
}

/**
 * Check the task lists performance after creating a lot of tasks
 *
 * @param data
 */
export function checkTaskList(data: Data) {
    group(`check-task-list`, () => {
        if (!data.access_token) {
            fail("Access token not available");
        }
        getTasks(data.access_token);
        sleep(SLEEP_DURATION);
    });
}
