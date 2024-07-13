import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from '@mui/material';
import axios from 'axios';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import Form from './Form';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [quantity, setQuantity] = useState('');
    const [id, setID] = useState('');
    const [total, setTotal] = useState('');
    const [date, setDate] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { name, contact, id, quantity, total, date, timeOfDay };
        try {
            const response = await fetch("https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            await response.json();
            setName('');
            setContact('');
            setQuantity('');
            setID('');
            setTotal('');
            setDate('');
            setTimeOfDay('');
            setOpen(false); // Close the dialog after submitting
        } catch (error) {
            console.error('Error submitting the form', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25');
                const fetchedData = response.data;

                // Remove duplicate IDs
                const seenIds = new Set();
                const uniqueData = [];

                fetchedData.forEach(item => {
                    if (!seenIds.has(item.id)) {
                        seenIds.add(item.id);
                        uniqueData.push(item);
                    }
                });

                setData(uniqueData);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Filter data based on search query
    const filteredData = data.filter(item =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.id && item.id.toString().includes(searchQuery))
    );

    return (
        <Container maxWidth="lg">
            <Form 
                open={open} 
                setOpen={setOpen}
                handleSubmit={handleSubmit} 
                name={name} 
                setName={setName} 
                contact={contact} 
                setContact={setContact} 
                id={id} 
                setID={setID} 
                quantity={quantity} 
                setQuantity={setQuantity} 
                total={total} 
                setTotal={setTotal} 
                date={date} 
                setDate={setDate} 
                timeOfDay={timeOfDay} 
                setTimeOfDay={setTimeOfDay}
                data={data}
            />
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <SearchBar onSearch={handleSearch} />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Id</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow key={index} component={Link} to={`/detail/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.contact}</TableCell>
                                <TableCell>{row.id}</TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
};

export default Dashboard;
