import logo from './logo.svg';
import './App.css';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailPage from './components/DetailPage';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import shoploog from './icemodri.svg'
import Customer from "./components/Customer"

function App() {
  return (
    <div className='App' >
       <AppBar position="fixed" style={{background:"white", display:"flex", justifyContent:"space-between"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <Toolbar onClick={()=>{
                    window.location.href="/"
                }}>
                    <img src={shoploog} alt="logo" style={{width:"200px",height:"100px",}}/>
                </Toolbar>
                <Button
                variant="text" 
                style={{ color:"black",
                     cursor:"pointer",
                     marginRight:"40px",
                     padding:"32px",
                    borderRadius:"10px",
                      }}
                onClick={()=>{
                    window.location.href="/customer"
                }}
                 >
                   <strong> Customer </strong>
                </Button>
                </div>
            </AppBar>
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/detail/:id" element={<DetailPage />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
