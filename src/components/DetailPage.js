import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, IconButton, Grid, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import Form from './Form'; // Make sure you have a Form component as shown previously

const DetailPage = () => {
    const { id } = useParams();
    const [rowData, setRowData] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [editData, setEditData] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [open, setOpen] = useState(false);



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

    const handleEdit = (row, index) => {
        setEditData(row);
        setEditIndex(index);
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

    const handleFormSubmit = async (formData) => {
        try {
            // Assuming the API supports batch update for updates
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
                            style={{padding:"16px"}}
                            padding="100px"
                            variant="contained"
                             color="primary" 
                             onClick={handleFilter}>
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
                                <TableCell>Id</TableCell>
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
                                        <IconButton onClick={() => handleEdit(row, index)}>
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
            {editData && (
                <Form
                    open={open}
                    setOpen={setOpen}
                    handleSubmit={handleFormSubmit}
                    name={editData.name}
                    setName={(name) => setEditData({ ...editData, name })}
                    contact={editData.contact}
                    setContact={(contact) => setEditData({ ...editData, contact })}
                    id={editData.id}
                    userId={editData.userId}
                    setUserId={(userId)=> setEditData({...editData,userId})}
                    setID={(id) => setEditData({ ...editData, id })}
                    quantity={editData.quantity}
                    setQuantity={(quantity) => setEditData({ ...editData, quantity })}
                    total={editData.total}
                    setTotal={(total) => setEditData({ ...editData, total })}
                    date={editData.date}
                    setDate={(date) => setEditData({ ...editData, date })}
                    timeOfDay={editData.timeOfDay}
                    setTimeOfDay={(timeOfDay) => setEditData({ ...editData, timeOfDay })}
                    data={rowData}
                />
            )}
        </Container>
    );
};

export default DetailPage;

