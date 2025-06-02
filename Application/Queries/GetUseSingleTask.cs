using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries;

public class GetUserSingleTask
{
    public class Query : IRequest<TaskResponse>
    {
        public string? UserId { get; init; }
        public string? TaskId { get; init; }
    }

    public class Handler(AppDbContext db, IMapper mapper) : IRequestHandler<Query, TaskResponse>
    {
        public async Task<TaskResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.UserId, out var userId))
            {
                throw new NotFoundException("User not found");
            }
            if (!Guid.TryParse(request.TaskId, out var taskId))
            {
                throw new NotFoundException("Task not found");
            }

            var user = await db.Users.FindAsync(userId, cancellationToken) ?? throw new NotFoundException("User not found");

            var taskItem = await db.TaskItems.Where(t => t.Id == taskId && t.UserId == userId).Include(x => x.Category).FirstOrDefaultAsync(cancellationToken) ?? throw new NotFoundException("Task not found");

            var tasksResponse = mapper.Map<TaskResponse>(taskItem);
            return tasksResponse;
        }
    }
}