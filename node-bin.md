Para criar um executável local CLI em node

- package.json
  ```json
  "bin": {
    "my-command": "path/to/exec.js"
  }
  ```
- precisa de shebang `#!/usr/bin/env node`
- `chmod +x`
- `npx my-command`
