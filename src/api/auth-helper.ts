import http from "k6/http";
import { Data } from "./model";
import { fail } from "k6";


export function authToken(client_secret: string, username: string, password: string): Data {
    const requestBody = {
        "client_id": "digitalwfV2",
        "client_secret": client_secret,
        "grant_type": "password",
        "username": username,
        "password": password
    };
    const response = http.post(__ENV.AUTH_URL, requestBody);
    const data: any = response.json();
    if (!data.access_token) {
        fail("No access_token!");
    }
    return { "access_token": data.access_token };
}
