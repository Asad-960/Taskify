using System.Security.Claims;
using Application.Commands;
using Application.Dto;
using Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[Route("api/[controller]")]
public class CategoryController(IMediator mediator): ControllerBase
{
    
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var categories = await mediator.Send(new GetCategories.Query() { UserId = userId });
        return Ok(categories);
    }
    
    [HttpGet("tasks/{categoryName}")]
    public async Task<IActionResult> GetTasksByCategories(string categoryName)
    {
        var categoryDto = new CategoryDto();
        categoryDto.Name = categoryName;
        categoryDto.UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var tasks = await mediator.Send(new GetTaskByCategory.Query() { category = categoryDto });
        return Ok(tasks);
    }
    /// <summary>
    /// To create a unique category
    /// </summary>
    /// <param name="categoryDto"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody]CategoryDto categoryDto)
    {
        categoryDto.UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await mediator.Send(new CreateCategory.Command() { Category = categoryDto });
        return NoContent();
    }
}