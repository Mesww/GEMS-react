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

const Sidebar: React.FC = () => {
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
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#8B090C' : '#945d5e',
            fontWeight: isActive ? 'bold' : 'normal',
            transition: 'color 0.3s ease, font-weight 0.3s ease',
          })}
        >
          <ListItem button>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/admin/table"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#8B090C' : '#945d5e',
            fontWeight: isActive ? 'bold' : 'normal',
            transition: 'color 0.3s ease, font-weight 0.3s ease',
          })}
        >
          <ListItem button>
            <ListItemText primary="Mark Pin" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/manage-user"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#8B090C' : '#945d5e',
            fontWeight: isActive ? 'bold' : 'normal',
            transition: 'color 0.3s ease, font-weight 0.3s ease',
          })}
        >
          <ListItem button>
            <ListItemText primary="Manage User" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/summary"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#8B090C' : '#945d5e',
            fontWeight: isActive ? 'bold' : 'normal',
            transition: 'color 0.3s ease, font-weight 0.3s ease',
          })}
        >
          <ListItem button>
            <ListItemText primary="Summary" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/logout"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#8B090C' : '#945d5e',
            fontWeight: isActive ? 'bold' : 'normal',
            transition: 'color 0.3s ease, font-weight 0.3s ease',
          })}
        >
          <ListItem button>
            <ListItemText primary="Logout" />
          </ListItem>
        </NavLink>
      </List>
    </Box>
  );
};

export default Sidebar;
