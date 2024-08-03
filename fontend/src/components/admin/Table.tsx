import React, { useEffect, useState } from "react";
import axios, { all } from "axios";
import Sidebar from "./sidebar";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  IconButton,
  CssBaseline,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useCookies } from "react-cookie";

const API = import.meta.env.VITE_API || "";

// Interface for Data, excluding _id for Add
interface Data {
  _id: string; // Used for existing records
  id: string;
  name: string;
  position: string;
  route: string;
}

const TableComponent: React.FC = () => {
  const [rows, setRows] = useState<Data[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState<Data | null>(null);
  const [formData, setFormData] = useState<Omit<Data, "_id">>({
    id: "",
    name: "",
    position: "",
    route: "",
  });
  const [cookie] = useCookies(["token"]);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Data[]>(`${API}/getStation`);
        setRows(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddOpen = () => {
    setFormData({ id: "", name: "", position: "", route: "" });
    setFormError({});
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
  };

  const handleEditOpen = (row: Data) => {
    setFormData({
      id: row.id,
      name: row.name,
      position: row.position,
      route: row.route,
    });
    setCurrentRow(row);
    setFormError({});
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteOpen = (row: Data) => {
    setCurrentRow(row);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form data
  const validateForm = (): boolean => {
    const { id, name, position, route } = formData;
    let valid = true;
    const errors: { [key: string]: string } = {};

    // Clear previous errors
    // setFormError({});

    if (!id) {
      errors.id = "ID is required.";
      valid = false;
    }
    if (!name) {
      errors.name = "Name is required.";
      valid = false;
    }
    if (!position) {
      errors.position = "Position is required.";
      valid = false;
    } else if (!position.includes(",")) {
      errors.position = "Position must be in the format 'latitude, longitude'.";
      valid = false;
    }
    if (!route) {
      errors.route = "Route is required.";
      valid = false;
    }

    setFormError(errors);
    return valid;
  };

  // ADD
  const handleAddSubmit = async () => {
    if (!validateForm()) return;

    try {
      console.log("Adding station with data:", formData); // Debugging
      await axios.post(`${API}/stations/add`, formData, {
        headers: { "x-auth-token": cookie.token },
      });
      // Fetch updated data from the server to reflect changes
      const response = await axios.get<Data[]>(`${API}/getStation`);
      setRows(response.data);
      handleAddClose();
    } catch (error) {
      console.error("Failed to add station", error); // Debugging
      setError("Failed to add station");
    }
  };

  // EDIT
  const handleEditSubmit = async () => {
    if (!currentRow || !validateForm()) return;

    try {
      console.log(
        "Editing station with ID:",
        currentRow._id,
        "and data:",
        formData
      ); // Debugging
      await axios.patch(`${API}/updatestations/${currentRow._id}`, formData, {
        headers: { "x-auth-token": cookie.token },
      });
      // Fetch updated data from the server to reflect changes
      const response = await axios.get<Data[]>(`${API}/getStation`);
      setRows(response.data);
      handleEditClose();
    } catch (error) {
      console.error("Failed to update station", error); // Debugging
      setError("Failed to update station");
    }
  };

  // DELETE
  const handleDeleteSubmit = async () => {
    if (!currentRow) return;

    try {
      console.log("Deleting station with ID:", currentRow._id); // Debugging
      await axios.delete(`${API}/deletestations/${currentRow._id}`, {
        headers: { "x-auth-token": cookie.token },
      });
      // Fetch updated data from the server to reflect changes
      const response = await axios.get<Data[]>(`${API}/getStation`);
      setRows(response.data);
      handleDeleteClose();
    } catch (error) {
      console.error("Failed to delete station", error); // Debugging
      setError("Failed to delete station");
    }
  };

  const getLatitude = (position: string) => position.split(",")[0].trim();
  const getLongitude = (position: string) => position.split(",")[1].trim();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="h-0">
      <Box display="flex" height="100vh">
        <CssBaseline />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#E2B644",
            p: 3,
          }}
        >
          <Container className="p-5 rounded-xl bg-white">
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="error"
                sx={{ mb: 2 }}
                onClick={handleAddOpen}
              >
                + Add Station
              </Button>
            </Grid>
            <Paper
              sx={{
                width: "100%",
                mb: 2,
                borderRadius: 4,
                height: "600px",
                overflow: "auto",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Route
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Latitude
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Longitude
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.id}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.name}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.route}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {getLatitude(row.position)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {getLongitude(row.position)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              sx={{ color: "#E2B644" }}
                              onClick={() => handleEditOpen(row)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              sx={{ color: "#A30D11" }}
                              onClick={() => handleDeleteOpen(row)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[6, 12, { label: "All", value: -1 }]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Container>
        </Box>
      </Box>

      {/* Add Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddClose}>
        <DialogTitle>Add New Station</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to add a new station.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="ID"
            name="id"
            fullWidth
            variant="outlined"
            value={formData.id}
            onChange={handleInputChange}
            error={!!formError.id}
            helperText={formError.id}
          />
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formError.name}
            helperText={formError.name}
          />
          <TextField
            margin="dense"
            name="position"
            label="Position (latitude, longitude)"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.position}
            onChange={handleInputChange}
            error={!!formError.position}
            helperText={formError.position}
          />
          <TextField
            margin="dense"
            label="Route"
            name="route"
            fullWidth
            variant="outlined"
            value={formData.route}
            onChange={handleInputChange}
            error={!!formError.route}
            helperText={formError.route}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        PaperProps={{
          style: {
            padding: "16px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Edit Station</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the form below to edit the station.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="ID"
            name="id"
            fullWidth
            variant="outlined"
            value={formData.id}
            onChange={handleInputChange}
            error={!!formError.id}
            helperText={formError.id}
          />
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formError.name}
            helperText={formError.name}
          />
          <TextField
            margin="dense"
            label="Position (latitude, longitude)"
            name="position"
            fullWidth
            variant="outlined"
            value={formData.position}
            onChange={handleInputChange}
            error={!!formError.position}
            helperText={formError.position}
          />
          <TextField
            margin="dense"
            label="Route"
            name="route"
            fullWidth
            variant="outlined"
            value={formData.route}
            onChange={handleInputChange}
            error={!!formError.route}
            helperText={formError.route}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            color="error"
            sx={{
              backgroundColor: "#FF4D4F",
              color: "white",
              "&:hover": {
                backgroundColor: "#FF1A1A",
                boxShadow: "0 4px 8px rgba(255, 0, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="success"
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": {
                backgroundColor: "#388E3C",
                boxShadow: "0 4px 8px rgba(0, 255, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        PaperProps={{
          style: {
            padding: "8px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Delete Station</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography component="span" color="error">
              {`Are you sure you want to delete `}
              <strong>{currentRow?.name}</strong>
              {` station?`}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            color="error"
            sx={{
              backgroundColor: "#FF4D4F",
              color: "white",
              "&:hover": {
                backgroundColor: "#FF1A1A",
                boxShadow: "0 4px 8px rgba(255, 0, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteSubmit}
            color="success"
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": {
                backgroundColor: "#388E3C",
                boxShadow: "0 4px 8px rgba(0, 255, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableComponent;
