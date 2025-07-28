from flask import Flask, request, jsonify, render_template
from chatbot import FarmerChatbot

app = Flask(__name__)

# Initialize the bot using CSV data (from Kaggle or your own CSV) or JSON intents.
# Uncomment one of the following lines:
# bot = FarmerChatbot(csv_file='your_dataset.csv')
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
    app.run(debug=True)
