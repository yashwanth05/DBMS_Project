import React, { useState } from 'react';
import { API_BASE_URL } from './constant/API';
import {
  Box,
  Button,
  Grommet,
  Heading,
  Text,
  TextInput,
  Grid,
} from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000',
    },
    font: {
      family: 'Lato',
    },
  },
};

const SidebarButton = ({ label, ...rest }) => (
  <Button plain {...rest}>
    {({ hover }) => (
      <Box
        background={hover ? '#DADADA' : undefined}
        pad={{ horizontal: 'large', vertical: 'medium' }}
      >
        <Text size="large">{label}</Text>
      </Box>
    )}
  </Button>
);

const Home = () => {
  const [tableName, setTableName] = useState('');
  const [id, setId] = useState('');
  const [columnName, setColumnName] = useState('');
  const [updatedValue, setUpdatedValue] = useState('');

  const handleDeleteRow = () => {
    if (!tableName || !id) {
      alert('Please provide both table name and ID');
      return;
    }

    fetch(`${API_BASE_URL}/deleteRow/${tableName}/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Row deleted successfully:', data.message);
        alert('Row deleted successfully'); // Show alert message
        // Perform any additional actions after deletion if needed
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle error or display a user-friendly message
      });
  };

  const handleUpdateRow = () => {
    if (!tableName || !id || !columnName || !updatedValue) {
      alert('Please provide table name, row ID, column name, and updated value');
      return;
    }

    fetch(`${API_BASE_URL}/updateRow/${tableName}/${columnName}/${updatedValue}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnName, updatedValue }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Row updated successfully:', data.message);
        alert('Row updated successfully'); // Show alert message
        // Perform any additional actions after updating if needed
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        alert('error');
        // Handle error or display a user-friendly message
      });
  };

  const Header = () => (
    <Box
      tag='header'
      background='brand'
      pad='small'
      elevation='small'
      justify='between'
      direction='row'
      align='center'
      flex={false}
      style={{ borderBottom: '1px solid grey' }}
    >
      <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
        <Heading level='3' margin='none'>Sohan Hospitals</Heading>
      </a>
    </Box>
  );

  return (
    <Grommet full={true} theme={theme}>
      <Box fill={true}>
        <Header />
        <Grid
          fill
          rows={['auto', 'flex']}
          columns={['auto', 'flex']}
          areas={[
            { name: 'sidebar', start: [0, 1], end: [0, 1] },
            { name: 'main', start: [1, 1], end: [1, 1] },
          ]}
        >
          <Box
            gridArea="sidebar"
            width="small"
            background="brand"
          >
            {[
              'View Inventory',
              'View Orders',
              'View Pharmacy',
              'View Equipment Repair',
              'View Inventory Transaction',
              'Sign Out',
            ].map((label) => (
              <SidebarButton
                key={label}
                label={label}
                onClick={() => {
                  // Handle sidebar button clicks
                  if (label === 'View Pharmacy') {
                    window.location = '/scheduleAppt';
                  } else if (label === 'Sign Out') {
                    fetch('http://localhost:3001/endSession');
                    window.location = '/';
                  } else if (label === 'View Orders') {
                    window.location = '/PatientsViewAppt';
                  } else if (label === 'View Inventory') {
                    window.location = '/OneHistory';
                  } else if (label === 'View Equipment Repair') {
                    window.location = '/Settings';
                  } else if (label === 'View Inventory Transaction') {
                    window.location = '/Diagnose';
                  } 
                }}
              />
            ))}
          </Box>
          <Box
            gridArea="main"
            justify="center"
            align="center"
          >
            {/* Input fields for Table Name and Row ID */}
            <Box>
              <TextInput
                placeholder="Enter Table Name for Update"
                value={tableName}
                onChange={(event) => setTableName(event.target.value)}
              />
              <TextInput
                placeholder="Enter Row ID for Update"
                value={id}
                onChange={(event) => setId(event.target.value)}
              />
              <TextInput
                placeholder="Enter Column Name for Update"
                value={columnName}
                onChange={(event) => setColumnName(event.target.value)}
              />
              <TextInput
                placeholder="Enter Updated Value"
                value={updatedValue}
                onChange={(event) => setUpdatedValue(event.target.value)}
              />
              <Button
                label="Delete Row based on Update Fields"
                onClick={handleDeleteRow}
              />
              <Button
                label="Update Row"
                onClick={handleUpdateRow}
              />
            </Box>
          </Box>
        </Grid>
      </Box>
    </Grommet>
  );
};

export default Home;
