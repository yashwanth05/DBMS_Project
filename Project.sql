CREATE DATABASE IF NOT EXISTS `Project_DBMS` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `Project_DBMS`;

CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    DepartmentName VARCHAR(255),
    DepartmentDescription TEXT
);

CREATE TABLE Hospital (
    HospitalID INT PRIMARY KEY AUTO_INCREMENT,
    PinCode VARCHAR(10),
    City VARCHAR(255),
    PhoneNumber VARCHAR(20)
);

CREATE TABLE Supplier (
    SupplierID INT PRIMARY KEY AUTO_INCREMENT,
    SupplierName VARCHAR(255),
    EMailAddress VARCHAR(255),
    PinCode VARCHAR(10),
    City VARCHAR(255),
    PhoneNumber VARCHAR(20)
);

CREATE TABLE Inventory (
    ItemID INT PRIMARY KEY AUTO_INCREMENT,
    ItemName VARCHAR(255),
    Description TEXT,
    QuantityInStock INT,
    UnitPrice DECIMAL(10, 2),
    SupplierID INT,
    HospitalID INT,
    OrderID INT,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID),
    FOREIGN KEY (HospitalID) REFERENCES Hospital(HospitalID)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    OrderDate DATE,
    SupplierID INT,
    ItemID INT,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID),
    FOREIGN KEY (ItemID) REFERENCES Inventory(ItemID)
);

CREATE TABLE Pharmacy (
    PharmacyID INT PRIMARY KEY AUTO_INCREMENT,
    HospitalID INT,
    QuantityInStock INT,
    ItemID INT,
    FOREIGN KEY (ItemID) REFERENCES Inventory(ItemID),
    FOREIGN KEY (HospitalID) REFERENCES Hospital(HospitalID)
);

CREATE TABLE EquipmentRepair (
    EquipmentRepairID INT PRIMARY KEY AUTO_INCREMENT,
    Description TEXT,
    DurationToFix INT,
    ItemID INT,
    FOREIGN KEY (ItemID) REFERENCES Inventory(ItemID)
);

CREATE TABLE InventoryTransaction (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    TransactionDate DATE,
    Quantity INT,
    Notes TEXT,
    ItemID INT,
    FOREIGN KEY (ItemID) REFERENCES Inventory(ItemID)
);

CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255),
    DepartmentID INT,
    Salary DECIMAL(10, 2),
    HospitalID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY (HospitalID) REFERENCES Hospital(HospitalID)
);
