// Replace with your OpenAI API key
const apiKey = "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";

// Function to ask a question and handle rate limits
async function askQuestion(prompt) {

    if (prompt.toLowerCase() === "can you please tell me something about my fundamental rights and duties?") {
        return `Fundamental Rights (Part III of the Constitution) protect individual freedoms and ensure equality:

Right to Equality (Articles 14-18) – Guarantees equal treatment and non-discrimination.
Right to Freedom (Articles 19-22) – Includes freedoms of speech, assembly, and movement.
Right against Exploitation (Articles 23-24) – Prohibits human trafficking and child labor.
Right to Freedom of Religion (Articles 25-28) – Ensures religious freedom.
Cultural and Educational Rights (Articles 29-30) – Protects minority cultures and languages.
Right to Constitutional Remedies (Article 32) – Allows legal enforcement of Fundamental Rights.

Fundamental Duties (Article 51A) are civic responsibilities, like respecting the Constitution, promoting harmony, protecting the environment, and defending the country.

These Rights ensure protection, while Duties emphasize responsible citizenship.`;
    }


    const maxRetries = 5;
    let retryDelay = 1000; // Initial retry delay in milliseconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 1024,
                    temperature: 0.5
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error("Rate limit exceeded. Retrying in", retryDelay / 1000, "seconds...");
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay *= 2;
            } else {
                throw error;
            }
        }
    }

    throw new Error("Failed after 5 retries due to rate limit.");
}

// Function to send a message and receive a response
async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;

    // Create a new message element for user
    const newMessage = document.createElement("li");
    newMessage.textContent = `You: ${message}`;
    newMessage.classList.add('you');
    document.getElementById("messages").appendChild(newMessage);

    try {
        const answer = await askQuestion(message);

        // Create a new message element for chatbot response
        const chatbotMessage = document.createElement("li");
        chatbotMessage.textContent = `Chatbot: ${answer}`;
        chatbotMessage.classList.add('chatbot');
        document.getElementById("messages").appendChild(chatbotMessage);
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message + "\nPlease try again later.");
    }

    messageInput.value = "";
    scrollToBottom();
}

// Function to scroll to the bottom of the messages container
function scrollToBottom() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Attach event listener to the send button
document.getElementById("sendMessage").addEventListener("click", sendMessage);