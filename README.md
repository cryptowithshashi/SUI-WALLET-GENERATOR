# Sui Multi-Wallet Generator 💧

Generate multiple Sui wallets efficiently using this Node.js script. It provides the **Sui Address**, **Base64 encoded Private Key**, and the **Mnemonic Recovery Phrase** for each generated wallet.

Output is displayed clearly in the console using formatted boxes and saved locally to `sui_wallets_output.txt`.

![Sui Banner Preview](https://user-images.githubusercontent.com/your-username/your-repo/your-image-id.png) *(Screenshot showing the Sui banner and console output)*

## ✨ Features

* Generate any number of Sui wallets (Ed25519 Keypairs).
* Provides for each wallet:
    * **Sui Address** (starting with `0x`)
    * **Private Key (Base64 Encoded)** - String representation of the raw secret key.
    * **Mnemonic Phrase** - For recovery and standard wallet import.
* Unique Sui-themed ASCII banner.
* Clear, boxed console output.
* Uses the official `@mysten/sui.js` SDK for reliable key generation.
* Saves all credentials locally to `sui_wallets_output.txt`.
* Uses `chalk` for colored console output.

## 📋 Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (Version 16.x or higher often recommended for Sui SDK)
* [npm](https://www.npmjs.com/) (Typically included with Node.js)
* [Git](https://git-scm.com/) (For cloning the repository)

---

## 💻 Setup & Usage (VS Code / Local Desktop)

1.  **Open Your Terminal.**
2.  **Clone the Repository:**
    ```bash
    # Replace with YOUR repository URL
    git clone [https://github.com/your-username/sui-wallet-generator-custom.git](https://github.com/your-username/sui-wallet-generator-custom.git)
    ```
3.  **Open the Project Folder:** `cd sui-wallet-generator-custom` (and optionally in VS Code).
4.  **Install Dependencies:**
    * **Crucial Step:** Run this after cloning or if `package.json` changes:
    ```bash
    npm install
    ```
    *(Installs `@mysten/sui.js`, `chalk`, etc.)*
5.  **Run the Generator:**
    ```bash
    node index.js
    ```
6.  **Enter Wallet Count:** Provide the number when prompted.
7.  **View Output:**
    * **Console:** Wallet details (Address, Base64 Private Key, Mnemonic) appear in boxes.
    * **File:** `sui_wallets_output.txt` contains the saved credentials.

8.  **SECURE YOUR WALLETS:** Read the **Important Security Notice** below!

---

## ☁️ Setup & Usage (VPS / Command Line)

1.  **Connect via SSH.**
2.  **Install/Verify Prerequisites** (`git`, `nodejs` >= 16, `npm`). Use NVM or NodeSource if needed for Node version management.
3.  **Clone the Repository:** `git clone https://github.com/your-username/sui-wallet-generator-custom.git`.
4.  **Navigate:** `cd sui-wallet-generator-custom`.
5.  **Install Dependencies:** `npm install`.
6.  **Run the Generator:** `node index.js`.
7.  **Enter Wallet Count.**
8.  **View Output:**
    * **Console:** Details printed in the SSH session.
    * **File:** Check `sui_wallets_output.txt` (e.g., `cat sui_wallets_output.txt`). Use `scp` or SFTP to transfer securely if needed.
9.  **SECURE YOUR WALLETS:** Read the **Important Security Notice** below!

---

## ⚠️ IMPORTANT SECURITY NOTICE ⚠️

* This script outputs your **Sui Address**, **Base64 Private Key**, and **Mnemonic Phrase**.
* **NEVER SHARE the Base64 Private Key OR the Mnemonic Phrase.** Anyone possessing *either* can steal your funds.
* **Mnemonic Phrase:** This is the standard method for backing up and recovering Sui wallets in applications like Sui Wallet, Suiet, etc. Protect this phrase above all else, preferably offline.
* **Base64 Private Key:** This represents the raw secret key. While less commonly used for direct import into wallets than the mnemonic, it provides full control and must be kept absolutely secret.
* **SECURE THE `sui_wallets_output.txt` FILE IMMEDIATELY.** Delete it after securely storing the Mnemonic (and optionally the Base64 key) offline or in an encrypted password manager. Be especially careful on shared systems or servers.
* **This tool is primarily for development, testing, or educational purposes.** Do **NOT** use wallets generated this way for storing significant value without understanding Sui key management and securing the credentials properly.
* **USE THIS SCRIPT AT YOUR OWN RISK.** No responsibility is assumed for lost funds.

## 🔧 Configuration (Optional)

Adjust constants in `index.js`:

* `BOX_WIDTH`: Modify the console output box width.
* `WALLET_FILE`: Change the output filename.

## 📞 Contact

Telegram Channel: [https://t.me/crypto_with_shashi](https://t.me/crypto_with_shashi)

---
