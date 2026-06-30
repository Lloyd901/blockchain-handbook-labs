UPLOAD INSTRUCTIONS (SHORT)

Overview:
- This repository contains hands-on examples from the "Handbook of Blockchain Technology Development". Local build artifacts have been removed to prepare the project for upload to GitHub.
- Removed or added to `.gitignore`: `node_modules/`, `artifacts/`, `cache/`, `logs/`, `deploy-info.json`, `frontend/deploy-info.json`.

Recommended steps:
1. Create a new repository on GitHub (public or private).
2. On your local machine, run:

```powershell
cd "f:\新建文件夹\blockchain-handbook-labs-main\blockchain-handbook-labs-main"
git init
git add .
git commit -m "Prepare repo for GitHub: remove build artifacts and node_modules"
# Replace <REMOTE_URL> with the repository URL you created on GitHub
git remote add origin <REMOTE_URL>
git branch -M main
git push -u origin main
```

Notes:
- Do NOT upload any private keys or sensitive configuration files (e.g., `.env`, keystore files).
- If you need to keep `deploy-info.json` for frontend testing, consider creating a template file named `deploy-info.example.json` and document how to fill it in the `README`.
- There are several `npm audit` warnings in the dependency tree; this project is for learning/demo purposes. If using in production, update dependencies and address security issues.

Quick recap: the following key folders/files are retained for the repository: `contracts/`, `scripts/`, `frontend/`, `nodejs-hashing/`, `package.json`, `hardhat.config.js`, `README.md`.

If you want me to:
- generate a `deploy-info.example.json` template, or
- create a GitHub repository and push the code for you (I will need the remote URL),
please tell me which option you prefer.