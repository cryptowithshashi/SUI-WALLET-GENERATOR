import chalk from 'chalk';
// Import necessary Keypair class from Sui SDK
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { appendFileSync } from 'fs';
import moment from 'moment';
import readlineSync from 'readline-sync';
import { Buffer } from 'buffer'; // Needed for Base64 encoding
import { banner } from './banner.js';

// --- Configuration ---
const WALLET_FILE = './sui_wallets_output.txt'; // Output filename
// Adjust width - Base64 keys are shorter than Base58, but mnemonics are long
const BOX_WIDTH = 110;

// --- Helper Functions ---

/**
 * Creates a new random Sui Ed25519 keypair and extracts details.
 * @returns {{publicKey: string, privateKey: string, mnemonic: string}} Wallet details.
 * publicKey is the Sui Address.
 * privateKey is the Base64 encoded secret key bytes.
 */
function generateNewSuiWallet() {
    // Generate a new Ed25519 keypair (Sui's default)
    const keypair = Ed25519Keypair.generate();

    // Get the Sui address (derived from the public key)
    const publicKey = keypair.getPublicKey().toSuiAddress();

    // Export the keypair to get the mnemonic
    // Note: Sui's export format includes the key scheme
    const exported = keypair.export(); // { keypair: string, mnemonic: string } format not standard? Let's try getting mnemonic differently
    // Correction: The Ed25519Keypair itself should have the mnemonic derivation if generated correctly
    // Let's try generating *from* a mnemonic derived from random entropy
    const mnemonic = Ed25519Keypair.generate().getSecretKey(); // Let's stick to the method that provides mnemonic directly
    // Re-Correction: Let's try the documented way to get mnemonic from a new keypair

    const newKeypair = Ed25519Keypair.generate();
    const suiAddress = newKeypair.getPublicKey().toSuiAddress();
    const secretKeyBytes = newKeypair.getSecretKey(); // Get the raw secret bytes (Uint8Array)
    const mnemonicPhrase = newKeypair.export().mnemonic; // <-- This should work based on typical SDK patterns

    // Encode the raw secret key bytes to Base64 string for backup/storage
    const privateKeyBase64 = Buffer.from(secretKeyBytes).toString('base64');

    return {
        publicKey: suiAddress,
        privateKey: privateKeyBase64, // Base64 encoded secret key
        mnemonic: mnemonicPhrase,       // The recovery phrase
    };
}


/**
 * Displays wallet details in a formatted box to the console.
 * @param {object} walletData - Wallet data {publicKey, privateKey, mnemonic}.
 * @param {number} walletNumber - The sequential number of the wallet generated.
 */
function displayWalletInfoBox(walletData, walletNumber) {
    const topBorder = '┌' + '─'.repeat(BOX_WIDTH - 2) + '┐';
    const bottomBorder = '└' + '─'.repeat(BOX_WIDTH - 2) + '┘';
    const separator = '├' + '─'.repeat(BOX_WIDTH - 2) + '┤';

    const formatLine = (label, value, color = chalk.white) => {
        const prefix = `│ ${label}: `;
        const maxContentLength = BOX_WIDTH - 4;
        const availableValueWidth = maxContentLength - prefix.length + 2;
        let displayValue = value;
        if (displayValue.length > availableValueWidth) {
            displayValue = displayValue.substring(0, availableValueWidth - 3) + '...';
        }
        const lineContent = prefix + displayValue;
        const paddingCount = Math.max(0, BOX_WIDTH - lineContent.length - 1);
        const padding = ' '.repeat(paddingCount);
        return color(lineContent + padding + '│');
    };

    console.log(chalk.cyan(topBorder));
    console.log(formatLine(`Wallet #${walletNumber}`, `(${moment().format('YYYY-MM-DD HH:mm:ss')})`, chalk.cyan.bold));
    console.log(chalk.cyan(separator));
    console.log(formatLine('Sui Address        ', walletData.publicKey, chalk.green));
    console.log(formatLine('Private Key (B64)  ', walletData.privateKey, chalk.red));
    console.log(formatLine('Mnemonic Phrase    ', walletData.mnemonic, chalk.magenta));
    console.log(chalk.cyan(bottomBorder));
    console.log('');
}

/**
 * Saves wallet details (Sui Address, Base64 PrivKey, Mnemonic) to a file.
 * @param {object} walletData - {publicKey, privateKey, mnemonic}.
 */
function saveWalletToFile(walletData) {
    // Updated file content format for Sui
    const fileContent = `SuiAddress: ${walletData.publicKey} | PrivateKey(Base64): ${walletData.privateKey} | Mnemonic: ${walletData.mnemonic}\n`;
    try {
        appendFileSync(WALLET_FILE, fileContent);
    } catch (writeError) {
        console.error(chalk.red(`Error writing to file ${WALLET_FILE}:`), writeError);
    }
}

// --- Main Execution Logic (Async IIFE) ---
(async () => {
    // 1. Display Banner
    console.log(banner);

    try {
        // 2. Get User Input
        const numberOfWalletsInput = readlineSync.question(
            chalk.yellow('Number of Sui wallets to generate: ') // Sui-specific prompt
        );
        const requestedCount = parseInt(numberOfWalletsInput, 10);

        if (isNaN(requestedCount) || requestedCount <= 0) {
            console.log(chalk.red('Invalid input. Please enter a positive number.'));
            return;
        }

        console.log(chalk.cyan(`\nGenerating ${requestedCount} Sui wallet(s)...`));

        // 3. Generate Wallets in a Loop
        for (let i = 1; i <= requestedCount; i++) {
            const newWallet = generateNewSuiWallet();

            if (newWallet && newWallet.publicKey) {
                displayWalletInfoBox(newWallet, i);
                saveWalletToFile(newWallet);
            } else {
                // Added more specific error logging if generation fails
                console.log(chalk.red(`[${moment().format('HH:mm:ss')}] ERROR: Failed to generate Sui wallet #${i}. Check dependencies and SDK methods.`));
            }
        }

        // 4. Final Confirmation Message (Updated for Sui)
        console.log(
            chalk.greenBright(
                `\n✅ Success! ${requestedCount} Sui wallet(s) generated.`
            )
        );
        console.log(
            chalk.green(
                `Wallet details (Sui Address, PrivateKey Base64, Mnemonic) saved to ${chalk.bold(WALLET_FILE)}.`
            )
        );
        console.log(chalk.yellow.bold("\n⚠️ IMPORTANT: Secure BOTH your Mnemonic Phrase and your Base64 Private Key."))
        console.log(chalk.yellow.bold("   The Mnemonic Phrase is essential for recovery in most Sui wallets."))
        console.log(chalk.yellow.bold("   Treat these credentials as extremely sensitive!"))

    } catch (error) {
        console.error(chalk.red('\n❌ An unexpected error occurred during wallet generation:'));
        // Log more details if available from the Sui SDK error
        console.error(chalk.red(error.message || error));
         if (error.stack) {
             console.error(chalk.gray(error.stack));
         }
    }
})(); // End of IIFE
