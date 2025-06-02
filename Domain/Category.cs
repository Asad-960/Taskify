using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.UserEntities;

namespace Domain
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? Name { get; set; }
        public string? Color { get; set; }
        
        public AppUser? User { get; set; }
        public Guid UserId { get; set; }
    }
}