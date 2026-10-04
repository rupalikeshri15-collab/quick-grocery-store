from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# MySQL Database Configuration (Apna MySQL password yahan likhein agar ho, warna root chhod dein)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/grocery_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Model for Orders
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), default="Guest User")
    total_amount = db.Column(db.Float, nullable=False)
    items = db.Column(db.Text, nullable=False)

# Database table create karne ke liye
with app.app_context():
    db.create_all()

# Products API
PRODUCTS = [
    {"id": 1, "name": "Fresh Apple (1kg)", "price": 120, "image": "🍎"},
    {"id": 2, "name": "Organic Milk (1L)", "price": 60, "image": "🥛"},
    {"id": 3, "name": "Whole Wheat Bread", "price": 40, "image": "🍞"},
    {"id": 4, "name": "Basmati Rice (1kg)", "price": 90, "image": "🍚"},
]

@app.route("/api/products", methods=["GET"])
def get_products():
    return jsonify(PRODUCTS)

# Place Order API (Database mein save karne ke liye)
@app.route("/api/orders", methods=["POST"])
def place_order():
    data = request.json
    total = data.get("total")
    items = str(data.get("items"))

    new_order = Order(total_amount=total, items=items)
    db.session.add(new_order)
    db.session.commit()

    return jsonify({"message": "Order saved to MySQL database successfully! 🎉", "order_id": new_order.id})

if __name__ == "__main__":
    app.run(debug=True, port=5000)