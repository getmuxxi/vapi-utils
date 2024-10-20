# Vapi Assistant Utils

Utility scripts for creating, fetching and updating Vapi agents.

Many of the Vapi assistant configuration options are only available via API. The utility scripts can
be used to fetch existing persistent assistants and patch them with additional config options.

Uses Deno v2 to simplify running typescript cli scripts.

```bash
brew install deno

# Get an assistant from Vapi API
deno run get-assistant --id ASSISTANT-UUID
# Pipe JSON output to a file
deno run get-assistant --id ASSISTANT-UUID > output.json

# Update a persistent assistant
# Patches with new settings in config-file
# json, js, and ts config files supported
deno run update-agent --id ASSISTANT-UUID ./assistants/config-file.ts
```

**Deno Dev Commands**

```bash
# Lint and fix files
deno lint --fix

# Format files
deno fmt --check
```

## Docs & References

[Vapi API Reference](https://docs.vapi.ai/api-reference/assistants/get-assistant)

**Features Only Available via API**

- [Transcriber Custom Keywords](https://docs.vapi.ai/customization/custom-keywords) - helps provide
  more accurate transcriptions for proper nouns and jargon

## TODO

### Tests

- [ ] Add tests for cli flags
- [ ] Add tests for config file loading
