import json
import random

class FarmerChatbot:
    def __init__(self, intents_file="intents.json"):
        with open(intents_file, 'r') as file:
            data = json.load(file)
            self.intents = data['intents']

    def get_response(self, user_input):
        user_input = user_input.lower()
        for intent in self.intents:
            for pattern in intent['patterns']:
                if pattern.lower() in user_input:
                    return random.choice(intent['responses'])
        return "I'm sorry, I didn't understand that. Could you please rephrase?"
