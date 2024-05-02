import axios from "axios";
import {Task, TaskList} from "../contexts/tasks/Task";
import {Recipe} from "../contexts/recipes/Recipe";

const API_URI = 'http://localhost:8081/recipes'
const headers = {
    headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json'
    }
}

export const RecipeService = {

    async getRecipes() {
        return axios
            .post(API_URI + "/search", headers)
            .then((res) => {
                console.log("Search:" + JSON.stringify(res.data.content))
                return res.data.content;
            })
    },
    saveRecipe(form: Recipe) {
        return axios
            .post(API_URI, JSON.stringify(form), headers)
            .then((res) => {
                return res.data;
            })

    }
};