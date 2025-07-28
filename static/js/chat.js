document.addEventListener("DOMContentLoaded", function () {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const voiceBtn = document.getElementById("voice-btn");
  const speakBtn = document.getElementById("speak-btn");

  let lastBotResponse = "";

  // Function to append a message to the chat box
  function appendMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Function to send the user message to the server
  function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;
    
    appendMessage("user", message);
    userInput.value = "";
    
    fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
      lastBotResponse = data.response;
      appendMessage("bot", data.response);
    })
    .catch(error => {
      console.error("Error:", error);
      appendMessage("bot", "There was an error processing your request.");
    });
  }

  sendBtn.addEventListener("click", sendMessage);

  // Allow sending message with Enter key
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Voice-to-text functionality using Web Speech API
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", function () {
      recognition.start();
    });

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      // Optionally, auto-send the message:
      // sendMessage();
    };

    recognition.onerror = function (event) {
      console.error("Speech recognition error", event.error);
    };
  } else {
    voiceBtn.style.display = 'none'; // Hide if not supported
    console.warn("Speech Recognition API not supported in this browser.");
  }

  // Text-to-voice functionality using SpeechSynthesis API
  speakBtn.addEventListener("click", function () {
    if (lastBotResponse !== "") {
      const utterance = new SpeechSynthesisUtterance(lastBotResponse);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  });
});
