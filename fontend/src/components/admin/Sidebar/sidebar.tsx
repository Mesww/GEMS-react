import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Icon
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import "animate.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { User } from "../../../interfaces/user.interface";
const Sidebar: React.FC<{ userInfo: User | null }> = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const secondary = userInfo
    ? userInfo.email || "admin@email.com"
    : "admin@email.com";
  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "ออกจากระบบ!",
      text: "คุณแน่ใจใช่ไหม?",
      icon: "warning",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#8b090c",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#e2b644",
      background: "#f9f4d4",
      reverseButtons: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });

    if (isConfirmed) {
      Cookies.remove("token");
      navigate("/", { replace: true });
    }
  };
  const data = [
    {
      text: "Dashboard",
      icon: "home",
    },
    {
      text: "Mark Pin",
      icon: "add_location",
    },
    { text: "Manage User", icon: "group" },
    { text: "Summary", icon: "directions_bus" },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{
          width: isOpen ? 250 : 60,
          flexShrink: 0,
          bgcolor: "white", // Ensure the background is set
          color: "#E2B644",
          borderRadius: isOpen ? 5 : 3,
          transition: "width 0.3s ease, border-radius 0.3s ease",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Optional: Add shadow to make the border radius more prominent
        }}
      >
        <IconButton sx={{ p: 2 }} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <CloseIcon htmlColor="#8b090c" />
          ) : (
            <MenuIcon htmlColor="#8b090c" />
          )}
        </IconButton>
        {
          <List >
            <ListItem sx={{ display: "flex", justifyContent: "center" }}>
              <ListItemAvatar
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Avatar src="path-to-avatar.jpg" />
              </ListItemAvatar>
              {isOpen && <ListItemText primary="Admin" secondary={secondary} />}
            </ListItem>
            <Divider />
            {data.map(({text,icon}) => (
              <NavLink
                key={text}
                to={`/admin/${text.toLowerCase().replace(" ", "-")}`}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#8B090C" : "#945d5e",
                  fontWeight: isActive ? "bold" : "normal",
                  transition: "color 0.3s ease, font-weight 0.3s ease",
                })}
              >
                <ListItem
                  button
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#945d5e",
                    ":hover": { backgroundColor: "#f9f4d4" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      color: "#945d5e",
                    }}
                    children={<Icon>{icon}</Icon>}
                  />
                  {isOpen && <ListItemText primary={text} />}
                </ListItem>
              </NavLink>
            ))}
            <ListItem
              button
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "#945d5e",
                ":hover": { backgroundColor: "#f9f4d4" },
              }}
              onClick={handleLogout}
            >
              <ListItemIcon
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "#945d5e",
                }}
                children={<LogoutIcon />}
              />
              {isOpen && (
                <ListItemText sx={{ color: "#945d5e" }} primary="Logout" />
              )}
            </ListItem>
          </List>
        }
      </Box>
    </Box>
  );
};

export default Sidebar;
