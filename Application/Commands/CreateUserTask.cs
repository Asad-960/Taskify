using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Commands;

public class CreateUserTask
{
    public class Command : IRequest<Unit>
    {
        public string? UserId { get; init; }
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
            var task = mapper.Map<TaskItem>(request.TaskRequest);
            task.UserId = userId;
            if (request?.TaskRequest?.CategoryName != null)
            {
                var category = await db.Categories.FirstOrDefaultAsync(x => x.Name == request.TaskRequest.CategoryName, cancellationToken);
                task.CategoryId = category?.Id;
            }
            await db.TaskItems.AddAsync(task, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}