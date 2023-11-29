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

class ViewOrders extends Component {
  state = {
    orders: [],
    error: null,
    searchParams: {
      OrderID: "",
      OrderDate: "",
      SupplierID: "",
      ItemID: "",
    },
  };

  componentDidMount() {
    this.fetchOrdersData();
  }

  fetchOrdersData = () => {
    const { searchParams } = this.state;
    let searchQuery = "?";

    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        searchQuery += `${key}=${searchParams[key]}&`;
      }
    });

    fetch(`${API_BASE_URL}/Orders${searchQuery}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ orders: data.orders });
        console.log(data.orders);
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
    this.fetchOrdersData();
  };

  render() {
    const { orders, error, searchParams } = this.state;

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
            Orders
          </Heading>
        </a>
      </Box>
    );

    return (
      <Grommet full={true} theme={theme}>
        <Box fill={true} direction="column">
          <Header />
          <Box flex="grow">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell scope="col" border="bottom">
                    OrderID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    OrderDate
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    SupplierID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    ItemID
                  </TableCell>
                </TableRow>
                {orders.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box pad="medium">
            <div className="container">
              <input
                type="text"
                placeholder="Search OrderID"
                name="OrderID"
                value={searchParams.OrderID}
                onChange={this.handleInputChange}
              />
              <input
                type="date"
                name="OrderDate"
                value={searchParams.OrderDate}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Search Supplier ID"
                name="SupplierID"
                value={searchParams.SupplierID}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Search Item ID"
                name="ItemID"
                value={searchParams.ItemID}
                onChange={this.handleInputChange}
              />
              <button onClick={this.handleSubmit}>Search</button>
            </div>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default ViewOrders;
