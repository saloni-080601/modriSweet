import React, { useState, useEffect } from 'react';
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
    Card,
    FormHelperText
} from '@mui/material';

const Form = ({
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
    data,
    userId,
    setUserId
}) => {
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const selectedData = data.find(item => item.userId === userId);
        if (selectedData) {
            setName(selectedData.name);
            setContact(selectedData.contact);
        } else {
            setName('');
            setContact('');
        }
    }, [userId, data]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validate = () => {
        let tempErrors = {};
        if (!userId || isNaN(userId)) tempErrors.userId = "Valid ID is required";
        if (!name) tempErrors.name = "Name is required";
        if (!contact || !/^\d{10}$/.test(contact)) tempErrors.contact = "Contact must be a 10-digit number";
        if (!quantity || isNaN(quantity) || quantity <= 0) tempErrors.quantity = "Valid quantity is required";
        if (!total || isNaN(total) || total <= 0) tempErrors.total = "Valid total is required";
        if (!date) tempErrors.date = "Date is required";
        if (!timeOfDay) tempErrors.timeOfDay = "Time of day is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const formData = {
        id, // This will now be the next available id
        name,
        contact,
        quantity,
        total,
        date,
        timeOfDay,
        userId
    };

    const onSubmit = (e) => {
        
        if (validate()) {
            handleSubmit(formData);
            handleClose();
        }
    };

    return (
        <Container style={{ margin: "80px 0px" }}>
            <Card sx={{ padding: "32px", display: "flex", justifyContent: "space-between" }}>
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
                    <form onSubmit={onSubmit}>
                        <TextField
                            label="Id"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={!!errors.userId}
                            helperText={errors.userId}
                        />
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={!!errors.contact}
                            helperText={errors.contact}
                        />
                        <TextField
                            label="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={!!errors.quantity}
                            helperText={errors.quantity}
                        />
                        <TextField
                            label="Total"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={!!errors.total}
                            helperText={errors.total}
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
                            error={!!errors.date}
                            helperText={errors.date}
                        />
                        <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.timeOfDay}>
                            <InputLabel>Time of Day</InputLabel>
                            <Select
                                value={timeOfDay}
                                onChange={(e) => setTimeOfDay(e.target.value)}
                                label="Time of Day"
                            >
                                <MenuItem value="Morning">Morning</MenuItem>
                                <MenuItem value="Evening">Evening</MenuItem>
                            </Select>
                            <FormHelperText>{errors.timeOfDay}</FormHelperText>
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

