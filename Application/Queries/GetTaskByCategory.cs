using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries;

public class GetTaskByCategory
{
    public class Query : IRequest<List<TaskResponse>>
    {
        public required CategoryDto category { get; init; }
    }

    public class Handler(AppDbContext db, IMapper mapper) : IRequestHandler<Query, List<TaskResponse>>
    {
        public async Task<List<TaskResponse>> Handle(Query request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.category.UserId, out var userId))
            {
                throw new NotFoundException("User not found");
            }
            
            var user = await db.Users.FindAsync(userId, cancellationToken);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            var category = await db.Categories.FirstOrDefaultAsync(x => x.Name == request.category.Name, cancellationToken);
            if (category == null)
            {
                throw new NotFoundException("Category not found");
            }
            
            var tasks = await db.TaskItems.Where(x => x.UserId == userId && x.CategoryId == category.Id).ToListAsync(cancellationToken);
            
            var tasksResponse = mapper.Map<List<TaskResponse>>(tasks);
            return tasksResponse;
        }
    }
}