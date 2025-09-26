# localGPT

![NextJS](https://img.shields.io/badge/Built_with-NextJS-blue)
![OpenAI API](https://img.shields.io/badge/Powered_by-OpenAI_API-orange)

This repository contains a NextJS starter app built on top of the [Responses API](https://platform.openai.com/docs/api-reference/responses).
It leverages built-in tools ([web search](https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses) and [file search](https://platform.openai.com/docs/guides/tools-file-search)) and implements a chat interface with multi-turn conversation handling.

Features:

- Multi-turn conversation handling
- Streaming responses & tool calls
- Function calling
- Display annotations
- Web search tool configuration
- Vector store creation & file upload for use with the file search tool
- MCP server configuration
- Google Calendar & Gmail integration via first-party connector

This app is meant to be used as a starting point to build a conversational assistant that you can customize to your needs.

## How to use

1. **Set up the OpenAI API:**

   - If you're new to the OpenAI API, [sign up for an account](https://platform.openai.com/signup).
   - Follow the [Quickstart](https://platform.openai.com/docs/quickstart) to retrieve your API key.

2. **Set the OpenAI API key:**

   2 options:

   - Set the `OPENAI_API_KEY` environment variable [globally in your system](https://platform.openai.com/docs/libraries#create-and-export-an-api-key)
   - Set the `OPENAI_API_KEY` environment variable in the project: Create a `.env` file at the root of the project and add the following line (see `.env.example` for reference):

   ```bash
   OPENAI_API_KEY=<your_api_key>
   ```

3. **Clone the Repository:**

   ```bash
   git clone https://github.com/openai/openai-responses-starter-app.git
   ```

4. **Install dependencies:**

   Run in the project root:

   ```bash
   npm install
   ```

5. **Run the app:**

   ```bash
   npm run dev
   ```

   The app will be available at [`http://localhost:3000`](http://localhost:3000).

## Tools

This starter app shows how to use built-in tools, MCP servers, and first-party connectors with the Responses API.

You can configure these tools directly from the UI, but some tools require additional setup (e.g. Google OAuth).

### Built-in tools

We have several out-of-the-box tools available to use with the Responses API. This demo app implements and allows to configure directly from the UI the following tools:

- File search, to allow the model to access your files in a vector store
- Web search, to allow the model to search the web
- Code interpreter, to allow the model to run Python code to solve problems

Other built-in tools, such as computer use or image generation, are not implemented in this demo app.

### MCP servers

The UI allows you to configure a public MCP server to use with the Responses API. If you want to use an MCP server that requires authentication, feel free to update `lib/tools/tools.ts` to add your own logic. You can use the Google connector integration as an example of how to use access tokens.

### Custom functions

This demo app comes with example functions, `get_weather` and `get_joke`. You can add your own functions to the `config/functions.ts` file.

## Demo flows

### Try web search + code interpreter

After enabling web search and code interpreter in the UI, ask the model:

> "Can you fetch the temperatures in SF for August and then generate a chart plotting them?"

The model should use the web search tool to fetch the temperatures and then use the code interpreter tool to generate a chart which will be displayed in the UI.

### Try file search

- Save PDF files, for examples blog posts (you can use [this one](https://openai.com/index/new-tools-and-features-in-the-responses-api/), then print the page and use the "Save as PDF" option)
- Create a new vector store and upload the PDF file(s)
- Enable file search and ask the model a question which can be answered by the PDF file(s), for example:
  > "What's new with the Responses API?"
- The model should use the file search tool to find the relevant information in the PDF file(s) and then display the response
