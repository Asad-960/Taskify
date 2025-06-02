using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries;

public class GetFilteredTask
{
    public class Query : IRequest<List<TaskResponse>>
    {
        public string? UserId { get; init; }
        public string? PropertyName { get; init; }
    }

    public class Handler(AppDbContext db, IMapper mapper) : IRequestHandler<Query, List<TaskResponse>>
    {
        public async Task<List<TaskResponse>> Handle(Query request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.UserId, out var userId))
            {
                throw new NotFoundException("User not found");
            }
            var user = db.Users.Find(userId);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            if (request.PropertyName == null)
            {
                throw new NotFoundException("PropertyName not found");
            }
            var tasks = await db.TaskItems.Where(x => x.UserId == userId)
                .OrderBy(request.PropertyName)
                .Include(x => x.Category)
                .ToListAsync(cancellationToken);
            
            var tasksResponse = mapper.Map<List<TaskResponse>>(tasks);
            return tasksResponse;
        }
    }
}