import React, {useEffect, useState} from 'react';
import {Backdrop, CircularProgress} from "@mui/material";

interface LoadingBackDropInterface {
    isOpen: Boolean,
}

const LoadingBackDrop = ({isOpen}: LoadingBackDropInterface) => {

    const [backdropOpen, setBackdropOpen]: any = useState(isOpen);

    useEffect(() => {
        setBackdropOpen(isOpen)
    }, [isOpen])

    return (

        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={backdropOpen}
            onClick={() => setBackdropOpen(false)}
        >
            <CircularProgress color="inherit"/>
        </Backdrop>
    );
};

export default LoadingBackDrop;