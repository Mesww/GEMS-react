import React from "react";
import { NavLink } from 'react-router-dom';
import {
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import Swal from 'sweetalert2';
import 'animate.css';

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999;`;
};

const Sidebar: React.FC = () => {
  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'ออกจากระบบ!',
      text: 'คุณแน่ใจใช่ไหม?',
      icon: 'warning',
      confirmButtonText: 'ยืนยัน',
      confirmButtonColor: '#8b090c',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: '#e2b644',
      background: '#f9f4d4',
      reverseButtons: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    });

    if (isConfirmed) {
      deleteCookie("token");
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        width: 250,
        flexShrink: 0,
        bgcolor: '#E2B644',
        color: 'white',
        p: 2,
      }}
    >
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar src="path-to-avatar.jpg" />
          </ListItemAvatar>
          <ListItemText primary="Admin" secondary="admin@email.com" />
        </ListItem>
        <Divider />
        {['Dashboard', 'Mark Pin', 'Manage User', 'Summary'].map((text) => (
          <NavLink
            key={text}
            to={`/admin/${text.toLowerCase().replace(' ', '-')}`}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#8B090C' : '#945d5e',
              fontWeight: isActive ? 'bold' : 'normal',
              transition: 'color 0.3s ease, font-weight 0.3s ease',
            })}
          >
            <ListItem button>
              <ListItemText primary={text} />
            </ListItem>
          </NavLink>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemText sx={{color: '#945d5e' }} primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
