import React, { Component } from "react";
import {
  Box,
  Heading,
  Grommet,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Select,
} from "grommet";

import "./App.css";
import { API_BASE_URL } from "./constant/API";
import "./InputStyles.css"; // Import the CSS file for input styles

const theme = {
  global: {
    colors: {
      brand: "#000000",
      focus: "#000000",
    },
    font: {
      family: "Lato",
    },
  },
};

class ViewTableData extends Component {
  state = {
    tableOptions: [
      "Department",
      "Hospital",
      "Supplier",
      "Inventory",
      "Orders",
      "Pharmacy",
      "EquipmentRepair",
      "InventoryTransaction",
      "Employee",
    ],
    selectedTable: "Department",
    tableColumnsMap: {
      Department: [],
      Hospital: [],
      Supplier: [],
      Inventory: [],
      Orders: [],
      Pharmacy: [],
      EquipmentRepair: [],
      InventoryTransaction: [],
      Employee: [],
    },
    tableData: [],
    error: null,
    searchParams: {},
  };

  componentDidMount() {
    // Fetch columns for the initial selected table on component mount
    this.fetchTableColumns(this.state.selectedTable);
  }

  fetchTableColumns = (tableName) => {
    fetch(`${API_BASE_URL}/columns/${tableName}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        this.setState((prevState) => ({
          tableColumnsMap: {
            ...prevState.tableColumnsMap,
            [tableName]: data.columns,
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching columns:", error);
        this.setState({ error: "Failed to fetch columns" });
      });
  };

  handleTableSelect = (event) => {
    const selectedTable = event.target.value;
    this.setState({ selectedTable });
    // Fetch columns when a new table is selected
    this.fetchTableColumns(selectedTable);
  };

  fetchTableData = () => {
    const { selectedTable, searchParams } = this.state;
    let searchQuery = "?";

    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        searchQuery += `${key}=${searchParams[key]}&`;
      }
    });

    fetch(`${API_BASE_URL}/Searchall/${selectedTable}${searchQuery}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ tableData: data.inventory });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ error: "Failed to fetch data" });
      });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      searchParams: {
        ...prevState.searchParams,
        [name]: value,
      },
    }));
  };

  render() {
    const {
      tableOptions,
      selectedTable,
      tableColumnsMap,
      tableData,
      error,
    } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    const Header = () => (
      <Box
        tag="header"
        background="brand"
        pad="small"
        elevation="small"
        justify="between"
        direction="row"
        align="center"
        flex={false}
      >
        <a style={{ color: "inherit", textDecoration: "inherit" }} href="/">
          <Heading level="3" margin="none">
            HMS
          </Heading>
        </a>
      </Box>
    );

    return (
      <Grommet full={true} theme={theme}>
        <Box fill={true} direction="column">
          <Header />
          <Box pad="medium">
            <Select
              options={tableOptions}
              value={selectedTable}
              onChange={this.handleTableSelect}
            />
            <div className="container">
              {tableColumnsMap[selectedTable].map((column, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={column}
                  name={column}
                  value={this.state.searchParams[column] || ""}
                  onChange={this.handleInputChange}
                />
              ))}
              <button onClick={this.fetchTableData}>Search</button>
            </div>
            <Box flex="grow">
              <Table>
                <TableBody>
                  {tableData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default ViewTableData;
