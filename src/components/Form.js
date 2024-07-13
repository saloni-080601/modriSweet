// src/components/Form.js
import React, { useState,useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card
} from '@mui/material';

import axios from 'axios';

const Form = (
    {
        name,
        setName,
        contact,
        setContact,
        id,
        setID,
        quantity,
        setQuantity,
        total,
        setTotal,
        date,
        setDate,
        timeOfDay,
        setTimeOfDay,
        open,
        setOpen,
        handleSubmit,
        data
    
    }
) => {
    useEffect(() => {
        // Find the entry corresponding to the entered ID
        const selectedData = data.find(item => item.id === id);
        if (selectedData) {
            setName(selectedData.name);
            setContact(selectedData.contact);
        } else {
            setName('');
            setContact('');
        }
    }, [id, data]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container style={{margin:"64px 0px"}}>
            <Card sx={{padding:"32px", display:"flex", justifyContent:"space-between"}}>
            <Typography variant="body1" align="center" gutterBottom>
                If you want to Fill the Form to add quantity of product
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open Form
            </Button>
            </Card>
           
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Submit Form</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                    <TextField
                            label="Id"
                            value={id}
                            onChange={(e) => setID(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                       
                        <TextField
                            label="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Total"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel>Time of Day</InputLabel>
                            <Select
                                value={timeOfDay}
                                onChange={(e) => setTimeOfDay(e.target.value)}
                                label="Time of Day"
                            >
                                <MenuItem value="Morning">Morning</MenuItem>
                                <MenuItem value="Evening">Evening</MenuItem>
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default Form;

