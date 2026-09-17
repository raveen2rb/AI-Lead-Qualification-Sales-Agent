const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

// ===============================
// n8n Webhooks
// ===============================

const LEAD_CHAT_WEBHOOK =
     "YOUR_N8N_WEBHOOK_URL/lead-chat-portfolio";

const MANAGER_MESSAGES_WEBHOOK =
    "YOUR_N8N_WEBHOOK_URL/lead-messages-portfolio";

// ===============================
// Session
// ===============================

let sessionId = localStorage.getItem("sessionId");

if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
}

console.log("Session ID:", sessionId);

// ===============================
// Display Message
// ===============================

function addMessage(message, type) {
    if (!message) {
        return;
    }

    const messageElement = document.createElement("div");

    messageElement.classList.add(
        "message",
        `${type}-message`
    );

    const messageContent = document.createElement("div");

    messageContent.classList.add("message-content");

    messageContent.textContent = message;

    messageElement.appendChild(messageContent);

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===============================
// Send Customer Message
// ===============================

async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    messageInput.value = "";

    sendButton.disabled = true;

    try {
        console.log("Sending message:", message);

        const response = await fetch(
            LEAD_CHAT_WEBHOOK,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: sessionId
                })
            }
        );

        console.log(
            "n8n status:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "n8n response:",
            data
        );

        if (data.reply) {
            addMessage(
                data.reply,
                "ai"
            );
        }

    } catch (error) {
        console.error(
            "Send message error:",
            error
        );

        addMessage(
            "Sorry, something went wrong. Please try again.",
            "ai"
        );

    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// ===============================
// Manager Messages
// ===============================

const displayedManagerMessages = new Set();

async function checkManagerMessages() {
    try {
        const url =
            MANAGER_MESSAGES_WEBHOOK +
            "?sessionId=" +
            encodeURIComponent(sessionId);

        const response = await fetch(url);

        console.log(
            "Manager polling status:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "Manager messages:",
            data
        );

        const messages =
            Array.isArray(data.messages)
                ? data.messages
                : [];

        for (const managerMessage of messages) {

            if (
                managerMessage.sender !== "manager"
            ) {
                continue;
            }

            if (
                !managerMessage.message
            ) {
                continue;
            }

            const messageId =
                managerMessage.id ||
                (
                    managerMessage.sessionId +
                    "-" +
                    managerMessage.message_created_at +
                    "-" +
                    managerMessage.message
                );

            if (
                displayedManagerMessages.has(
                    messageId
                )
            ) {
                continue;
            }

            displayedManagerMessages.add(
                messageId
            );

            addMessage(
                "👤 Manager: " +
                managerMessage.message,
                "manager"
            );
        }

    } catch (error) {
        console.error(
            "Manager polling error:",
            error
        );
    }
}

// ===============================
// Send Button
// ===============================

sendButton.addEventListener(
    "click",
    sendMessage
);

// ===============================
// Enter Key
// ===============================

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }

    }
);

// ===============================
// Start Manager Polling
// ===============================

checkManagerMessages();

setInterval(
    checkManagerMessages,
    15000
);