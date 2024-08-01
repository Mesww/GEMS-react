// TableComponent.tsx
import React from "react";
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
  Chip,
  Button,
  IconButton,
  CssBaseline,
  Container,
  Grid,
} from "@mui/material";
import { Visibility, Edit, Delete, VisibilityOff } from "@mui/icons-material";

interface Data {
  trackingId: string;
  latitude: string;
  longitude: string;
  date: string;
  status: string;
}

const rows: Data[] = [
  {
    trackingId: "#20462",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "13/05/2022",
    status: "Active",
  },
  {
    trackingId: "#18933",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "22/05/2022",
    status: "Active",
  },
  {
    trackingId: "#45169",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "15/06/2022",
    status: "Inactive",
  },
  {
    trackingId: "#34304",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "06/09/2022",
    status: "Active",
  },
  {
    trackingId: "#17188",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "25/09/2022",
    status: "Inactive",
  },
  {
    trackingId: "#73003",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "04/10/2022",
    status: "Active",
  },
  {
    trackingId: "#58825",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "17/10/2022",
    status: "Active",
  },
  {
    trackingId: "#44122",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "24/10/2022",
    status: "Active",
  },
  {
    trackingId: "#89094",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "01/11/2022",
    status: "Active",
  },
  {
    trackingId: "#85252",
    latitude: "44.46852",
    longitude: "-110.84268",
    date: "22/11/2022",
    status: "Inactive",
  },
];

const TableComponent: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
              <Button variant="contained" color="error" sx={{ mb: 2 }}>
                + Add Pin
              </Button>
            </Grid>
            <Paper sx={{ width: "100%", mb: 2 , borderRadius: 4 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                        Tracking ID
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                        Latitude
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                        Longitude
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.trackingId}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.trackingId}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.latitude}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.longitude}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.date}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Chip
                              label={row.status}
                              color={
                                row.status === "Active" ? "success" : "error"
                              }
                              sx={{
                                borderColor:
                                  row.status === "Active" ? "green" : "red",
                              }}
                              //   variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                               sx={{color:
                                row.status === "Active" ? "green" : "#A30D11"
                              }}
                            >
                              {row.status === "Active" ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                            <IconButton
                              sx={{ color: "#E2B644" }} // Custom color applied here
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              sx={{ color: "#A30D11" }} // Custom color applied here
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
                rowsPerPageOptions={[5]}
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
    </div>
  );
};

export default TableComponent;
