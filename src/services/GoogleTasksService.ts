import axios from "axios";
import {LAUNCH_PROCEDURES_METADATA_TASK_NAME} from "../components/Constants";

const GOOGLE_TASKS_URI = 'https://tasks.googleapis.com/tasks/v1/users/@me/lists'
const GOOGLE_CREATE_TASKS_URI = 'https://tasks.googleapis.com/tasks/v1/users/@me/lists'
const API_URI = 'http://localhost:8081/tasks'

export const GoogleTasksService = {

    async listTasks(access_token: string) {
        console.log("Tasks:" + access_token)
        if (!access_token) return Promise.resolve();

        return axios
            // .get(GOOGLE_TASKS_URI, {
            .get(API_URI, {

                headers: {
                    Authorization: `Bearer ` + access_token,
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                console.log("TASKS.........")
                console.log(res)
                return res;
            })
    },

    async getMetadataTask(access_token: string) {
        return axios
            // .get(GOOGLE_TASKS_URI, {
            .get(API_URI, {
                headers: {
                    Authorization: `Bearer ` + access_token,
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                console.log("TASKS........s.")
                console.log(JSON.stringify(res?.data?.items))
                const tasks = res?.data?.items;

                const metadataTask = tasks.filter((task: any) => {
                    return task.title === LAUNCH_PROCEDURES_METADATA_TASK_NAME;
                })

                return metadataTask;
            })
    },

    async createTaskList(access_token: string, name: string,) {
        console.log("trying to create task list:" + access_token + " " + name)
        return axios
            .post(GOOGLE_TASKS_URI, {
                title: name
            }, {
                headers: {
                    Authorization: `Bearer ` + access_token,
                    Accept: 'application/json'
                },
            })
            .then((res) => {
                console.log("TASKS........s.")
                console.log(JSON.stringify(res?.data?.items))
                const tasks = res?.data?.items;

                return tasks;
            })
    },

};