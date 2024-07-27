import './App.css';
import FormData from './components/Form/FormData';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import DetailPage from './components/DetailPage';
import { AppBar, Button, Toolbar } from '@mui/material';
import shoploog from './icemodri.svg';
import Customer from "./components/Customer";

function App() {
  return (
    <Router>
      <div className='App'>
        <AppBar position="fixed" style={{ background: "white", display: "flex", justifyContent: "space-between" }}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <Toolbar>
            <img src={shoploog} alt="logo" style={{ width: "200px", height: "100px", cursor: "pointer" }} onClick={() => window.location.href = "/"} />
          </Toolbar>
          <Toolbar>
            <NavLink to="/" style={({ isActive }) => ({
              color: isActive ? "#F38872" : "black",
              textDecoration: 'none',
              padding: "16px",
              borderRadius: "10px",
              fontWeight: 'bold'
            })}>
              Home
            </NavLink>
            <NavLink to="/dashboard" style={({ isActive }) => ({
              color: isActive ? "#F38872" : "black",
              textDecoration: 'none',
              padding: "16px",
              borderRadius: "10px",
              fontWeight: 'bold'
            })}>
              Dashboard
            </NavLink>
            <NavLink to="/customer" style={({ isActive }) => ({
              color: isActive ? "#F38872" : "black",
              textDecoration: 'none',
              padding: "16px",
              borderRadius: "10px",
              fontWeight: 'bold'
            })}>
              Customer
            </NavLink>
          </Toolbar>
          </div>
        </AppBar>
        <div style={{ marginTop: "100px" }}> {/* Add margin to push content below the AppBar */}
          <Routes>
            <Route path="/" element={<FormData />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/detail/:id" element={<DetailPage />} />
          </Routes>
        </div>
       </div>
    </Router>
  );
}

export default App;
