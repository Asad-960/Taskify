using API.Extensions;
using API.Hubs;
using API.Middleware;
using API.Services;
using Hangfire;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddServices(builder.Configuration);
var app = builder.Build();

app.UseCors(x =>
    x.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000")
);
app.UseSwagger(); // creates endpoint for swagger.json(it contains all action methods)
app.UseSwaggerUI(); // Creates swagger ui for testing endpoints

app.UseHangfireDashboard();
app.MapHangfireDashboard("/hangfire");
app.MapHub<ReminderHub>("/reminders");

RecurringJob.AddOrUpdate<ReminderService>(
    "check-due-tasks",
    service => service.SendReminder(),
    Cron.MinuteInterval(5)
);
app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
