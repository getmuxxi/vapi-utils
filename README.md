# Vapi Assistant Utils

Utility scripts for creating, fetching and updating Vapi agents.

Many of the Vapi assistant configuration options are only available via API. The utility scripts can
be used to fetch existing persistent assistants and patch them with additional config options.

Uses Deno v2 to simplify running typescript cli scripts.

## Setup

```bash
brew install deno

# Optionally create .env
cp .env.example .env
# Then manually add Vapi private API key to .env
# If no key is set, either pass in as an CLI arg or script will prompt for key

# HELP
# Run any script with -h
deno run assistant-list -h
```

## Commands

```bash
# LIST assistants
deno run assistant-list

# CREATE assistant
deno run assistant-create assistant.json

# GET assistant
# Output to terminal:
deno run assistant-get --id ASSISTANT-UUID
# Output to file:
deno run assistant-get --id ASSISTANT-UUID --json > output.json

# UPDATE assistant
# Patches with new settings from config-file
# json, js, and ts config files supported
deno run assistant-update --id ASSISTANT-UUID ./assistants/config-file.ts
```

See [deno.jsonc](deno.jsonc) for more API commands.

**Deno Dev Commands**

```bash
# Lint and fix files
deno lint --fix

# Format files
deno fmt --check
```

## Docs & References

- [Vapi API Reference](https://docs.vapi.ai/api-reference/assistants/get-assistant)
- [Vapi Server Functions Example](https://github.com/VapiAI/server-example-serverless-cloudflare) -
  cloudflare deployable

**Features Only Available via API**

- [Transcriber Custom Keywords](https://docs.vapi.ai/customization/custom-keywords) - helps provide
  more accurate transcriptions for proper nouns and jargon

## TODO

### Tests

- [ ] Add tests for cli flags
- [ ] Add tests for config file loading
