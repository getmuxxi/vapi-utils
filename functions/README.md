# Example Server Functions

From https://github.com/VapiAI/server-example-javascript-deno

When a function is configured in a Vapi assistant, Vapi will detect when the LLM makes a function
call and forward the request to a server.

Use the function examples in this folder for local development and testing.

## Local Dev

1. Start the local functions server

```bash
deno run --allow-net --allow-env functions/index.ts
```

2. Use ngrok to proxy to local server
3. Configure Vapi assistant to use ngrok URL for server url

## Assistant Config

Example functions definition for assistant API:

```json
"functions": [
  {
    "name": "getRandomName",
    "description": "Generates a random name based on optional gender and nationality",
    "parameters": {
      "type": "object",
      "properties": {
        "gender": { "type": "string", "enum": ["male", "female"],
          "description": "The gender for which to generate a name." },
        "nat": { "type": "string",
          "description": "The nationality based on which to generate a name. Example: IN for India, US for United States of America or USA and so on." }
      }
    }
  },
```
