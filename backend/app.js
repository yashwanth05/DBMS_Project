var createError = require("http-errors");
var express = require("express");
var path = require("path");
//Logger that was used for debugging, commented later
// var logger = require('morgan');
var mysql = require("mysql2");
var cors = require("cors");
var port = 3000;

//Connection Info
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password07",
  database: "project_dbms",
  multipleStatements: true,
});

//Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

//Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

//Signup, Login, Password Reset Related Queries

//Checks if patient exists in database
app.get("/checkIfPatientExists", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM employee WHERE Email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

app.get("/checkIfDocExists", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM admin WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//Creates User Account
app.get("/makeAccount", (req, res) => {
  let query = req.query;
  let name = query.name;
  let email = query.email;
  let password = query.password;
  let address = query.address;
  let gender = query.gender;
  let HospitalID = query.HospitalID;
  let Department = query.Department;
  // let sqlDepartmentID = `SELECT DepartmentID FROM department WHERE DepartmentName = "${Department}"`;

  // // Define a function to handle the obtained DepartmentID
  // function handleDepartmentID(DepartmentID) {
  //   // Use DepartmentID as needed here or pass it to another function
  //   console.log(`DepartmentID obtained: ${DepartmentID}`);
  // }

  // con.query(sqlDepartmentID, function (error, results, fields) {
  //   if (error) {
  //     console.error(error);
  //     // Handle the error here
  //   } else {
  //     if (results.length > 0) {
  //       let DepartmentID = results[0].DepartmentID.toString();
  //       // Call the function to handle DepartmentID
  //       handleDepartmentID(DepartmentID);
  //     } else {
  //       console.log('No DepartmentID found');
  //     }
  //   }
  // });

  let sql_statement =
    `INSERT INTO Employee (Email, PasswordHash, Name, Address, Gender, HospitalID, DepartmentID) 
                       VALUES ` +
    `("${email}", "${password}", "${name}", "${address}", "${gender}", "${HospitalID}", "${Department}")`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      email_in_use = email;
      password_in_use = password;
      who = "pat";
      return res.json({
        data: results,
      });
    }
  });
});





//Makes Doctor Account
app.get("/makeDocAccount", (req, res) => {
  let params = req.query;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  let sql_statement =
    `INSERT INTO admin (email, gender, password, name,number) 
                       VALUES ` +
    `("${email}", "${gender}", "${password}", "${name}","${schedule}")`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      email_in_use = email;
      password_in_use = password;
      who = "doc";
      return res.json({
        data: results,
      });
    }
  });
});

//Checks if patient is logged in
app.get("/checklogin", (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM Employee
                       WHERE Email="${email}" 
                       AND PasswordHash="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.error("Error occurred:", error);
      return res
        .status(500)
        .json({ error: "Error occurred while processing the request" });
    } else {
      if (results.length === 0) {
        return res.status(404).json({ message: "Invalid credentials" });
      } else {
        return res.status(200).json({ message: "Login successful" });
      }
    }
  });
});

app.get("/checkDoclogin", (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM admin
                       WHERE email="${email}" 
                       AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.error("Error occurred:", error);
      return res
        .status(500)
        .json({ error: "Error occurred while processing the request" });
    } else {
      if (results.length === 0) {
        return res.status(404).json({ message: "Invalid credentials" });
      } else {
        return res.status(200).json({ message: "Login successful" });
      }
    }
  });
});



//Returns Who is Logged in
app.get("/userInSession", (req, res) => {
  return res.json({ email: `${email_in_use}`, who: `${who}` });
});

//Logs the person out
app.get("/endSession", (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
});



//To return a particular patient history
app.get("/OneHistory", (req, res) => {
  const {
    ItemID,
    ItemName,
    Description,
    QuantityInStock,
    UnitPrice,
    SupplierID,
    HospitalID,
    OrderID,
  } = req.query;

  let sql = "SELECT * FROM Inventory WHERE 1 = 1"; // Start with a basic query

  if (ItemID) sql += ` AND ItemID = ${mysql.escape(ItemID)}`;
  if (ItemName) sql += ` AND ItemName = ${mysql.escape(ItemName)}`;
  if (Description) sql += ` AND Description = ${mysql.escape(Description)}`;
  if (QuantityInStock) sql += ` AND QuantityInStock = ${mysql.escape(QuantityInStock)}`;
  if (UnitPrice) sql += ` AND UnitPrice = ${mysql.escape(UnitPrice)}`;
  if (SupplierID) sql += ` AND SupplierID = ${mysql.escape(SupplierID)}`;
  if (HospitalID) sql += ` AND HospitalID = ${mysql.escape(HospitalID)}`;
  if (OrderID) sql += ` AND OrderID = ${mysql.escape(OrderID)}`;
  // Add conditions for other columns as needed...

  con.query(sql, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error fetching data from Inventory" });
      return;
    }

    console.log("Fetched data from Inventory:", results);
    res.status(200).json({ inventory: results });
  });
});

