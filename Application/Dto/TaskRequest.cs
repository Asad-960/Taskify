using System.ComponentModel.DataAnnotations;

namespace Application.Dto;

public class TaskRequest
{
    [Required]
    public string? Title { get; set; }
    
    [Required]
    public string? Description { get; set; }
    
    [Required]
    public DateTime DueDate { get; set; }
    
    [Required]
    public int Priority { get; set; }
    
    public string? CategoryName { get; set; }
}