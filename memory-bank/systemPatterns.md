# System Patterns: localGPT

## Architecture Overview
**Pattern**: Next.js App Router + TypeScript + Client-Server Component Separation
- Server components handle data fetching and API integration
- Client components manage interactivity and state
- API routes provide backend functionality with proper error handling

## State Management
**Pattern**: Zustand for Client State + Conversation Management
- `useConversationStore`: Manages chat messages, conversation history, loading states, and conversation CRUD operations
- `useToolsStore`: Handles tool configuration and state persistence
- Stores are lightweight, reactive, and avoid over-engineering
- Conversation persistence handled via API routes with in-memory storage (demo) or database (production)

## Streaming Response Handling
**Pattern**: Server-Sent Events (SSE) with OpenAI Responses API
```typescript
// Route handler creates ReadableStream
const events = await openai.responses.create({ stream: true });
const stream = new ReadableStream({
  async start(controller) {
    for await (const event of events) {
      controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
    }
  }
});
```
- Client consumes SSE stream and updates UI in real-time
- Graceful error handling and connection management

## Tool Integration Architecture
**Pattern**: Modular Tool System with Type Safety
- Built-in tools: `web_search`, `file_search`, `code_interpreter`
- Custom functions: Defined in `config/functions.ts` with proper schemas
- MCP servers: Dynamic configuration with approval workflows
- Google connectors: OAuth-based integration with session management

## Component Design Patterns
**Pattern**: Composition over Inheritance
- UI components use Radix UI primitives as foundation
- Custom components compose primitives for specific functionality
- Props interfaces clearly define component contracts
- Conditional rendering based on state/props

## API Route Patterns
**Pattern**: RESTful with Proper Error Handling
```typescript
export async function POST(request: Request) {
  try {
    const { param } = await request.json();
    // Business logic
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

## Configuration Management
**Pattern**: Environment-based with Runtime Validation
- `.env` files for secrets and configuration
- Constants file for app-level settings
- Runtime validation of required environment variables
- Separate development/production configurations

## Authentication Patterns
**Pattern**: Session-based OAuth with Token Management
- OAuth flow handled via API routes
- Access tokens stored in HTTP-only cookies
- Refresh token rotation for security
- Session invalidation on logout

## File Handling Patterns
**Pattern**: Vector Store + Upload Pipeline
- File validation and processing on upload
- Vector store creation and management
- Chunked file processing for large documents
- Metadata preservation and search optimization

## Error Handling Strategy
**Pattern**: Layered Error Handling
- API route level: Structured error responses
- Component level: Try-catch with user-friendly messages
- Store level: Error state management
- Global level: Unhandled error boundaries

## Responsive Design Pattern
**Pattern**: Mobile-First with Progressive Enhancement
- Tailwind CSS utilities for responsive breakpoints
- Mobile-optimized chat interface
- Collapsible panels for space management
- Touch-friendly interaction targets

## Security Patterns
- Environment variable validation
- CORS configuration for API routes
- Secure token storage (HTTP-only cookies)
- Input validation and sanitization
- OAuth 2.0 with proper scopes and redirects
