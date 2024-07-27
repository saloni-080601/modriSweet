import React, { useEffect, useState } from 'react';
import {
    Container, 
    TextField, 
    Button, 
    Typography,
    FormControl, 
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Radio,
    Grid,
    Paper,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
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
    const [openDialog, setOpenDialog] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false); // Track if the button has been clicked

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

    useEffect(() => {
        if (formState.quantity || formState.price) {
            const newTotal = formState.price * formState.quantity;
            setFormState(prevState => ({ ...prevState, total: newTotal }));
        }
    }, [formState.quantity, formState.price]);

    const validateField = (name, value) => {
        let tempErrors = { ...errors };
        
        switch(name) {
            case 'userId':
                tempErrors.userId = (!value || isNaN(value)) ? "Valid ID is required" : "";
                break;
            case 'name':
                tempErrors.name = value ? "" : "Name is required";
                break;
            case 'contact':
                tempErrors.contact = (!value || !/^\d{10}$/.test(value)) ? "Contact must be a 10-digit number" : "";
                break;
            case 'quantity':
                tempErrors.quantity = (!value || isNaN(value) || value <= 0) ? "Valid quantity is required" : "";
                break;
            case 'total':
                tempErrors.total = (!value || isNaN(value) || value <= 0) ? "Valid total is required" : "";
                break;
            case 'price':
                tempErrors.price = (!value || isNaN(value) || value <= 0) ? "Valid price is required" : "";
                break;
            case 'date':
                tempErrors.date = value ? "" : "Date is required";
                break;
            case 'timeOfDay':
                tempErrors.timeOfDay = value ? "" : "Time of day is required";
                break;
            default:
                break;
        }

        setErrors(tempErrors);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

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
            // First API call
            const responseOriginalSheet = await axios.post(
                'https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25',
                formData,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (responseOriginalSheet.status === 200) {
                console.log('Form submitted successfully');
            } else {
                console.error('Failed to submit form');
            }

            // Check if user exists in sheetData
            const userExistsInSheet2 = sheetData.some(item => item.userId === userId);

            if (!userExistsInSheet2) {
                // Second API call
                const postResponse = await axios.post(
                    'https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet',
                    formData
                );

                if (postResponse.status === 200) {
                    console.log('Data posted to sheet2 successfully');
                } else {
                    console.error('Failed to post data to sheet2');
                }
            } else {
                console.log('User already exists in sheet2. Skipping the entry.');
            }

            // Clear form fields after successful submission
            setFormState({
                name: '',
                contact: '',
                quantity: '',
                total: '',
                date: '',
                price: '',
                timeOfDay: '',
                userId: ''
            });
            setErrors({});
            setDefaulted(false);
            setButtonClicked(false); // Reset button state after submission

            // Open dialog to show submission success
            setOpenDialog(true);

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setButtonClicked(true); // Set button as clicked
            handleSubmit();
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth style={{ marginTop: "105px" }}>
            <Grid container >

                
                    <Grid item md={6} >
                        <Grid container>
                            <Grid item md={6}>
                            <Paper>
                                <img src={require("../assert/Coffee.jpg")} style={{ width: '100%' }} />
                            </Paper>
                            </Grid>
                            <Grid item md={6}>
                            <Paper>
                                <img src={require("../assert/IceCream.jpg")} style={{ width: '100%' }} />
                            </Paper>
                            </Grid>
                            <Grid item md={6}>
                            <Paper>
                                <img src={require("../assert/Cake.jpg")} style={{ width: '100%' }} />
                            </Paper>
                            </Grid>
                            <Grid item md={6}>
                            <Paper>
                                <img src={require("../assert/IndiaSweet.jpg")} style={{ width: '100%', height:'450px'}} />
                            </Paper>
                            </Grid>
                            <Grid item md={6}>
                            <Paper>
                                <img src={require("../assert/bread.jpg")} style={{ width: '100%', height:"500px" }} />
                            </Paper>
                            </Grid>
                            <Grid item md={6}>
                            <Paper>
                                <img src={require("../assert/StockCake.jpg")} style={{ width: '100%', height:"500px" }} />
                            </Paper>
                            </Grid>
                        
                          
                        </Grid>
                    </Grid>
                
                <Grid item xs={12} sm={6} md={6}>
                    
                    <Paper elevation={3} style={{ padding: "32px", marginBottom:"120px",borderRadius:"32px"}}>
                    <Typography variant='h6' align='left' style={{ margin: "32px 0px 16px 0px" }}>Customer Form</Typography>
                    <form onSubmit={onSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="ID"
                                    name="userId"
                                    value={formState.userId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    onBlur={handleBlur}
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
                                    onBlur={handleBlur}
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
                                onBlur={handleBlur}
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
                                    onBlur={handleBlur}
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
                                    onBlur={handleBlur}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.total}
                                    helperText={errors.total}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    name="date"
                                    value={formState.date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                            <FormControl component="fieldset" fullWidth margin="normal" error={!!errors.timeOfDay}>
                                <FormLabel component="legend" align="left" style={{marginBottom:"16px"}}>Time of Day</FormLabel>
                                <RadioGroup
                                    aria-label="timeOfDay"
                                    name="timeOfDay"
                                    value={formState.timeOfDay}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue="Morning"
                                    style={{ display: "flex", flexDirection: "row" }}
                                >
                                    <FormControlLabel value="Morning" control={<Radio />} label="Morning" />
                                    <FormControlLabel value="Evening" control={<Radio />} label="Evening" style={{marginLeft:"32px"}}/>
                                </RadioGroup>
                                <FormHelperText>{errors.timeOfDay}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ background: buttonClicked ? "#F36054" : "#F38872", margin: "32px 0px 40px 0px", alignItems: "center", padding: "16px" }}
                        >
                            Submit
                        </Button>
                    </form>
                    </Paper>
            </Grid>
            </Grid>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Submission Successful</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The form has been submitted successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} style={{ color: "#F38872" }}>
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FormData;
