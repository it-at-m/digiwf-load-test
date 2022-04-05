export interface Data {
    access_token: string,
    tasks?: HumanTaskDetailTO[]
}

export interface UserTO {
    "lhmObjectId"?: string;
    "username"?: string;
    "forename"?: string;
    "surname"?: string;
    "ou"?: string;
    "department"?: string;
    "email"?: string;
}

export interface HumanTaskTO {
    "id"?: string;
    "name"? : string;
    "description"?: string;
    "processName"?: string;
    "assignee"?: string;
    "assigneeFormatted"?: string;
    "followUpDate"?: string;
    "creationTime"?: Date;
}

export interface HumanTaskDetailTO {
    "id"?: string;
    "name"?: string;
    "description"?: string;
    "processName"?: string;
    "processInstanceId"?: string;
    "assignee"?: string;
    "assigneeFormatted"? : string;
    "followUpDate"?: string;
    "creationTime"?: Date;
    "variables"?: { [key : string] : any; };
    "jsonSchema"?: { [key : string] : any; };
    "statusDocument"?: boolean;
}