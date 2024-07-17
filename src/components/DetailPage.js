import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, IconButton, Grid, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import Form from './Form'; // Ensure you have a Form component

const DetailPage = () => {
    const { id } = useParams();
    const [rowData, setRowData] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [editData, setEditData] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formOpen, setFormOpen] = useState("main");
    const [formState, setFormState] = useState({
        name: '',
        contact: '',
        id: '',
        quantity: '',
        total: '',
        date: '',
        timeOfDay: '',
        userId: ''
    });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get("https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25");
                const fetchedData = response.data;
                setRowData(fetchedData);
                setFilteredData(fetchedData.filter((row) => row.userId === id));
            } catch (error) {
                console.error('Error fetching details', error);
            }
        };
        fetchDetail();
    }, [id]);

    const handleFilter = () => {
        if (!rowData) return;
        const filtered = rowData.filter((row) => {
            const rowDate = row.date;
            const dateInRange = (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);
            return row.userId === id && dateInRange;
        });
        setFilteredData(filtered);
    };

    const handleEdit = (row) => {
        setFormOpen("edituserId");
        setIsEdit(true);   
        setFormState(row);  // Ensure form state is populated with the selected row's data
        setOpen(true);
    };

    const handleDelete = async (row) => {
        try {
            await axios.delete(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/id/${row.id}` );
            window.location.reload();
        } catch (error) {
            console.error('Error deleting entry', error);
        }
    };

    const handleFormSubmit = async () => {
        const { name, contact, id, quantity, total, date, timeOfDay, userId } = formState;
        const formData = { name, contact, id, quantity, total, date, timeOfDay, userId };
        console.log(formData);
        
        try {
            await axios.put(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/id/${formData.id}`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error updating entry', error);
        }
    };

    if (!filteredData) {
        return <Typography>Loading...</Typography>;
    }

    const totalSum = filteredData.reduce((sum, row) => sum + parseFloat(row.total || 0), 0);

    return (
        <Container maxWidth="lg" style={{ marginTop: "120px" }}>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: "80px" }}>
                    User Details
                </Typography>
                <Box mb={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="From Date"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="To Date"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={2}>
                            <Button 
                                fullWidth
                                style={{ padding: "16px" }}
                                variant="contained"
                                color="primary"
                                onClick={handleFilter}
                            >
                                Filter
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.contact}</TableCell>
                                    <TableCell>{row.userId}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.timeOfDay}</TableCell>
                                    <TableCell>{row.total}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(row)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(row)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={6} align="right"><strong>Total Sum</strong></TableCell>
                                <TableCell><strong>{totalSum.toFixed(2)}</strong></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
            {isEdit && (
                <Form
                    formState={formState}
                    setFormState={setFormState}
                    open={open}
                    setOpen={setOpen}
                    handleSubmit={handleFormSubmit}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    data={rowData}
                    formOpen={formOpen}
                    setFormOpen={setFormOpen}
                />
            )}
        </Container>
    );
};

export default DetailPage;
