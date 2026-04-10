# Caching Rules (API)

## Where to Cache

- Cache MUST only be used in the **service layer**
- **Handler** → thin (parse + call service + map errors) — no caching
- **Repository** → pure data access (Prisma only) — no caching
- **Service** → orchestration + caching logic lives here

## Cache Key Naming

Format: `{feature}:{entity}:{id}`

```
user:profile:123
product:detail:456
order:summary:789
```

## TTL

- TTL is required — never cache without expiry
- Default: 5 minutes (300,000 ms)
- Can be overridden per operation via parameter

## Tags (Cross-Entity Invalidation)

- Use `tags` when cached data depends on related entities
- Tag format: `{entity}:{id}` (e.g., `role:admin`, `user:123`)
- When a related entity changes, use `cache.invalidateByTag(tag)` to clear all associated cache entries
- Always tag cache entries that have cross-entity dependencies

```
cache.set("user:profile:123", data, { tags: ["user:123", "role:admin"] })
cache.invalidateByTag("role:admin")  // clears all entries tagged with role:admin
```

## Invalidation

- Always invalidate cache on mutations (create/update/delete)
- Single entity: use `cache.delete(key)` after a successful mutation
- Cross-entity: use `cache.invalidateByTag(tag)` to clear related entries

## Error Handling

- Cache failure must never crash the system
- If cache is down (connection lost, timeout), the system must continue working — just slower
- Cache errors are logged and swallowed — no TaggedError for cache
