using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Commands;

public class CreateCategory
{
    public class Command : IRequest<Unit>
    {
        public CategoryDto Category { get; init; }
    }

    public class Handler(AppDbContext db, IMapper mapper) : IRequestHandler<Command, Unit>
    {
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.Category.UserId, out var userId))
            {
                throw new NotFoundException("UserId does not exist");
            }
            var isCategory = await db.Categories.FirstOrDefaultAsync(x => x.Name == request.Category.Name, cancellationToken: cancellationToken);
            if (isCategory != null)
            {
                throw new ConflictException("Category already exists");
            }

            var category = mapper.Map<Category>(request.Category);
            db.Categories.Add(category);
            await db.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}