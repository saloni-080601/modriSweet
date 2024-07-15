import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Paper } from '@mui/material';
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
    const [userId,setUserId]=useState("");

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25');
                const fetchedData = response.data;
    
                // Remove duplicate IDs
                const seenIds = new Set();
                const uniqueData = [];
                let maxId = 0; // Initialize maxId
    
                fetchedData.forEach(item => {
                    if (!seenIds.has(item.userId)) {
                        seenIds.add(item.userId);
                        uniqueData.push(item);
    
                        // Determine the maximum id
                        
                    }
                    maxId=item.id;
                });
                console.log(maxId+1)
                setData(uniqueData);
                setID(parseInt(maxId) + 1); // Set the next id for the new entry
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);
    
    const handleSubmit = async (formData) => {
       
        
        try {
            const response = await fetch('https://sheet.best/api/sheets/b23fdf22-f53e-4913-8a85-fd377c475e25', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        
            if (response.ok) {
                console.log('Form submitted successfully');
                // Reset form or show success message here
            } else {
                console.error('Failed to submit form');
                // Handle server errors
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle client-side errors
        }
    };
    

   

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Filter data based on search query
    const filteredData = data.filter(item =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.userId && item.userId.toString().includes(searchQuery))
    );

    return (
        <Container maxWidth="lg" style={{marginTop:"120px"}}>
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
                userId={userId}
                setUserId={setUserId}
            />
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <SearchBar onSearch={handleSearch} />
                <Paper elevation={3}>
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
                            <TableRow key={index} component={Link} to={`/detail/${row.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default Dashboard;
