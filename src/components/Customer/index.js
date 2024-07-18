import React, { useEffect, useState } from 'react';
import { Container, 
    Typography,
    Box, 
    Table,
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    TextField, 
    Paper,
    TableSortLabel,
    TablePagination,
    useMediaQuery
 } from '@mui/material';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import "./style.css"

const Customer = () => {
    const [rowData, setRowData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const isSmallScreen = useMediaQuery('(max-width:600px)');


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
            if (isAsc) {
                return a.userId - b.userId;
            } else {
                return b.userId - a.userId;
            }
        });
        setFilteredData(sortedData);
    };

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (!rowData.length) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: "160px" }}>
            <Box my={4}>
                <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                style={{ marginTop: "80px"}}
                align='left'
                ml={2}
                >
                    Customar List
                </Typography>
                <Paper elevation="2" style={{padding:"32px",margin:"16px 0px"}}>
                    <Box mb={2} align="left" 
                        style={{margin:"32px 0px", 
                                display:"flex",
                                justifyContent:"space-between",
                                }}>
                        <TextField 
                            variant="standard"
                            placeholder="Search..."
                            style={{width:"40%"}}
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
                    <Table style={{margin:"32px 0px"}} className={isSmallScreen ? 'responsive-table' : ''}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                className='table-header'
                                ><strong>Name</strong></TableCell>
                                <TableCell
                                className='table-header'
                                ><strong>Contact</strong></TableCell>
                                <TableCell className='table-header'>
                                <TableSortLabel
                                        active={true}
                                        direction={order}
                                        onClick={handleSort}
                                    >
                                        <strong>ID</strong>
                                    </TableSortLabel>
                                    </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell data-label="Name">{row.name}</TableCell>
                                    <TableCell data-label="Contact">{row.contact}</TableCell>
                                    <TableCell data-label="UserId">{row.userId}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Container>
    );
};

export default Customer;

