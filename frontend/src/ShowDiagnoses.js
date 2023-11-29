import React, { Component } from "react";
import {
  Box,
  Heading,
  Grommet,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "grommet";

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

class ViewEquipmentRepair extends Component {
  state = {
    equipmentRepairState: [],
    error: null,
    searchParams: {
      EquipmentRepairID: "",
      Description: "",
      DurationToFix: "",
      ItemID: "",
    },
  };

  componentDidMount() {
    this.fetchEquipmentRepairData();
  }

  fetchEquipmentRepairData = () => {
    const { searchParams } = this.state;
    let searchQuery = "?";

    // Construct search query based on entered values
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        searchQuery += `${key}=${searchParams[key]}&`;
      }
    });

    fetch(`${API_BASE_URL}/EquipmentRepair${searchQuery}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // Receive response as JSON
      })
      .then((data) => {
        // Update the state with the received JSON data
        this.setState({ equipmentRepairState: data.equipmentRepairs });
        console.log(data.equipmentRepairs);
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

  handleSubmit = () => {
    this.fetchEquipmentRepairData();
  };

  render() {
    const { equipmentRepairState, error, searchParams } = this.state;

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
          <Box flex="grow">
            {/* Display fetched data in a table */}
            <Table>
              <TableBody>
                {/* Table Header */}
                <TableRow>
                  <TableCell scope="col" border="bottom">
                    EquipmentRepairID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    Description
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    DurationToFix
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    ItemID
                  </TableCell>
                </TableRow>

                {/* Render Table Data */}
                {equipmentRepairState.map((row, index) => (
                  <TableRow key={index}>
                    {/* Map each row data to respective columns */}
                    {Object.values(row).map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box pad="medium">
            {/* Input fields to search data */}
            <div className="container">
              <input
                type="text"
                placeholder="EquipmentRepairID"
                name="EquipmentRepairID"
                value={searchParams.EquipmentRepairID}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Description"
                name="Description"
                value={searchParams.Description}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="DurationToFix"
                name="DurationToFix"
                value={searchParams.DurationToFix}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="ItemID"
                name="ItemID"
                value={searchParams.ItemID}
                onChange={this.handleInputChange}
              />
              <button onClick={this.handleSubmit}>Go</button>
            </div>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default ViewEquipmentRepair;
