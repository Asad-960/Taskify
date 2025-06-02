
using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Commands;

public class DeleteUserTask 
{
    public class Command : IRequest<Unit>
    {
        public string? UserId { get; init; }
        public string? TaskId { get; init; }
    }

    public class Handler(AppDbContext db) : IRequestHandler<Command, Unit>
    {
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.UserId, out var userId))
            {
                throw new NotFoundException("UserId does not exist");
            }
            if (!Guid.TryParse(request.TaskId, out var taskId))
            {
                throw new NotFoundException("TaskId does not exist");
            }

            var task = await db.TaskItems.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == taskId, cancellationToken: cancellationToken);
            if (task == null)
            {
                throw new NotFoundException("Task does not exist");
            }
            db.TaskItems.Remove(task);
            await db.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}