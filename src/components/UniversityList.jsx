import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import { useEffect, useState } from "react";
import axios from "axios";

function createData(
  departmentName,
  universityName,
  universityType,
  scoreType,
  minimumRank,
  fillRate
) {
  return {
    departmentName,
    universityName,
    universityType,
    scoreType,
    minimumRank,
    fillRate,
    history: [
      {
        date: "2024",
        capacity: 66,
        enrollment: 60,
        minimumRank: 25000,
      },
      {
        date: "2023",
        capacity: 63,
        enrollment: 63,
        minimumRank: 28302,
      },
      {
        date: "2022",
        capacity: 64,
        enrollment: 64,
        minimumRank: 30302,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.departmentName}
        </TableCell>
        <TableCell align="right">{row.universityName}</TableCell>
        <TableCell align="right">{row.universityType}</TableCell>
        <TableCell align="right">{row.scoreType}</TableCell>
        <TableCell align="right">{row.minimumRank}</TableCell>
        <TableCell align="right">{row.fillRate}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell align="right">Enrollment Number</TableCell>
                    <TableCell align="right">Minimum Rank</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.capacity}</TableCell>
                      <TableCell align="right">
                        {historyRow.enrollment}
                      </TableCell>
                      <TableCell align="right">
                        {historyRow.minimumRank}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    universityName: PropTypes.number.isRequired,
    universityType: PropTypes.string.isRequired,
    scoreType: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        minimumRank: PropTypes.number.isRequired,
        capacity: PropTypes.string.isRequired,
        fillRate: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    departmentName: PropTypes.string.isRequired,
    minimumRank: PropTypes.number.isRequired,
    fillRate: PropTypes.string.isRequired,
  }).isRequired,
};

export default function UniversityList({ filters }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchDepartments = async () => {
        try {
            // Construct query parameters from filters
            const queryParams = new URLSearchParams();
            if (filters) {
                if (filters.universityName) queryParams.append('universityName', filters.universityName);
                if (filters.departmentName) queryParams.append('departmentName', filters.departmentName);
                if (filters.scoreType) queryParams.append('scoreType', filters.scoreType);
                if (filters.minimumRankMin) queryParams.append('minimumRankMin', filters.minimumRankMin);
                if (filters.minimumRankMax) queryParams.append('minimumRankMax', filters.minimumRankMax);
                // Add other filter types as needed (e.g., lastYearScore, scholarship)
            }

            const response = await axios.get(`http://localhost:5000/departments?${queryParams.toString()}`);

        setData(response.data);
        setError(null);
        } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
        }
    };

    fetchDepartments();
  }, [filters]); // Re-run effect when filters change

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(data);

  // Add a check here to ensure data is not empty before mapping
  const rows = Array.isArray(data)
    ? data.map((item) =>
        createData(
          // Map backend response fields to createData arguments
          item.name, // Assuming backend returns 'name' for department name
          item.universityName, // Assuming backend returns 'universityName'
          item.universityType, // Assuming backend returns 'universityType'
          item.type, // Assuming backend returns 'type' for score type
          item.lastYearRank, // Assuming backend returns 'lastYearRank'
          item.fillRate // Assuming backend returns 'fillRate'
          // Add other fields like lastYearScore, scholarship if needed in createData or Row component
        )
      )
    : [];

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
              <TableCell />
              <TableCell>Department Name</TableCell>
              <TableCell align="right">University Name</TableCell>
              <TableCell align="right">University Type</TableCell>
              <TableCell align="right">Score Type</TableCell>
              <TableCell align="right">Minimum Rank</TableCell>
              <TableCell align="right">Fill Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row.departmentName} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
