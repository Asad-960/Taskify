using Domain;

namespace Application.Dto;

public class TaskResponse
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public int Priority { get; set; }
    
    public string? CategoryName { get; set; }
    public string? Color { get; set; }
}