import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SwipeableDrawer, TextField,} from '@mui/material';
import Typography from "@mui/material/Typography";
import {Ingredient, Instruction, Recipe} from '../../contexts/recipes/Recipe';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import {RecipeService} from "../../services/RecipeService";
import AddIcon from '@mui/icons-material/Add'
import Drawer from "@mui/material/Drawer";


interface RecipeCreateModalInterface {
    recipe: Recipe | null,
    open: boolean,
    handleClose: Function,
}

const RecipeModal = (recipeCreateModalInterface: RecipeCreateModalInterface) => {
    const {handleClose, recipe, open} = recipeCreateModalInterface;

    useEffect(() => {
        console.log("Recipe chnages: " + JSON.stringify(recipe))
        if (recipe != null) {
            setForm(recipe);
        } else {
            handleAddIngredient()
        }

    }, [recipe])

    const unitOptions = [
        'cups',
        'teaspoons',
        'tablespoons',
        'pieces',
        'liters',
        'gallons',
        'oz',
        'grams',
    ];

    const [form, setForm] = useState<Recipe>(recipe || {} as Recipe);

    const handleUnitChange = (index: any, event: any) => {
        let values = form.ingredients || [] as Ingredient[];
        values[index].unit = event.target.value;
        setForm({...form, ingredients: values});
    };

    const handleQtyChange = (index: any, event: any) => {
        let values = form.ingredients || [] as Ingredient[];
        values[index].qty = event.target.value;
        setForm({...form, ingredients: values});
    };

    const handleIngredientChange = (index: any, event: any) => {
        let values = form.ingredients || [] as Ingredient[];
        values[index].name = event.target.value;
        setForm({...form, ingredients: values});
    };

    const handleAddInstruction = () => {
        var values = form.instructions || [] as Instruction[];
        values.push({} as Instruction)
        setForm({...form, instructions: values});
    };

    const handleInstructionChange = (index: any, event: any) => {
        let values = form.instructions || [] as Instruction[];
        values[index].text = event.target.value;
        setForm({...form, instructions: values});
    };

    const handleRemoveInstruction = (index: any) => {
        let values = form.instructions || [] as Instruction[];
        values.splice(index, 1);
        setForm({...form, instructions: values});
    };

    const handleAddIngredient = () => {
        var values = form.ingredients || [] as Ingredient[];
        values.push({} as Ingredient)
        setForm({...form, ingredients: values});
    };

    const handleRemoveIngredient = (index: any) => {
        let values = form.ingredients || [] as Ingredient[];
        values.splice(index, 1);
        setForm({...form, ingredients: values});
    };

    const handleTitleChange = (event: any) => {
        setForm({...form, title: event.target.value});
    };

    const handleDescriptionChange = (event: any) => {
        setForm({...form, description: event.target.value});
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(form);
        resetForm()
    };

    const resetForm = () => {
        setForm({} as Recipe)
    }

    return (
        <Drawer
            anchor={'right'}
            transitionDuration={700}
            open={open}
            onClose={() => handleClose}
        >
            <Box component="form" onSubmit={handleSubmit}
                 sx={{width: {xs: '100%', md: '75vw'}, p: '1rem'}}
            >
                <Typography variant="h4" sx={{mb: 2}}>Recipe Form</Typography>
                <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={form.title}
                    onChange={handleTitleChange}
                    sx={{mb: 2}}
                />
                <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={form.description}
                    onChange={handleDescriptionChange}
                    sx={{mb: 2}}
                />
                {form.ingredients?.map((ingredient, index) => (
                    <Box key={index} sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                        <TextField
                            sx={{mr: 1}}
                            label="Qty"
                            variant="outlined"
                            value={ingredient.qty}
                            onChange={(event) => handleQtyChange(index, event)}
                        />

                        <FormControl sx={{minWidth: 120, mr: 1}}>
                            <InputLabel>Unit</InputLabel>
                            <Select
                                name="unit"
                                value={ingredient.unit}
                                label="Unit"
                                onChange={event => handleUnitChange(index, event)}
                            >
                                {unitOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Ingredient"
                            variant="outlined"
                            value={ingredient.name}
                            onChange={(event) => handleIngredientChange(index, event)}
                        />
                        <IconButton onClick={() => handleRemoveIngredient(index)} sx={{ml: 1}}>
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                ))}
                Ingredients<IconButton onClick={handleAddIngredient}><AddIcon sx={{borderRadius: "28px"}}/></IconButton>

                <br/>

                {form.instructions?.map((instruction, index) => (
                    <Box key={index} sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                        <TextField
                            fullWidth
                            label="Instruction"
                            variant="outlined"
                            value={instruction.text}
                            onChange={(event) => handleInstructionChange(index, event)}
                        />
                        <IconButton onClick={() => handleRemoveInstruction(index)} sx={{ml: 1}}>
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                ))}
                Instruction<IconButton onClick={handleAddInstruction}><AddIcon
                sx={{borderRadius: "28px"}}/></IconButton>

                <br/>

                <Button type="submit" onClick={() => {
                    RecipeService.saveRecipe(form).then((response) => {
                        handleClose()
                        resetForm()
                    })
                }}>Save</Button>
                <Button onClick={() => {
                    handleClose()
                    resetForm()
                }}>Cancel</Button>
            </Box>
        </Drawer>
        // </Drawer>
        // </div>
    );
}

export default RecipeModal;
