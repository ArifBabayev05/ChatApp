using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace WebSockett.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string username, string message,string group)
        {
            await Clients.Group(group).SendAsync("ReceiveMessage", username, message);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}

