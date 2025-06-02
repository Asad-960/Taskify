using System.Security.Claims;
using API.Dto;
using Application.Commands;
using Application.Dto;
using Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TaskController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Tasks()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var tasks = await mediator.Send(new GetUserTask.Query() {UserId = userId});
        return Ok(tasks);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var tasks = await mediator.Send(new GetUserSingleTask.Query() {UserId = userId, TaskId = id});
        if (tasks == null)
        {
            return NotFound();
        }
        return Ok(tasks);
    }
    
    [HttpPost]
    public async Task<IActionResult> Task(TaskRequest? taskRequest)
    {
        if (ModelState.IsValid == false)
        {
            return BadRequest(ModelState);
        }
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await mediator.Send(new CreateUserTask.Command() {UserId = userId, TaskRequest = taskRequest});
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Task(string id, TaskRequest? taskRequest)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await mediator.Send(new UpdateUserTask.Command()
        {
            UserId = userId, TaskRequest = taskRequest, 
            TaskId = id
        });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Task(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await mediator.Send(new DeleteUserTask.Command()
        {
            UserId = userId,
            TaskId = id
        });
        return NoContent();
    }
    [HttpGet("filter/{propertyName}")]
    public async Task<IActionResult> FilteredTask(string propertyName)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var tasks = await mediator.Send(new GetFilteredTask.Query()
        {
            PropertyName = propertyName,
            UserId = userId
        });
        return Ok(tasks);
    }
}