import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper } from '@mui/material';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const Customer = () => {
    const [rowData, setRowData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

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

    if (!rowData.length) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: "120px" }}>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: "80px" }}>
                    User Details
                </Typography>
                <Box mb={2} align="left" style={{margin:"32px 0px",}}>
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
                </Box>
                <Paper >
                    <Table style={{margin:"32px 0px"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Contact</strong></TableCell>
                                <TableCell><strong>ID</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.contact}</TableCell>
                                    <TableCell>{row.userId}</TableCell>
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

