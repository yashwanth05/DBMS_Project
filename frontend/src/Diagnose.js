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

class InventoryTransactions extends Component {
  state = {
    transactions: [],
    error: null,
    transactionDetails: {
      TransactionDate: "",
      Quantity: "",
      Notes: "",
      ItemID: "",
    },
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  fetchTransactions = () => {
    
    fetch(`${API_BASE_URL}/InventoryTransactions`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // Receive response as JSON
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
    this.setState((prevState) => ({
      transactionDetails: {
        ...prevState.transactionDetails,
        [name]: value,
      },
    }));
  };

  handleSubmit = () => {
    const { transactionDetails } = this.state;
    const filledFieldsCount = Object.values(transactionDetails).filter(param => param !== "").length;
  
    if (filledFieldsCount === 1) {
      this.fetchTransactions();
    } else {
      this.handleAddTransaction();
    }
  };
  


  handleAddTransaction = () => {
    const { transactionDetails } = this.state;

    fetch(`${API_BASE_URL}/AddToInventoryTransactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionDetails),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add inventory transaction");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Inventory transaction added successfully:", data);
        this.fetchTransactions(); // Fetch updated transactions
      })
      .catch((error) => {
        console.error("Error adding inventory transaction:", error);
      });
  };

  render() {
    const { transactions, error, transactionDetails } = this.state;

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
            {/* Input fields to add new transaction */}
            <div className="container">
              {/* <input
                type="text"
                placeholder="Transaction Date"
                name="TransactionDate"
                value={transactionDetails.TransactionDate}
                onChange={this.handleInputChange}
              /> */}
              <input
          type="date"
          name="TransactionDate"
          value={transactionDetails.TransactionDate}
                onChange={this.handleInputChange}
        />
              <input
                type="number"
                placeholder="Quantity"
                name="Quantity"
                value={transactionDetails.Quantity}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Notes"
                name="Notes"
                value={transactionDetails.Notes}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Item ID"
                name="ItemID"
                value={transactionDetails.ItemID}
                onChange={this.handleInputChange}
              />
              <button onClick={this.handleAddTransaction}>Add Transaction</button>
            </div>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default InventoryTransactions;
