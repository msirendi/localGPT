# Technical Context: localGPT

## Core Technologies
- **Framework**: Next.js 15.2.3 (App Router)
- **Language**: TypeScript 5.6.2
- **Runtime**: Node.js 20+
- **Styling**: Tailwind CSS 3.4.1 with custom animations
- **State Management**: Zustand 5.0.2

## Key Dependencies

### UI & Components
- **Radix UI**: Accessible component primitives (`@radix-ui/react-*`)
- **Lucide React**: Icon system
- **Tailwind Merge**: Utility class merging
- **Class Variance Authority**: Type-safe component variants

### OpenAI Integration
- **OpenAI SDK**: v4.87.3 for Responses API
- **Streaming**: Server-sent events for real-time responses
- **Tool System**: Built-in tools + custom functions + MCP servers

### Authentication & External Services
- **OpenID Client**: v6.6.4 for OAuth 2.0 flows
- **Google Integration**: Calendar & Gmail via OAuth connectors
- **Session Management**: HTTP-only cookies for security

### File Processing & UI
- **React Dropzone**: File upload handling
- **React Markdown**: Markdown rendering with syntax highlighting
- **React Syntax Highlighter**: Code block rendering
- **Highlight.js**: Syntax highlighting engine
- **KaTeX**: Mathematical expression rendering

### Data & Visualization
- **Recharts**: Chart and graph generation
- **Partial JSON**: Streaming JSON parsing
- **Zod**: Runtime type validation and schema definitions

## Development Environment

### Setup Requirements
```bash
# Node.js version
node --version  # Should be 20+

# Package manager
npm install

# Environment variables
OPENAI_API_KEY=your_api_key
GOOGLE_CLIENT_ID=your_google_client_id (optional)
GOOGLE_CLIENT_SECRET=your_google_secret (optional)
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
```

### Development Scripts
- `npm run dev`: Start development server on port 3000
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: ESLint code quality checks

### File Structure Conventions
```
app/                    # Next.js App Router pages
  api/                  # API route handlers
    turn_response/      # Main OpenAI integration
    functions/          # Custom function implementations
    vector_stores/      # File search functionality
    google/             # OAuth integration
components/             # React components
  ui/                   # Reusable UI primitives
config/                 # Configuration files
lib/                    # Utility libraries and tools
stores/                 # Zustand state management
public/                 # Static assets
```

## Technical Constraints

### API Limitations
- **OpenAI Model**: Currently uses `gpt-4.1` (Responses API)
- **Tool Limits**: Built-in tools have usage quotas
- **Streaming**: Requires proper SSE handling for real-time responses
- **Rate Limiting**: Subject to OpenAI API rate limits

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: SSE, WebSockets, File API, OAuth popup flows

### Performance Considerations
- **Bundle Size**: Large dependency tree (OpenAI SDK, UI libraries)
- **Streaming**: Memory management for long conversations
- **File Processing**: Client-side validation before upload
- **Mobile**: Optimized for touch interfaces and smaller screens

### Security Requirements
- **API Keys**: Must be server-side only (never exposed to client)
- **OAuth Tokens**: HTTP-only cookies with proper expiration
- **File Uploads**: Validation and size limits
- **CORS**: Properly configured for production domains

## Integration Points

### OpenAI Responses API
- **Streaming**: Real-time response handling via SSE
- **Tools**: Dynamic tool configuration based on UI state
- **Context**: Conversation history management
- **Error Handling**: Graceful fallbacks for API failures

### Google OAuth Integration
- **Flow**: Authorization code flow with PKCE
- **Scopes**: Calendar events, Gmail read/modify
- **Token Management**: Access token + refresh token rotation
- **Session**: Per-browser session management

### MCP Server Support
- **Configuration**: Runtime MCP server URL configuration
- **Approval**: User approval workflow for sensitive operations
- **Transport**: HTTP-based MCP communication

## Development Workflow
1. **Local Setup**: Configure environment variables
2. **API Testing**: Use built-in tools first, then add custom functions
3. **UI Development**: Use TypeScript strict mode, component composition
4. **Integration**: Test streaming responses and tool calling
5. **OAuth Setup**: Configure Google OAuth for full functionality
6. **Production**: Build and deploy with proper environment configuration

## Known Technical Debt
- Limited error boundary implementation
- No offline functionality
- Basic session management (no persistence)
- Limited accessibility testing
- No comprehensive test suite
