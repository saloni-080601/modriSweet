import logo from './logo.svg';
import './App.css';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailPage from './components/DetailPage';
import { AppBar, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <div className='App' >
       <AppBar position="fixed" style={{background:"white"}}>
                <Toolbar>
                    <img src={require("./com-logo.jpg")} style={{width:"200px", height:"100px"}}/>
                </Toolbar>
            </AppBar>
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/detail/:id" element={<DetailPage />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
