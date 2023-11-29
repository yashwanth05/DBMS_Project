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

class ViewPharmacy extends Component {
  state = {
    pharmacy: [],
    error: null,
    newPharmacyData: {
      HospitalID: "",
      QuantityInStock: "",
      ItemID: "",
    },
  };

  componentDidMount() {
    this.fetchPharmacyData();
  }

  fetchPharmacyData = () => {
    fetch(`${API_BASE_URL}/ViewPharmacy`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // Receive response as JSON
      })
      .then((data) => {
        // Update the state with the received JSON data
        this.setState({ pharmacy: data.pharmacy });
        console.log(data.pharmacy);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ error: "Failed to fetch data" });
      });
  };

  addToPharmacy = () => {
    const { newPharmacyData } = this.state;

    fetch(`${API_BASE_URL}/AddToPharmacy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPharmacyData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add data to pharmacy");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data added successfully:", data);
        // Fetch the updated pharmacy data after addition
        this.fetchPharmacyData();
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newPharmacyData: {
        ...prevState.newPharmacyData,
        [name]: value,
      },
    }));
  };

  render() {
    const { pharmacy, error, newPharmacyData } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <Grommet full={true} theme={theme}>
        <Box fill={true} direction="column">
          <Box flex="grow">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell scope="col" border="bottom">
                    PharmacyID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    HospitalID
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    QuantityInStock
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    ItemID
                  </TableCell>
                </TableRow>

                {pharmacy.map((row, index) => (
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
                placeholder="Hospital ID"
                name="HospitalID"
                value={newPharmacyData.HospitalID}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Quantity In Stock"
                name="QuantityInStock"
                value={newPharmacyData.QuantityInStock}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Item ID"
                name="ItemID"
                value={newPharmacyData.ItemID}
                onChange={this.handleInputChange}
              />
              <button onClick={this.addToPharmacy}>Add to Pharmacy</button>
            </div>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default ViewPharmacy;
