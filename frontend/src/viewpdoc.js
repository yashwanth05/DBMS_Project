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
    searchParams: {
      PharmacyID: "",
      HospitalID: "",
      QuantityInStock: "",
      ItemID: "",
    },
  };

  componentDidMount() {
    this.fetchPharmacyData();
  }

  fetchPharmacyData = () => {
    const { searchParams } = this.state;
    let searchQuery = "?";

    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        searchQuery += `${key}=${searchParams[key]}&`;
      }
    });

    fetch(`${API_BASE_URL}/ViewPharmacy${searchQuery}`)
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
    this.fetchPharmacyData();
  };

  render() {
    const { pharmacy, error, searchParams } = this.state;

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
                placeholder="Search PharmacyID"
                name="PharmacyID"
                value={searchParams.PharmacyID}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Search HospitalID"
                name="HospitalID"
                value={searchParams.HospitalID}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Search Quantity In Stock"
                name="QuantityInStock"
                value={searchParams.QuantityInStock}
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

export default ViewPharmacy;
