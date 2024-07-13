import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const DetailPage = () => {
    const { id } = useParams();

    const [rowData, setRowData] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get("https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25");
                const fetchedData = response.data;
                setRowData(fetchedData);
                setFilteredData(fetchedData.filter((row) => row.id === id));
            } catch (error) {
                console.error('Error fetching details', error);
            }
        };
        fetchDetail();
    }, [id]);
    console.log(rowData,filteredData);

    const handleFilter = () => {
        if (!rowData) return;
        const filtered = rowData.filter((row) => {
            const rowDate = row.Date;

            const dateInRange = (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);

            

            return row.Id === id && dateInRange;
        });
        setFilteredData(filtered);
    };

    if (!filteredData) {
        return <Typography>Loading...</Typography>;
    }

    const totalSum = filteredData.reduce((sum, row) => sum + parseFloat(row.Total || 0), 0);

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Details
                </Typography>
                <Box mb={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <TextField
                        label="From Date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="To Date"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {/* <FormControl>
                        <InputLabel>Time of Day</InputLabel>
                        <Select
                            value={timeOfDay}
                            onChange={(e) => setTimeOfDay(e.target.value)}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="morning">Morning</MenuItem>
                            <MenuItem value="afternoon">Afternoon</MenuItem>
                            <MenuItem value="evening">Evening</MenuItem>
                        </Select>
                    </FormControl> */}
                    <Button variant="contained" color="primary" onClick={handleFilter}>
                        Filter
                    </Button>
                </Box>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.contact}</TableCell>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.timeOfDay}</TableCell>
                                <TableCell>{row.total}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={6} align="right"><strong>Total Sum</strong></TableCell>
                            <TableCell><strong>{totalSum.toFixed(2)}</strong></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
};

export default DetailPage;
