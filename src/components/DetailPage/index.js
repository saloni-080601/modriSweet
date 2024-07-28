import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, 
    TextField, Button, IconButton, Grid, Paper, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import Form from '../Form'; // Ensure you have a Form component
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const DetailPage = () => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const { id } = useParams();
    const [rowData, setRowData] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formOpen, setFormOpen] = useState("main");
    const [formState, setFormState] = useState({
        name: '',
        contact: '',
        price:'',
        quantity: '',
        total: '',
        date: '',
        timeOfDay: '',
        userId: ''
    });
    const [sortOrder, setSortOrder] = useState('asc'); // State to keep track of sorting order
    const [editrow,setEditrow]=useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get("https://sheet.best/api/sheets/9697d33f-b89f-4a8f-9bbc-f556da4faa22");
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

    const handleDeleteConfirmation = (userId) => {
        setUserIdToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async (row) => {
        try {
            await axios.delete(`https://sheet.best/api/sheets/9697d33f-b89f-4a8f-9bbc-f556da4faa22/id/${userIdToDelete}`);
            window.location.reload();
            setDeleteDialogOpen(false);
            setUserIdToDelete(null);
        } catch (error) {
            console.error('Error deleting entry', error);
        }
    };

    const handleFormSubmit = async () => {
        const { name, contact, quantity, total, date, timeOfDay, userId, price } = formState;
        const formData = { name, contact, quantity, total, date, timeOfDay, userId, price };
        try {
            await axios.put(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/id/${editrow.id}`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error updating entry', error);
        }
    };

    const handleSort = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            const dateA = a.date.split('/').reverse().join('-');
            const dateB = b.date.split('/').reverse().join('-');
            if (sortOrder === 'asc') {
                return new Date(dateA) - new Date(dateB);
            } else {
                return new Date(dateB) - new Date(dateA);
            }
        });
        setFilteredData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    if (!filteredData) {
        return <Typography>Loading...</Typography>;
    }

    const totalSum = filteredData.reduce((sum, row) => sum + parseFloat(row.total || 0), 0);

    return (
        <Container maxWidth="lg" style={{ marginTop: "160px" }}>
            <Box my={4}>
               
                <Paper elevation={2} style={{padding:"32px"}}>
                <Typography 
                    variant="h6"
                    component="h1" 
                    gutterBottom 
                    align='left'
                    style={{ margin:"40px 0px" }}>
                    User Details
                </Typography>
                <Box mb={4}>
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
                        <Grid item xs={12} sm={12} md={2}>
                            <Button 
                                fullWidth
                                style={{ padding: "16px" }}
                                variant="contained"
                                color="secondary"
                                onClick={handleSort}
                            >
                                Sort by Date {sortOrder === 'asc' ?  <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                    <Table className={isSmallScreen ? 'responsive-table' : ''}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sno</TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Contact</strong></TableCell>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Quantity</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Time</strong></TableCell>
                                <TableCell><strong>Total</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell data-label="Sno">{index + 1}</TableCell>
                                    <TableCell data-label="Name">{row.name}</TableCell>
                                    <TableCell data-label="Contact">{row.contact}</TableCell>
                                    <TableCell data-label="UserId">{row.userId}</TableCell>
                                    <TableCell data-label="Price">{row.price}</TableCell>
                                    <TableCell data-label="Quantity">{row.quantity}</TableCell>
                                    
                                    <TableCell data-label="Date">{row.date}</TableCell>
                                    <TableCell data-label="Time">{row.timeOfDay}</TableCell>
                                    <TableCell data-label="Total">{row.total}</TableCell>
                                    <TableCell data-label="Action">
                                        <IconButton onClick={() => {handleEdit(row);
                                            setEditrow(row);
                                        }
                                        }>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteConfirmation(row.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={8} align="right"><strong>Total Sum</strong></TableCell>
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
             <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this record? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
        </Container>
    );
};

export default DetailPage;
