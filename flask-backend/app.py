from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    name = data.get("name", "stranger")
    message = data.get("message", "")
    return jsonify({
        "status": "Received",
        "reply": f"Hello {name}! Flask got your message: '{message}'"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
