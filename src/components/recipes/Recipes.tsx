import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../contexts/auth/AuthContext";
import FloatingAddButton from "../FloatingAddButton";
import RecipeModal from "./RecipeModal";
import {RecipeService} from "../../services/RecipeService";
import {Recipe} from "../../contexts/recipes/Recipe";
import {Card, CardContent, CardHeader, Grid} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const Recipes = () => {

    const userContext = useContext(AuthContext);
    const [openRecipeModal, setOpenRecipeModal] = useState(false)
    const [recipes, setRecipes] = useState<Recipe[]>()
    const [recipe, setRecipe] = useState<Recipe | null>(null)

    const refreshRecipes = () => {
        RecipeService.getRecipes().then((response) => {
            console.log("Response Recipes:" + JSON.stringify(response))
            setRecipes((response))
        })
    }

    useEffect(() => {
        refreshRecipes()
    }, [])

    return (
        <>
            <Grid  container spacing={1}>
                {recipes?.map((recipe: Recipe) => {
                    return (
                        <Grid ml={5} mt={3} mr={5} item xs={12} md={6} lg={3} xl={3}>
                            <Card>
                                <CardHeader
                                    action={
                                        <IconButton sx={{opacity: "50%"}} aria-label="settings"
                                                    onClick={() => {
                                                        console.log("Edit");
                                                        setRecipe(recipe)
                                                        setOpenRecipeModal(true)
                                                    }
                                                    }
                                        >
                                            <EditIcon fontSize={'small'}/>
                                        </IconButton>
                                    }
                                    title={recipe.title}
                                    subheader
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {recipe.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>)
                })}
                <FloatingAddButton setOpen={() => setOpenRecipeModal(true)}/>
                <RecipeModal open={openRecipeModal} handleClose={() => {
                    setOpenRecipeModal(false)
                    setRecipe(null)
                    refreshRecipes()
                }}
                             recipe={recipe}/></Grid>

        </>
    );
};

export default Recipes;
