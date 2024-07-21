import React, { useEffect, useState } from 'react';
import {
    Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid
} from '@mui/material';
import axios from 'axios';

const FormData = () => {
    const [errors, setErrors] = useState({});
    const [defaulted, setDefaulted] = useState(false);
    const [formState, setFormState] = useState({
        name: '',
        contact: '',
        quantity: '',
        total: '',
        date: '',
        price: '',
        timeOfDay: '',
        userId: ''
    });
    const [sheetData, setSheetData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet');
                setSheetData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const selectedData = sheetData.find(item => item.userId === formState.userId);

        if (selectedData) {
            setFormState(prevState => ({
                ...prevState,
                name: selectedData.name,
                contact: selectedData.contact
            }));
            setDefaulted(true);
        } else {
            setDefaulted(false);
            setFormState(prevState => ({
                ...prevState,
                name: "",
                contact: ""
            }));
        }
    }, [formState.userId, sheetData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(()=>{
       
        if ( formState.quantity || formState.price) {
            const newTotal = formState.price * formState.quantity;
            setFormState(prevState => ({ ...prevState, total: newTotal }));
        }
    },[formState.quantity, formState.price]);

    const validate = () => {
        let tempErrors = {};
        if (!formState.userId || isNaN(formState.userId)) tempErrors.userId = "Valid ID is required";
        if (!formState.name) tempErrors.name = "Name is required";
        if (!formState.contact || !/^\d{10}$/.test(formState.contact)) tempErrors.contact = "Contact must be a 10-digit number";
        if (!formState.quantity || isNaN(formState.quantity) || formState.quantity <= 0) tempErrors.quantity = "Valid quantity is required";
        if (!formState.total || isNaN(formState.total) || formState.total <= 0) tempErrors.total = "Valid total is required";
        if (!formState.price || isNaN(formState.price) || formState.price <= 0) tempErrors.price = "Valid price is required";
        if (!formState.date) tempErrors.date = "Date is required";
        if (!formState.timeOfDay) tempErrors.timeOfDay = "Time of day is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        const { name, contact, quantity, price, total, date, timeOfDay, userId } = formState;
        const formData = { name, contact, quantity, price, total, date, timeOfDay, userId };

        try {
            const userExistsInSheet2 = sheetData.some(item => item.userId === userId);

            if (!userExistsInSheet2) {
                const postResponse = await axios.post('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet', formData);

                if (postResponse.status === 200) {
                    console.log('Data posted to sheet2 successfully');
                } else {
                    console.error('Failed to post data to sheet2');
                }
            } else {
                console.log('User already exists in sheet2. Skipping the entry.');
            }

            const responseOriginalSheet = await fetch(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (responseOriginalSheet.ok) {
                console.log('Form submitted successfully');
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            handleSubmit();
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: "140px" }}>
            <Typography variant='h4' align='left' style={{ margin: "32px 0px 16px 0px" }}>Customer Form</Typography>
            <form onSubmit={onSubmit}>
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
                            disabled={defaulted}
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
                            disabled={defaulted}
                        />
                    </Grid>
                </Grid>
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
                <Grid container spacing={2}>
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
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ background: "#B11226", margin: "32px 0px 120px 0px", alignItems: "center", padding: "16px" }}
                >
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default FormData;