// Endpoint to add information to the database
app.post("/AddToInventory", (req, res) => {
  const { ItemID, ItemName, Description, QuantityInStock, UnitPrice, SupplierID, HospitalID, OrderID } = req.body;
  
  const sql = "INSERT INTO inventory (ItemID, ItemName, Description, QuantityInStock, UnitPrice, SupplierID, HospitalID, OrderID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [ItemID, ItemName, Description, QuantityInStock, UnitPrice, SupplierID, HospitalID, OrderID];
  
  con.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error adding data to inventory" });
      return;
    }

    console.log("Data added to inventory:", results);
    res.status(200).json({ message: "Data added to inventory successfully" });
  });
});



app.get('/columns/:tableName', (req, res) => {
  const tableName = req.params.tableName;

  connection.query(`SHOW COLUMNS FROM ${tableName}`, (error, results, fields) => {
    if (error) {
      console.error('Error fetching columns:', error);
      res.status(500).json({ error: 'Failed to fetch columns' });
      return;
    }

    const columns = results.map((result) => result.Field);
    res.status(200).json({ columns });
  });
});

// Endpoint to fetch data from a table based on search parameters
app.get('/Searchall/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  const queryParams = req.query;

  let query = `SELECT * FROM ${tableName}`;
  const values = [];

  if (Object.keys(queryParams).length !== 0) {
    query += ' WHERE ';
    Object.keys(queryParams).forEach((key, index) => {
      if (index !== 0) {
        query += ' AND ';
      }
      query += `${key} = ?`;
      values.push(queryParams[key]);
    });
  }

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }

    res.status(200).json({ inventory: results });
  });
});



// Endpoint to fetch orders data
app.get("/ViewOrders", (req, res) => {
  con.query("SELECT * FROM orders", (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error executing query" });
      return;
    }

    console.log("Orders data:", results); // Log the retrieved data
    res.status(200).json({ orders: results }); // Sending retrieved data as JSON response
  });
});

app.get("/Orders", (req, res) => {
  const {
    OrderID,
    OrderDate,
    SupplierID,
    ItemID,
  } = req.query;

  let sql = "SELECT * FROM Orders WHERE 1 = 1"; // Start with a basic query

  if (OrderID) sql += ` AND OrderID = ${mysql.escape(OrderID)}`;
  if (OrderDate) sql += ` AND OrderDate = ${mysql.escape(OrderDate)}`;
  if (SupplierID) sql += ` AND SupplierID = ${mysql.escape(SupplierID)}`;
  if (ItemID) sql += ` AND ItemID = ${mysql.escape(ItemID)}`;
  // Add conditions for other columns as needed...

  con.query(sql, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error fetching data from Orders" });
      return;
    }

    console.log("Fetched data from Orders:", results);
    res.status(200).json({ orders: results });
  });
});




// Endpoint to add order information to the database
app.post("/AddToOrders", (req, res) => {
  const { OrderDate, SupplierID, ItemID } = req.body;
  
  const sql = "INSERT INTO orders (OrderDate, SupplierID, ItemID) VALUES (?, ?, ?)";
  const values = [OrderDate, SupplierID, ItemID];
  
  con.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error adding data to orders" });
      return;
    }

    console.log("Data added to orders:", results);
    res.status(200).json({ message: "Data added to orders successfully" });
  });
});






// Endpoint to fetch pharmacy data
app.get("/ViewPharmacy", (req, res) => {
  con.query("SELECT * FROM Pharmacy", (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error executing query" });
      return;
    }

    console.log("Pharmacy data:", results); // Log the retrieved data
    res.status(200).json({ pharmacy: results }); // Sending retrieved data as JSON response
  });
});

// Endpoint to add pharmacy information to the database
app.post("/AddToPharmacy", (req, res) => {
  const { HospitalID, QuantityInStock, ItemID } = req.body;
  
  const sql = "INSERT INTO Pharmacy (HospitalID, QuantityInStock, ItemID) VALUES (?, ?, ?)";
  const values = [HospitalID, QuantityInStock, ItemID];
  
  con.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error adding data to pharmacy" });
      return;
    }

    console.log("Data added to pharmacy:", results);
    res.status(200).json({ message: "Data added to pharmacy successfully" });
  });
});

app.get("/ViewEquipmentRepair", (req, res) => {
  con.query("SELECT * FROM EquipmentRepair", (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error executing query" });
      return;
    }

    console.log("Equipment Repair data:", results); // Log the retrieved data
    res.status(200).json({ equipmentRepairs: results }); // Sending retrieved data as JSON response
  });
});


