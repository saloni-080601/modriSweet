import React, { useEffect, useState } from 'react';
import { 
    Container, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Card, FormControl, InputLabel, Select, MenuItem, FormHelperText 
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
    const [defaulted,setDefulted] = useState(false)

    useEffect(() => {
        if (!isEdit) {
            setFormState({
                name: '',
                contact: '',
                quantity: '',
                id: '',
                total: '',
                date: '',
                timeOfDay: '',
                userId: ''
            });
        }
    }, [open, isEdit, setFormState]);

    const validate = () => {
        let tempErrors = {};
        if (!formState.userId || isNaN(formState.userId)) tempErrors.userId = "Valid ID is required";
        if (!formState.name) tempErrors.name = "Name is required";
        if (!formState.contact || !/^\d{10}$/.test(formState.contact)) tempErrors.contact = "Contact must be a 10-digit number";
        if (!formState.quantity || isNaN(formState.quantity) || formState.quantity <= 0) tempErrors.quantity = "Valid quantity is required";
        if (!formState.total || isNaN(formState.total) || formState.total <= 0) tempErrors.total = "Valid total is required";
        if (!formState.date) tempErrors.date = "Date is required";
        if (!formState.timeOfDay) tempErrors.timeOfDay = "Time of day is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    useEffect(() => {
        const selectedData = data.find(item => item.userId === formState.userId);
      
        if (selectedData) {
            setFormState(prevState => ({ ...prevState, name: selectedData.name, contact:selectedData.contact }));
            setDefulted(true)
        } else {
           setDefulted(false)
        }
    },[formState.userId])

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
        if (validate()) {
            handleSubmit();
            handleClose();
        }
    };
    console.log(formOpen)

    return (
        <Container style={{ margin: "80px 0px"}}>
            <Card sx={{ padding: "32px", display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" align="center" gutterBottom>
                    If you want to Fill the Form to add quantity of product
                </Typography>
                <Button variant="outlined" onClick={handleClickOpen} 
                sx={{border:"1px solid #B11226", color:"#B11226"}}>
                    Open Form
                </Button>
            </Card>

            <Dialog open={open} onClose={handleClose} style={{padding:"60px"}}>
                <DialogTitle>
                    {isEdit ? <Typography variant='h4'>Edit Form</Typography> : <Typography variant='h4'>Submit Form</Typography>}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={onSubmit}>
                        {( (isEdit && formOpen==="editId") || !isEdit)&&
                        <>
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
                        <TextField
                            label="Name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={!isEdit && defaulted}
                        />
                        <TextField
                            label="Contact"
                            name="contact"
                            value={formState.contact}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            error={!!errors.contact}
                            helperText={errors.contact}
                            disabled={!isEdit && defaulted}
                        />
                        </>
                        }
                         {((isEdit && formOpen==="edituserId") || !isEdit) &&
                        <>
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
                        </>
                        }
                        <DialogActions>
                            <Button onClick={handleClose} sx={{color:"#B11226"}}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" style={{background:"#B11226"}}>
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


