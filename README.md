
# SUI WALLET GENERATOR GUIDE

A simple and user-friendly Node.js script designed to generate multiple sui wallets.

It generates and displays the Public Key (Address), the Private Key, and the Mnemonic Recovery Phrase for each wallet in a clean box format in your console. Credentials are also saved locally to a text file.

# Features

- Instantly create multiple crypto wallets in one go.

- Neatly organized wallet details (Address, Private Key, and Secret Phrase).

- Automatically saves all wallet details in a file for easy access.

# Pre Requisites

- Ensure Git, Node.js, and npm are installed. If not, install them using your VPS distribution's package manager.

```bash
    sudo apt update
```
```bash
    sudo apt install git nodejs npm -y
```
# INSTALLATION GUIDE

Install Dependencies

```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y git nodejs npm
```

Clone Repository

```bash
   git clone https://github.com/cryptowithshashi/SUI-WALLET-GENERATOR.git
```

```bash
    cd SUI-WALLET-GENERATOR
```

Install Packages

```bash
   npm install
```
Execute the code

```bash
   node index.js
```

Use this command to check your wallet's info

```bash
   nano sui_wallets_output.txt
```

If you found error in your terminal is due to PowerShell's execution policy restricting script execution. You can enable script execution by running the following command in PowerShell as an administrator

```bash
   Set-ExecutionPolicy Unrestricted -Scope CurrentUser
```

If prompted, type A (for Yes to All) and press Enter. Now, try running your npm install command again.

Enter number of wallets when prompted
find saved wallets in solana_wallet_outputs.txt
DELETE solana_wallet_outputs.txt from VPS after download. Store mnemonics in encrypted storage
Never expose private keys online
Maintain offline backups

DISCLAIMER -- This tool is provided "as-is" for educational purposes. The developers assume no responsibility for lost funds or security breaches. Always audit generated wallets before mainnet use.

ABOUT ME

Twitter -- https://x.com/SHASHI522004

Github -- https://github.com/cryptowithshashi
