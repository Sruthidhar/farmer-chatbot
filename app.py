from flask import Flask, request, jsonify, render_template
from chatbot import FarmerChatbot
import os

app = Flask(__name__)

# Load the chatbot using JSON-based intents
bot = FarmerChatbot(intents_file='intents.json')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    response = bot.get_response(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    # For Render deployment — bind to 0.0.0.0 and use the dynamic PORT
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
