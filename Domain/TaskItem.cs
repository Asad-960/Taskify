using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.UserEntities;

namespace Domain
{
    public class TaskItem
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }

        public bool Finished { get; set; } = false;
        public AppUser? User { get; set; }
        public Guid UserId { get; set; }
        
        public Category? Category { get; set; }
        public Guid? CategoryId { get; set; }
    }
}