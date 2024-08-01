// TableComponent.tsx
import React from 'react';
import Sidebar from './sidebar';
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
  Typography,
  Button,
  IconButton,
  CssBaseline,
  Container,
  Grid,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

interface Data {
  trackingId: string;
  latitude: string;
  longitude: string;
  date: string;
  status: string;
}

const rows: Data[] = [
  { trackingId: '#20462', latitude: '44.46852', longitude: '-110.84268', date: '13/05/2022', status: 'Active' },
  { trackingId: '#18933', latitude: '44.46852', longitude: '-110.84268', date: '22/05/2022', status: 'Active' },
  { trackingId: '#45169', latitude: '44.46852', longitude: '-110.84268', date: '15/06/2022', status: 'Inactive' },
  { trackingId: '#34304', latitude: '44.46852', longitude: '-110.84268', date: '06/09/2022', status: 'Active' },
  { trackingId: '#17188', latitude: '44.46852', longitude: '-110.84268', date: '25/09/2022', status: 'Inactive' },
  { trackingId: '#73003', latitude: '44.46852', longitude: '-110.84268', date: '04/10/2022', status: 'Active' },
  { trackingId: '#58825', latitude: '44.46852', longitude: '-110.84268', date: '17/10/2022', status: 'Active' },
  { trackingId: '#44122', latitude: '44.46852', longitude: '-110.84268', date: '24/10/2022', status: 'Active' },
  { trackingId: '#89094', latitude: '44.46852', longitude: '-110.84268', date: '01/11/2022', status: 'Active' },
  { trackingId: '#85252', latitude: '44.46852', longitude: '-110.84268', date: '22/11/2022', status: 'Inactive' },
];

const TableComponent: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box display="flex" height="100vh">
      <CssBaseline />
        <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Container>
          <Grid container justifyContent="flex-end">
            <Button variant="contained" color="error" sx={{ mb: 2 }}>
              + Add Pin
            </Button>
          </Grid>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tracking ID</TableCell>
                    <TableCell>Latitude</TableCell>
                    <TableCell>Longitude</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.trackingId}>
                      <TableCell>{row.trackingId}</TableCell>
                      <TableCell>{row.latitude}</TableCell>
                      <TableCell>{row.longitude}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={row.status === 'Active' ? 'green' : 'red'}
                        >
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton color="secondary">
                          <Edit />
                        </IconButton>
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
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
  );
};

export default TableComponent;
