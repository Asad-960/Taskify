using Application.Dto;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries;

public class GetCategories
{
    public class Query : IRequest<List<CategoryDto>>
    {
        public string? UserId { get; init; }
    }

    public class Handler(AppDbContext db, IMapper mapper) : IRequestHandler<Query, List<CategoryDto>>
    {
        public async Task<List<CategoryDto>> Handle(Query request, CancellationToken cancellationToken)
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
            var categories = db.Categories.Where(x => x.UserId == userId).ToList();
            var categoriesDto = mapper.Map<List<CategoryDto>>(categories);
            return categoriesDto;
        }
    }
}