app.get('/EquipmentRepair', (req, res) => {
  const { Description, DurationToFix, ItemID } = req.query;

  let sql = 'SELECT * FROM EquipmentRepair WHERE 1 = 1';

  if (Description) sql += ` AND Description = ${mysql.escape(Description)}`;
  if (DurationToFix) sql += ` AND DurationToFix = ${mysql.escape(DurationToFix)}`;
  if (ItemID) sql += ` AND ItemID = ${mysql.escape(ItemID)}`;

  con.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error fetching equipment repair records:', error);
      res.status(500).json({ error: 'Error fetching equipment repair records' });
      return;
    }

    console.log('Fetched equipment repair records:', results);
    res.status(200).json({ equipmentRepairs: results });
  });
});

// Endpoint to add equipment repair information to the database
app.post("/AddToEquipmentRepair", (req, res) => {
  const { Description, DurationToFix, ItemID } = req.body;
  
  const sql = "INSERT INTO EquipmentRepair (Description, DurationToFix, ItemID) VALUES (?, ?, ?)";
  const values = [Description, DurationToFix, ItemID];
  
  con.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error adding data to equipment repair" });
      return;
    }

    console.log("Data added to equipment repair:", results);
    res.status(200).json({ message: "Data added to equipment repair successfully" });
  });
});

app.get("/ViewInventoryTransactions", (req, res) => {
  con.query("SELECT * FROM InventoryTransaction", (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error executing query" });
      return;
    }

    console.log("Inventory Transaction data:", results); // Log the retrieved data
    res.status(200).json({ inventoryTransactions: results }); // Sending retrieved data as JSON response
  });
});


app.get('/InventoryTransactions', (req, res) => {
  const { TransactionDate, Quantity, Notes, ItemID } = req.query;

  let sql = 'SELECT * FROM InventoryTransaction WHERE 1 = 1';

  if (TransactionDate) sql += ` AND TransactionDate = ${mysql.escape(TransactionDate)}`;
  if (Quantity) sql += ` AND Quantity = ${mysql.escape(Quantity)}`;
  if (Notes) sql += ` AND Notes = ${mysql.escape(Notes)}`;
  if (ItemID) sql += ` AND ItemID = ${mysql.escape(ItemID)}`;

  con.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error fetching inventory transactions:', error);
      res.status(500).json({ error: 'Error fetching inventory transactions' });
      return;
    }

    console.log('Fetched inventory transactions:', results);
    res.status(200).json({ inventoryTransactions: results });
  });
});

// Endpoint to add inventory transaction information to the database
app.post("/AddToInventoryTransactions", (req, res) => {
  const { TransactionDate, Quantity, Notes, ItemID } = req.body;
  
  const sql = "INSERT INTO InventoryTransaction (TransactionDate, Quantity, Notes, ItemID) VALUES (?, ?, ?, ?)";
  const values = [TransactionDate, Quantity, Notes, ItemID];
  
  con.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error adding data to inventory transactions" });
      return;
    }

    console.log("Data added to inventory transactions:", results);
    res.status(200).json({ message: "Data added to inventory transactions successfully" });
  });
});

// Map table names to their corresponding ID column names
const idColumns = {
  Orders: 'OrderID',
  Pharmacy: 'PharmacyID',
  EquipmentRepair: 'EquipmentRepairID',
  InventoryTransaction: 'TransactionID',
  Employee: 'EmployeeID'
  // Add more table names and their ID column names as needed
};

app.delete('/deleteRow/:tableName/:id', (req, res) => {
  const { tableName, id } = req.params;

  // Check if the provided table name exists in the map
  if (!idColumns[tableName]) {
    res.status(400).json({ error: 'Invalid table name' });
    return;
  }

  const idColumn = idColumns[tableName];

  // Construct the DELETE query to remove row based on ID
  const deleteQuery = `DELETE FROM ${tableName} WHERE ${idColumn} = ${mysql.escape(id)}`;

  con.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Error deleting row:', err);
      res.status(500).json({ error: 'Error deleting row' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Row not found' });
      return;
    }
    console.log('Row deleted successfully');
    res.status(200).json({ message: 'Row deleted successfully' });
  });
});



app.put('/updateRow/:tableName/:columnName/:updatedValue/:id', (req, res) => {
  const { tableName, columnName,updatedValue, id } = req.params;

  // Check if the provided table name exists in the map
  if (!idColumns[tableName]) {
    res.status(400).json({ error: 'Invalid table name' });
    return;
  }

  const idColumn = idColumns[tableName];

  // Construct the UPDATE query to update a specific row
  const updateQuery = `UPDATE ${tableName} SET ${columnName} = ${updatedValue} WHERE ${idColumn} = ${mysql.escape(id)}`;

  con.query(updateQuery, (err, result) => {
    if (err) {
      console.error('Error updating row:', err);
      res.status(500).json({ error: 'Error updating row' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Row not found' });
      return;
    }
    console.log('Row updated successfully');
    res.status(200).json({ message: 'Row updated successfully' });
  });
});





app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

module.exports = app;
