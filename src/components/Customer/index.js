import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    IconButton
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Form from '../Form';

const Customer = () => {
    const [rowData, setRowData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formState, setFormState] = useState({ name: '', contact: '', userId: '' });
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [open, setOpen] = useState(false);
    const [formOpen, setFormOpen] = useState("main");
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get("https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet");
                const fetchedData = response.data;
                setRowData(fetchedData);
                setFilteredData(fetchedData); // Initialize filtered data
            } catch (error) {
                console.error('Error fetching details', error);
            }
        };
        fetchDetail();
    }, []);

    useEffect(() => {
        const filtered = rowData.filter(row =>
            row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.userId.toString().includes(searchQuery)
        );
        setFilteredData(filtered);
    }, [searchQuery, rowData]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = () => {
        const isAsc = order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        const sortedData = [...filteredData].sort((a, b) => {
            return isAsc ? a.userId - b.userId : b.userId - a.userId;
        });
        setFilteredData(sortedData);
    };

    // Ensure data is sorted in ascending order by default
    useEffect(() => {
        handleSort();
    }, [rowData]); // Run handleSort when rowData changes

    const handleFormSubmit = async () => {
        const { name, contact, userId } = formState;
        const formData = { name, contact, userId };
        console.log(formData);
        try {
            await axios.put(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet/userId/${formData.userId}`, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error updating entry', error);
        }
    };

    const handleEdit = (row) => {
        setFormOpen("editId");
        setIsEdit(true);   
        setFormState(row);  // Ensure form state is populated with the selected row's data
        setOpen(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet/userId/${userId}`)&&
            await axios.delete(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/userId/${userId}`);
            
            window.location.reload();
        } catch (error) {
            console.error('Error deleting entry', error);
        }
    };

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (!rowData.length) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: "160px" }}>
            <Box my={4}>
                
                <Paper elevation={2} style={{ padding: "32px", margin: "16px 0px" }}>
                    <Typography
                        variant="h6"
                        component="h1"
                        gutterBottom
                        mt={2}
                        align='left'
                        
                    >
                        Customer List
                    </Typography>
                    <Box mb={2} align="left"
                        style={{ margin: "32px 0px", display: "flex", justifyContent: "space-between", }}>
                        <TextField
                            variant="standard"
                            placeholder="Search..."
                            style={{ width: "40%" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                    <Table style={{ margin: "32px 0px" }} className={isSmallScreen ? 'responsive-table' : ''}>
                        <TableHead>
                            <TableRow>
                                <TableCell className='table-header'><strong>Name</strong></TableCell>
                                <TableCell className='table-header'><strong>Contact</strong></TableCell>
                                <TableCell className='table-header'>
                                    <TableSortLabel
                                        active={true}
                                        direction={order}
                                        onClick={handleSort}
                                    >
                                        <strong>ID</strong>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='table-header'><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell data-label="Name">{row.name}</TableCell>
                                    <TableCell data-label="Contact">{row.contact}</TableCell>
                                    <TableCell data-label="UserId">{row.userId}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(row)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(row.userId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                {isEdit &&
                    <Form
                        open={open}
                        setOpen={setOpen}
                        handleSubmit={handleFormSubmit}
                        formState={formState}
                        setFormState={setFormState}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        data={rowData}
                        setFormOpen={setFormOpen}
                        formOpen={formOpen}
                    />
                    }
               
            </Box>
        </Container>
    );
};

export default Customer;

