using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Commands;

public class UpdateUserTask 
{
    public class Command : IRequest<Unit>
    {
        public string? UserId { get; init; }
        public string? TaskId { get; init; }
        public TaskRequest? TaskRequest { get; set; }
    }

    public class Handler(AppDbContext db, IMapper mapper) : IRequestHandler<Command, Unit>
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

            if (request.TaskRequest == null)
            {
                throw new NotFoundException("TaskRequest does not exist");
            }

            var task = await db.TaskItems.Where(x => x.UserId == userId && x.Id == taskId).FirstOrDefaultAsync(cancellationToken);
            if (task == null)
            {
                throw new NotFoundException("Task does not exist");
            }
            var category = await db.Categories.FirstOrDefaultAsync(x => x.Name == request.TaskRequest.CategoryName && x.UserId == userId, cancellationToken);

            task.Description = request.TaskRequest.Description;
            task.Title = request.TaskRequest.Title;
            task.Priority = request.TaskRequest.Priority;
            task.DueDate = request.TaskRequest.DueDate;
            task.CategoryId = category?.Id ?? null;

            db.TaskItems.Update(task);
            await db.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
