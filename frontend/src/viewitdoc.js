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

class InventoryTransactions extends Component {
  state = {
    transactions: [],
    error: null,
    searchTransactionDate: "",
    searchQuantity: "",
    searchNotes: "",
    searchItemID: "",
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  fetchTransactions = () => {
    const {
      searchTransactionDate,
      searchQuantity,
      searchNotes,
      searchItemID,
    } = this.state;

    let searchQuery = "?";

    if (searchTransactionDate) {
      searchQuery += `TransactionDate=${searchTransactionDate}&`;
    }
    if (searchQuantity) {
      searchQuery += `Quantity=${searchQuantity}&`;
    }
    if (searchNotes) {
      searchQuery += `Notes=${searchNotes}&`;
    }
    if (searchItemID) {
      searchQuery += `ItemID=${searchItemID}&`;
    }

    fetch(`${API_BASE_URL}/InventoryTransactions${searchQuery}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ transactions: data.inventoryTransactions });
        console.log(data.inventoryTransactions);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        this.setState({ error: "Failed to fetch transactions" });
      });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSearch = () => {
    this.fetchTransactions();
  };

  render() {
    const { transactions, error } = this.state;

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
            Inventory Transactions
          </Heading>
        </a>
      </Box>
    );

    return (
      <Grommet full={true} theme={theme}>
        <Box fill={true} direction="column">
          <Header />
          <Box flex="grow">
            {/* Display fetched transactions in a table */}
            <Table>
              <TableBody>
                {/* Table Header */}
                <TableRow>
                  <TableCell scope="col" border="bottom">
                    Transaction ID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    Transaction Date
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    Quantity
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    Notes
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    Item ID
                  </TableCell>
                </TableRow>

                {/* Render Table Data */}
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.TransactionID}</TableCell>
                    <TableCell>{transaction.TransactionDate}</TableCell>
                    <TableCell>{transaction.Quantity}</TableCell>
                    <TableCell>{transaction.Notes}</TableCell>
                    <TableCell>{transaction.ItemID}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box pad="medium">
            {/* Input fields for search */}
            <div className="container">
              <input
                type="text"
                placeholder="Search Transaction Date"
                name="searchTransactionDate"
                value={this.state.searchTransactionDate}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Search Quantity"
                name="searchQuantity"
                value={this.state.searchQuantity}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Search Notes"
                name="searchNotes"
                value={this.state.searchNotes}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Search Item ID"
                name="searchItemID"
                value={this.state.searchItemID}
                onChange={this.handleInputChange}
              />
              <button onClick={this.handleSearch}>Search</button>
            </div>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default InventoryTransactions;
