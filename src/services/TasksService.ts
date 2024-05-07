import axios from "axios";
import {Task, TaskList} from "../contexts/tasks/Task";

const API_URI = 'http://localhost:8081/taskLists'

export const TasksService = {

    async createOrUpdateTasks(taskList: TaskList) {
        return axios
            .post(API_URI, JSON.stringify(taskList), {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => {
                return res.data;
            })
    },

    async listTasks() {
        return axios
            .get(API_URI, {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => {
                return res.data;
            })
    },

    async deleteTaskList(id: String) {
        return axios
            .delete(API_URI + "/" + id, {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => {
                return res.data;
            })
    },

    async listTasksByTaskListId(id: String) {
        return axios
            .get(API_URI + "/" + id + "/tasks", {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => {
                return res.data.items;
            })
    },

    async createTask(taskListId: String, task: Task) {
        return axios
            .post(API_URI + "/" + taskListId + "/tasks", JSON.stringify(task), {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => {
                return res.data;
            })
    },

    async updateTaskChecked(taskListId: String, task: Task) {
        return axios
            .put(API_URI + "/" + taskListId + "/tasks/" + task.id + "/checked", {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => {
                return res.data;
            })
    },


    async deleteTask(taskListId: String, taskId: String) {
        return axios
            .delete(API_URI + "/" + taskListId + "/tasks/" + taskId, {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => {
                return res.data;
            })
    },

};