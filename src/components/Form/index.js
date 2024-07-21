import React, { useEffect, useState } from 'react';
import {
    Container, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Card, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid
} from '@mui/material';

const Form = ({
    formState,
    setFormState,
    open,
    setOpen,
    handleSubmit,
    isEdit,
    setIsEdit,
    data,
    formOpen,
    setFormOpen

}) => {
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setIsEdit(false);
        setOpen(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
        handleClose();
        
    };

    useEffect(()=>{
       
        if ( formState.quantity || formState.price) {
            const newTotal = formState.price * formState.quantity;
            setFormState(prevState => ({ ...prevState, total: newTotal }));
        }
    },[formState.quantity, formState.price]);

    return (
        <Container style={{ margin: "80px 0" }}>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {isEdit ? <Typography variant='h4'>Edit Form</Typography> : <Typography variant='h4'>Submit Form</Typography>}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={onSubmit}>
                        {((isEdit && formOpen === "editId") || !isEdit) &&
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ID"
                                        name="userId"
                                        value={formState.userId}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.userId}
                                        helperText={errors.userId}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Contact"
                                        name="contact"
                                        value={formState.contact}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.contact}
                                        helperText={errors.contact}
                                        
                                    />
                                </Grid>
                            </Grid>
                        }
                        {((isEdit && formOpen === "edituserId") || !isEdit) &&
                            <Grid container spacing={2}>
                                 <Grid item xs={12}>
                                    <TextField
                                        label="Price"
                                        name="price"
                                        value={formState.price}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.price}
                                        helperText={errors.price}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Quantity"
                                        name="quantity"
                                        value={formState.quantity}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.quantity}
                                        helperText={errors.quantity}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Total"
                                        name="total"
                                        value={formState.total}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.total}
                                        helperText={errors.total}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Date"
                                        type="date"
                                        name="date"
                                        value={formState.date}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={!!errors.date}
                                        helperText={errors.date}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.timeOfDay}>
                                        <InputLabel>Time of Day</InputLabel>
                                        <Select
                                            name="timeOfDay"
                                            value={formState.timeOfDay}
                                            onChange={handleChange}
                                            label="Time of Day"
                                        >
                                            <MenuItem value="Morning">Morning</MenuItem>
                                            <MenuItem value="Evening">Evening</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.timeOfDay}</FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        }
                        <DialogActions>
                            <Button onClick={handleClose} sx={{ color: "#B11226" }}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ background: "#B11226" }}>
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



