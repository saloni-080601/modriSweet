import React, { useEffect, useState } from 'react';
import { Container, 
    Box, 
    Typography, 
    Paper, 
    Toolbar, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    TableSortLabel, 
    Button, 
    TablePagination, 
    useMediaQuery,
    Grid} from '@mui/material';
import axios from 'axios';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import Form from '../Form';
import { Edit, Delete } from '@mui/icons-material';
import './style.css';


const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [formState, setFormState] = useState({
        name: '',
        contact: '',
        quantity: '',
        total: '',
        price:'',
        date: '',
        timeOfDay: '',
        userId: ''
    });
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isEdit, setIsEdit] = useState(false);
    const [formOpen, setFormOpen] = useState("main");
    const [sheetData, setSheetData] = useState([]);
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        fetchData();
    }, []);



    const fetchData = async () => {
        try {
            const response = await axios.get('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25');
            let fetchedData = response.data;
    
            // Sort data by userId in ascending order
            fetchedData = fetchedData.sort((a, b) => a.userId - b.userId);
    
            const seenIds = new Set();
            const uniqueData = [];
    
            fetchedData.forEach(item => {
                if (!seenIds.has(item.userId)) {
                    seenIds.add(item.userId);
                    uniqueData.push(item);
                }
            });
            setData(uniqueData);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };
    
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/tabs/employesheet');
                setSheetData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }
       fetchData();
    },[]);

    

    const handleSubmit = async () => {
        const { name, contact, quantity,price, total, date, timeOfDay, userId } = formState;
        const formData = { name, contact, quantity,price, total, date, timeOfDay, userId };

        try {
            
            // Post data to the original sheet
            const responseOriginalSheet = await fetch(`https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25/userId/${formData.userId}`, {
                method:"PUT",
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
    const handleSort = () => {
        const isAsc = order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        const sortedData = [...data].sort((a, b) => {
            if (isAsc) {
                return a.userId - b.userId;
            } else {
                return b.userId - a.userId;
            }
        });
        setData(sortedData);
    };


    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    return (
        <Container maxWidth="lg" style={{ marginTop: "140px" }}>
            {isEdit &&
            <Form
                open={open}
                setOpen={setOpen}
                handleSubmit={handleSubmit}
                formState={formState}
                setFormState={setFormState}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                data={sheetData}
                setFormOpen={setFormOpen}
                formOpen={formOpen}
            />
            }

            <Box my={4}>
            <Paper elevation={4} style={{ marginTop: "16px", padding: "32px", }}>
                    <Typography 
                    variant='h6'
                    gutterBottom 
                    align='left' 
                    mt={2}
                    ml={2}
                    >
                    Dashboard
                    </Typography>
                
                
                    <Grid container spacing={2} style={{padding:"16px"}}>
                        <Grid  item xs={12} sm={6} md={6} align="left" ><SearchBar onSearch={handleSearch} /></Grid>
                        <Grid item xs={12} sm={6} md={6} >
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        </Grid>
                    </Grid>
                    
                        
                
                    <Table className={isSmallScreen ? 'responsive-table' : ''}>
                        <TableHead>
                            <TableRow>
                                <TableCell className='table-headcell'></TableCell>
                                <TableCell className='table-headcell'><strong>Name</strong></TableCell>
                                <TableCell className='table-headcell'><strong>Contact</strong></TableCell>
                                <TableCell className='table-headcell'>
                                    <TableSortLabel
                                        active={true}
                                        direction={order}
                                        onClick={handleSort}
                                    >
                                        <strong>ID</strong>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align='right' style={{ paddingLeft: "18px" }}><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, index) => (
                                <TableRow
                                    key={index}
                                    style={{ border: "1px", cursor: 'pointer' }}
                                    onClick={() => handleRowClick(row.userId)}
                                    className='table-row'
                                >
                                    <TableCell className='table-cell' data-label="Index">{index + 1}</TableCell>
                                    <TableCell className='table-cell' data-label="Name">{row.name}</TableCell>
                                    <TableCell className='table-cell' data-label="Contact">{row.contact}</TableCell>
                                    <TableCell className='table-cell' data-label="ID">{row.userId}</TableCell>
                                    <TableCell align='right' className='table-cell' data-label="Actions">
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
