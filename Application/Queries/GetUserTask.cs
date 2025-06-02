using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries;

public class GetUserTask
{
    public class Query : IRequest<List<TaskResponse>>
    {
        public string? UserId { get; init; }
    }

    public class Handler(AppDbContext db, IMapper mapper) : IRequestHandler<Query, List<TaskResponse>>
    {
        public async Task<List<TaskResponse>> Handle(Query request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.UserId, out var userId))
            {
                throw new NotFoundException("User not found");
            }
            var user = await db.Users.FindAsync(userId, cancellationToken);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            var tasks = await db.TaskItems.Where(x => x.UserId == userId).Include(x => x.Category).ToListAsync(cancellationToken);
            
            var tasksResponse = mapper.Map<List<TaskResponse>>(tasks);
            return tasksResponse;
        }
    }
}