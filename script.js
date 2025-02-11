document.getElementById('newMessageBtn').addEventListener('click', function() {
    document.getElementById('messageBox').classList.toggle('hidden');
});

document.getElementById('viewMessagesBtn').addEventListener('click', function() {
    document.getElementById('messagesList').classList.toggle('hidden');
});

document.getElementById('sendMessageBtn').addEventListener('click', function() {
    const username = document.getElementById('usernameInput').value;
    const message = document.getElementById('messageInput').value;

    // Here you would send the message to the server
    console.log(`Sending message to ${username}: ${message}`);

    // Clear inputs
    document.getElementById('usernameInput').value = '';
    document.getElementById('messageInput').value = '';
});
