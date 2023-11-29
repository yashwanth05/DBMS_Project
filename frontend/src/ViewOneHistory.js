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

class ViewOneHistory extends Component {
  state = {
    medhiststate: [],
    error: null,
    searchParams: {
      ItemID: "",
      ItemName: "",
      Description: "",
      QuantityInStock: "",
      UnitPrice: "",
      SupplierID: "",
      HospitalID: "",
      OrderID: "",
    },
  };

  componentDidMount() {
    this.fetchInventoryData();
  }

  fetchInventoryData = () => {
    const { searchParams } = this.state;
    let searchQuery = "?";

    // Construct search query based on entered values
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        searchQuery += `${key}=${searchParams[key]}&`;
      }
    });

    fetch(`${API_BASE_URL}/OneHistory${searchQuery}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // Receive response as JSON
      })
      .then((data) => {
        // Update the state with the received JSON data
        this.setState({ medhiststate: data.inventory });
        console.log(data.inventory);
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
    const { searchParams } = this.state;
    const filledFields = Object.values(searchParams).filter((param) => param !== "");

    if (filledFields.length === 1) {
      this.fetchInventoryData();
    } else {
      this.addToInventory();
    }
  };

  addToInventory = () => {
    const { searchParams } = this.state;

    fetch(`${API_BASE_URL}/AddToInventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add data to inventory");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data added successfully:", data);
        // Fetch the updated inventory data after addition
        this.fetchInventoryData();
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };

  render() {
    const { medhiststate, error, searchParams } = this.state;

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
                    ItemID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    ItemName
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    Description
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    QuantityInStock
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    UnitPrice
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    SupplierID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    HospitalID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    OrderID
                  </TableCell>
                </TableRow>

                {/* Render Table Data */}
                {medhiststate.map((row, index) => (
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
                placeholder="ItemID"
                name="ItemID"
                value={searchParams.ItemID}
                onChange={this.handleInputChange}
              />
               <input
                type="text"
                placeholder="Item Name"
                name="ItemName"
                value={searchParams.ItemName}
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
                placeholder="Quantity In Stock"
                name="QuantityInStock"
                value={searchParams.QuantityInStock}
                onChange={this.handleInputChange}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                name="UnitPrice"
                value={searchParams.UnitPrice}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Supplier ID"
                name="SupplierID"
                value={searchParams.SupplierID}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Hospital ID"
                name="HospitalID"
                value={searchParams.HospitalID}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Order ID"
                name="OrderID"
                value={searchParams.OrderID}
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

export default ViewOneHistory;
