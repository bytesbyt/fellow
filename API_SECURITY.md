# API Security Architecture

This application uses **API Routes** instead of direct database access for enhanced security.

## Architecture Overview

```text
Client (Browser) → API Routes → Supabase (with Service Role Key)
```

## Why API Routes?

1. **No RLS Required**: API routes handle authorization server-side
2. **Service Role Key**: Stays on server, never exposed to client
3. **Custom Logic**: Add validation, rate limiting, business rules
4. **Better Control**: Filter and transform data before sending to client

## Security Implementation

### Client-Side (Dashboard)
- Uses `fetch()` to call API routes
- No direct Supabase queries
- Authentication via cookies/tokens

### Server-Side (API Routes)
- Verifies user authentication
- Validates ownership before operations
- Uses service role key (bypasses RLS)
- Returns filtered data

## API Endpoints

### Brands
- `GET /api/brands` - Get user's brand
- `POST /api/brands` - Create new brand

### Competitors  
- `GET /api/competitors` - List user's competitors
- `POST /api/competitors` - Add competitor
- `DELETE /api/competitors/[id]` - Remove competitor

## Environment Variables

```env
# Public (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Secret (server-only)
SUPABASE_SERVICE_ROLE_KEY=...  # NEVER expose this!
```

## Security Benefits

✅ **User Isolation**: Each user only sees their own data  
✅ **No Direct DB Access**: Clients can't bypass your business logic  
✅ **Server Validation**: All requests validated before database operations  
✅ **Custom Authorization**: Complex permission logic beyond RLS  
✅ **Rate Limiting Ready**: Can add throttling at API layer  

## Testing

```bash
# Test API routes work
curl http://localhost:3000/api/brands
# Should return 401 if not authenticated

# With auth, should return user's brand
```