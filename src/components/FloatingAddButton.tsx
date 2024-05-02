import React from "react";
import {Button} from "@mui/material";
import {Add} from "@mui/icons-material";


interface AddButtonInterface {
    setOpen: Function
}
const FloatingAddButton = (addButtonInterface: AddButtonInterface) => {
    const {setOpen} = addButtonInterface

    return (
        <Button sx={{
            position: 'fixed',   // Fixed position
            bottom: '5vh',          // 16px from the bottom
            right: '5vw',           // 16px from the right
            backgroundColor: 'lightBlue',
            borderRadius: 28,
            height: 75,
            width: 75,
            zIndex: 1000         // To make sure it is above most other elements
        }}
                onClick={() => setOpen(true)}>
            <Add/>
        </Button>
    )
}

export default FloatingAddButton;