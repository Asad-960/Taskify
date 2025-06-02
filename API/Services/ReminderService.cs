using System.Linq.Dynamic.Core;
using API.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Services
{
    /// <summary>
    /// 
    /// </summary>
    public class ReminderService(AppDbContext db, IHubContext<ReminderHub> hubContext)
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public async Task SendReminder()
        {
            var now = DateTime.Now;
            var upcomingTasks = await db.TaskItems.Where(x => x.DueDate < now.AddHours(1) && !x.Finished).ToListAsync();
            Console.WriteLine();
            Console.WriteLine(upcomingTasks.Count);
            foreach (var task in upcomingTasks)
            {
                
                await hubContext.Clients.Group(task.UserId.ToString()).SendAsync("ReceiveReminder", new
                {
                    task.Id,
                    task.Title,
                    task.DueDate
                });
                task.Finished = true;
                await db.SaveChangesAsync();
                Console.WriteLine("___________________________________________________");
                Console.WriteLine("___________________________________________________");
                Console.WriteLine(task.Title + " in " + task.DueDate.ToLongDateString());       
                Console.WriteLine("___________________________________________________");
                Console.WriteLine("___________________________________________________");
            }
        }
    }
}