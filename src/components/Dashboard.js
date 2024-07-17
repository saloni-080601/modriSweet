import React, { useEffect, useState } from 'react';
import {
    Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Paper,
    TablePagination, Toolbar, Button
} from '@mui/material';
import axios from 'axios';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { Edit, Delete } from '@mui/icons-material';


const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [formState, setFormState] = useState({
        name: '',
        contact: '',
        quantity: '',
        id: '',
        total: '',
        date: '',
        timeOfDay: '',
        userId: ''
    });
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isEdit, setIsEdit] = useState(false);
    const [formOpen, setFormOpen] = useState("main");

    useEffect(() => {
        fetchData();
    }, [formState.id]);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25');
            const fetchedData = response.data;

            const seenIds = new Set();
            const uniqueData = [];
            let maxId = 0;

            fetchedData.forEach(item => {
                if (!seenIds.has(item.userId)) {
                    seenIds.add(item.userId);
                    uniqueData.push(item);
                }
                maxId = parseInt(item.id, 10);
            });
            setData(uniqueData);
            setFormState(prevState => ({ ...prevState, id: maxId + 1 }));
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleSubmit = async () => {
        const { name, contact, id, quantity, total, date, timeOfDay, userId } = formState;
        const formData = { name, contact, id, quantity, total, date, timeOfDay, userId };

        try {
            // Fetch data from sheet2 to check if the user exists
            const response = await axios.get('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet');
            const sheet2Data = response.data;

            // Check if the user already exists in sheet2
            const userExistsInSheet2 = sheet2Data.some(item => item.userId === userId);

            if (!userExistsInSheet2) {
                // If the user does not exist in sheet2, proceed with posting the data
                const postResponse = await axios.post('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet', formData);

                if (postResponse.status === 200) {
                    console.log('Data posted to sheet2 successfully');
                } else {
                    console.error('Failed to post data to sheet2');
                }
            } else {
                console.log('User already exists in sheet2. Skipping the entry.');
            }

            // Post data to the original sheet
            const responseOriginalSheet = await fetch(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25${isEdit ? `/userId/${formData.userId}` : ""}`, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (responseOriginalSheet.ok) {
                console.log('Form submitted successfully');
                fetchData();
                setOpen(false);
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (event, row) => {
        event.stopPropagation();
        setFormState({
            name: row.name,
            contact: row.contact,
            id: row.id,
            quantity: row.quantity,
            total: row.total,
            date: row.date,
            timeOfDay: row.timeOfDay,
            userId: row.userId
        });
        setIsEdit(true);
        setOpen(true);
        setFormOpen("editId");
    };

    const handleDelete = async (event, userId) => {
        event.stopPropagation();
        try {
            await axios.delete(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/userId/${userId}`);
            console.log('Record deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleRowClick = (userId) => {
        navigate(`/detail/${userId}`);
    };

    const filteredData = data.filter(item =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.userId && item.userId.toString().includes(searchQuery))
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container maxWidth="lg" style={{marginTop:"120px"}}>
            <Form
                open={open}
                setOpen={setOpen}
                handleSubmit={handleSubmit}
                formState={formState}
                setFormState={setFormState}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                data={data}
                setFormOpen={setFormOpen}
                formOpen={formOpen}
            />

            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom align='left'>
                    Dashboard
                </Typography>
                <Paper elevation={4} style={{marginTop: "32px",padding: "16px",}}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <SearchBar onSearch={handleSearch} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Toolbar>
                    <Table style={{minWidth:"650px"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Contact</strong></TableCell>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell align='right' style={{paddingLeft:"18px"}}><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, index) => (
                                <TableRow
                                    key={index}
                                    style={{ border: "1px", cursor: 'pointer' }}
                                    onClick={() => handleRowClick(row.userId)}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.contact}</TableCell>
                                    <TableCell>{row.userId}</TableCell>
                                    <TableCell align='right'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(event) => handleEdit(event, row)}
                                        >
                                            <Edit />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={(event) => handleDelete(event, row.userId)}
                                            style={{ marginLeft: '8px' }}
                                        >
                                            <Delete />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;
