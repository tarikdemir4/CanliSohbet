using Microsoft.AspNetCore.SignalR;

namespace CanliSohbetServer.WebAPI.Hubs;

public sealed class SohbetHub : Hub
{
    private static readonly Dictionary<string, object> Users = new();

    public async Task Connect(string userName,string avatar)
    {
        Users.Add(Context.ConnectionId, userName);

        await Clients.All.SendAsync("Login",Users.ToList());

        await Task.CompletedTask;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Users.Remove(Context.ConnectionId);

        await Task.CompletedTask;
    }

    public async Task Send(string userName,string message)
    {
        string connectionId=Users.FirstOrDefault(p=>p.Value==userName).Key;
        await Clients.Client(connectionId).SendAsync("Chat", message);
    }

}
