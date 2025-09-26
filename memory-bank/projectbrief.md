# Project Brief: localGPT

## Overview
NextJS starter application demonstrating OpenAI's Responses API capabilities with built-in tools, streaming responses, and multi-turn conversation handling.

## Core Requirements
- **Chat Interface**: Multi-turn conversational AI with streaming responses
- **Tool Integration**: Built-in tools (web search, file search, code interpreter) + custom functions + MCP servers
- **Google Integration**: OAuth-based Calendar & Gmail connectivity via first-party connectors
- **File Management**: Vector store creation and file upload for document search
- **Responsive Design**: Mobile-friendly with collapsible tools panel

## Key Features
1. **Streaming Responses**: Real-time AI response streaming with tool call display
2. **Tool Configuration**: UI-based tool enabling/configuration
3. **Function Calling**: Custom function examples (weather, jokes)
4. **Document Search**: PDF upload and vector store search capabilities
5. **Web Search**: Real-time web information retrieval
6. **Code Execution**: Python code interpreter with chart generation
7. **MCP Server Support**: Configurable Model Context Protocol server integration
8. **OAuth Integration**: Secure Google Calendar/Gmail access

## Success Metrics
- Functional chat interface with streaming
- All tools working properly
- Google OAuth flow completing successfully
- Responsive design across devices
- Clean, maintainable codebase structure

## Constraints
- Must use OpenAI Responses API (not standard Chat Completions)
- Requires OpenAI API key for operation
- Google integration requires OAuth 2.0 setup
- Built for demonstration/starter purposes (not production-ready)
