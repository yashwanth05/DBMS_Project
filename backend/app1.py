from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL configurations
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'password07',
    'database': 'project_dbms'
}

@app.route('/inventory', methods=['GET'])
def get_inventory():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute('SELECT * FROM inventory')
        data = cursor.fetchall()

        cursor.close()
        connection.close()

        # Convert the MySQL data to a list of dictionaries
        inventory_list = []
        for row in data:
            inventory_dict = {
                'ItemID': row[0],
                'ItemName': row[1],
                'Description': row[2],
                'QuantityInStock': row[3],
                'UnitPrice': row[4],
                'SupplierID': row[5],
                'HospitalID': row[6],
                'OrderID': row[7]
            }
            inventory_list.append(inventory_dict)

        return jsonify(inventory_list)  # Return the data as JSON

    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return error message with status code 500

if __name__ == '_main_':
    app.run(debug=True)
    print(f"Access the inventory data at: http://127.0.0.1:5000/inventory")  # Print the URL when the app starts