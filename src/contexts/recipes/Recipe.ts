
export interface RecipeSearchResponse {
    id?: String,
    content? : Recipe[]
}

export interface Recipe {
    id?: String,
    title?: String,
    description? : String,
    ingredients? : Ingredient[]
    instructions? : Instruction[]

}

export interface Ingredient {
    name? : String,
    unit? : String,
    qty?: String
}

export interface Instruction {
    text? : String
}