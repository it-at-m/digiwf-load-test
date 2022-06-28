import { check, fail, group } from "k6";
import http from "k6/http";
import { HumanTaskDetailTO, HumanTaskTO, UserTO } from "./model";
import { Rate, Trend } from "k6/metrics";

export const BASE_URL = __ENV.ENGINE;

export const TrendRTT = new Trend("RTT");
export const RateContentOK = new Rate('Content OK');

/**
 * Start a new loadtest-process and assign the first task to the user with the userId
 *
 * @param variables
 * @param processKey
 * @param accessToken
 */
export function startProcess(variables: object, processKey: string, accessToken: string) {
    group("POST /rest/service/definition", () => {
        const url = BASE_URL + `/rest/service/definition`;
        const body = {
            "key": processKey,
            "variables": variables
        };
        const params = { headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = http.post(url, JSON.stringify(body), params);
        const success = check(response, {
            "OK": (r) => r.status === 200
        });
        RateContentOK.add(success);
        TrendRTT.add(response.timings.duration);
    });
}

/**
 * Obtain all tasks
 *
 * @param accessToken
 * @returns task list
 */
export function getTasks(accessToken: string): HumanTaskTO[] {
    return group("GET /rest/task", () => {
        const url = BASE_URL + `/rest/task`;
        const params = { headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = http.get(url, params);
        const success = check(response, {
            "OK": (r) => r.status === 200,
            "Response Body": (r) => Array.isArray(r.json())
        });
        RateContentOK.add(success);
        TrendRTT.add(response.timings.duration);

        if (!success) {
            fail(`Could not load tasks! Staus code was ${response.status}`);
        }
        return response.json() as HumanTaskTO[];
    });
}

/**
 * get a specific task by id
 *
 * @param id
 * @param accessToken
 * @returns task
 */
export function getTask(id: string, accessToken: string): HumanTaskDetailTO {
    return group("GET /rest/task/{id}", () => {
        const url = BASE_URL + `/rest/task/${id}`;
        const params = { headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = http.get(url, params);
        const success = check(response, {
            "OK": (r) => r.status === 200,
            "Response Body": (r) => !!(r.json() as HumanTaskDetailTO).variables
        });
        RateContentOK.add(success);
        TrendRTT.add(response.timings.duration);

        if (!success) {
            fail(`Could not load task ${id}! Status code was ${response.status}`);
        }

        return response.json() as HumanTaskDetailTO;
    });
}

/**
 * Obtain all open group tasks
 *
 * @param accessToken
 */
export function getOpenGroupTasks(accessToken: string): HumanTaskTO[] {
    return group("/rest/task/group/open", () => {
        const url = BASE_URL + `/rest/task/group/open`;
        const params = { headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = http.get(url, params);
        const success = check(response, {
            "OK": (r) => r.status === 200,
            "Response Body": (r) => Array.isArray(r.json())
        });
        RateContentOK.add(success);
        TrendRTT.add(response.timings.duration);

        if (!success) {
            fail(`Could not load tasks! Staus code was ${response.status}`);
        }
        return response.json() as HumanTaskTO[];
    });
}

/**
 * Assign a group task to the current user
 *
 * @param id
 * @param accessToken
 */
export function assignGroupTask(id: string, accessToken: string) {
    group("/rest/task/group/assign/{id}", () => {
        const url = BASE_URL + `/rest/task/assign/${id}`;
        const params = { headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = http.post(url, {}, params);
        const success = check(response, {
            "OK": (r) => r.status === 200
        });
        RateContentOK.add(success);
    });
}

/**
 * Finish the user task with the id and the variables
 *
 * @param id
 * @param variables
 * @param accessToken
 */
export function finishTask(id: string, variables: any, accessToken: string) {
    group("POST /rest/task", () => {
        const url = BASE_URL + `/rest/task`;
        const body = {
            "taskId": id,
            "variables": variables
        };
        const params = { headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = http.post(url, JSON.stringify(body), params);
        const success = check(response, {
            "OK": (r) => r.status === 200
        });
        RateContentOK.add(success);
        TrendRTT.add(response.timings.duration);

        if (!success) {
            fail(`Could not finish task ${id}! Status code was ${response.status}`);
        }
    });
}

/**
 * Get details for the user with the userId
 *
 * @param userId
 * @param accessToken
 * @returns user
 */
export function getUser(userId: string, accessToken: string): UserTO {
    return group("GET /rest/user/{id}", () => {
        const url = BASE_URL + `/rest/user/${userId}`;
        const params = { headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = http.get(url, params);
        const success = check(response, {
            "OK": (r) => r.status === 200,
            "Response Body": (r) => (r.json() as UserTO).lhmObjectId === userId
        });
        RateContentOK.add(success);
        TrendRTT.add(response.timings.duration);
        return response.json() as UserTO;
    });
}

/**
 * Search for a user in sso
 *
 * @param searchString
 * @param accessToken
 * @returns user
 */
export function findUser(searchString: string, accessToken: string): UserTO[] {
    return group("POST /rest/user/search", () => {
        const url = BASE_URL + `/rest/user/search`;
        const body = {"searchString": searchString};
        const params = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ accessToken }`
            }
        };
        const response = http.post(url, JSON.stringify(body), params);
        const success = check(response, {
            "OK": (r) => r.status === 200,
            "Response Body": (r) => (r.json() as UserTO[]).length > 0 && Array.isArray(r.json())
        });
        RateContentOK.add(success);
        TrendRTT.add(response.timings.duration);
        return response.json() as UserTO[];
    });
}
