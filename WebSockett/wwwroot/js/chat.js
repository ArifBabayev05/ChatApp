
"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

let enterGroup = document.getElementById("EnterGroup");

let groupnameInput = document.getElementById("GroupnameInput");

let usernameInput = document.getElementById("UsernameInput");

let grouping = document.getElementById("Grouping");

let messaging = document.getElementById("Messaging");

let leaveGroup = document.getElementById("LeaveGroupButton");

let sendMessage = document.getElementById("SendMessage");

let messageInput = document.getElementById("MessageInput");

let messageList = document.getElementById("messageList");



connection.on("ReceiveMessage", function (username, message) {
    createMessage(username, message);
});


connection.start().then(function () {
    if (getUser()) {
        showMessaging();
    }
}).catch(function (err) {
    return console.error(err.toString());
});



//Enter Group Event
enterGroup.addEventListener("submit", function (ev) {

    ev.preventDefault();

    let groupname = groupnameInput.value;

    let username = usernameInput.value;

    let user = { username, groupname };

    setUser(user);

    connection.invoke("AddToGroup",groupname);

    showMessaging();
    

})

//Leave Group Event
leaveGroup.addEventListener("click", function (ev) {
    let user = getUser();
    let groupName = user.groupname;
    localStorage.removeItem("user");
    messageList.innerHTML = "";
    connection.invoke("RemoveFromGroup", groupName)
    showGrouping();

})

//Send Message Event
sendMessage.addEventListener("submit", function (ev) {
    ev.preventDefault();
    let message = messageInput.value;
    let user = getUser();
    let username = user.username;
    let group = user.groupname;

    

    connection.invoke("SendMessage", username, message, group).catch(function (err) {
        return console.error(err.toString());
    });

   
})

// Show Messages Function
function showMessaging() {
    if (!grouping.classList.contains("d-none")) {
        grouping.classList.add("d-none");
    }
    if (messaging.classList.contains("d-none")) {
        messaging.classList.remove("d-none");
    }
}

// Show Groups Function
function showGrouping() {
    if (!messaging.classList.contains("d-none")) {
        messaging.classList.add("d-none");
    }
    if (grouping.classList.contains("d-none")) {
        grouping.classList.remove("d-none");
    }
}
 
// Local Storage Set Function
function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));

}

// Local Storage Get Function
function getUser() {
    let user = JSON.parse(localStorage.getItem("user"))
    return user;
}

//Create Message Function
function createMessage(username, message) {
    let li = document.createElement("li");
    li.classList.add("list-group-item", "my-1")
    let authorP = document.createElement("p");
    authorP.classList.add("font-weight-bold");
    authorP.innerText = username;
    let messageP = document.createElement("p");
    messageP.innerText = message;
    li.appendChild(authorP);
    li.appendChild(messageP);
    messageList.appendChild(li);
    messageInput.value = "";
}




////Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

//connection.on("ReceiveMessage", function (user, message) {
//    var li = document.createElement("li");
//    document.getElementById("messagesList").appendChild(li);
//    // We can assign user-supplied strings to an element's textContent because it
//    // is not interpreted as markup. If you're assigning in any other way, you 
//    // should be aware of possible script injection concerns.
//    li.textContent = `${user} says ${message}`;
//});

//connection.start().then(function () {
//    document.getElementById("sendButton").disabled = false;
//}).catch(function (err) {
//    return console.error(err.toString());
//});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});