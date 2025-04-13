import chalk from 'chalk';
// Import necessary classes from Sui SDK and bip39
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { generateMnemonic } from 'bip39'; // Import bip39 for mnemonic generation
import { appendFileSync } from 'fs';
import moment from 'moment';
import readlineSync from 'readline-sync';
import { Buffer } from 'buffer';
import { banner } from './banner.js'; // Assuming banner.js exists

// --- Configuration ---
const WALLET_FILE = './sui_wallets_output.txt'; // Output filename
const BOX_WIDTH = 110; // Adjust if needed

// --- Helper Functions ---

/**
 * Creates a new random Sui Ed25519 keypair and extracts details.
 * Generates mnemonic first, then derives the keypair.
 * @returns {{publicKey: string, privateKey: string, mnemonic: string}} Wallet details.
 * publicKey is the Sui Address.
 * privateKey is the Base64 encoded secret key bytes.
 */
function generateNewSuiWallet() {
    try {
        // 1. Generate a new mnemonic phrase
        const mnemonicPhrase = generateMnemonic();

        // 2. Derive the Ed25519 keypair from the mnemonic
        // Using the default derivation path for Sui (m/44'/784'/0'/0'/0')
        const keypair = Ed25519Keypair.deriveKeypair(mnemonicPhrase);

        // 3. Get the Sui address (derived from the public key)
        const suiAddress = keypair.getPublicKey().toSuiAddress();

        // 4. Get the raw secret key bytes
        const secretKeyBytes = keypair.getSecretKey();

        // 5. Encode the raw secret key bytes to Base64 string
        const privateKeyBase64 = Buffer.from(secretKeyBytes).toString('base64');

        return {
            publicKey: suiAddress,
            privateKey: privateKeyBase64, // Base64 encoded secret key
            mnemonic: mnemonicPhrase,     // The recovery phrase
        };
    } catch (error) {
        console.error(chalk.red('Error during keypair generation:'), error);
        // Return null or throw error to indicate failure
        return null;
    }
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
        const maxContentLength = BOX_WIDTH - 4; // Account for borders and spaces
        const availableValueWidth = maxContentLength - (label.length + 2); // Width available for the value itself

        // Handle potential undefined/null values gracefully before accessing length
        let displayValue = (typeof value === 'string' || typeof value === 'number') ? String(value) : 'ERROR: MISSING VALUE';

        // Truncate if necessary (less likely with adjusted width calculation)
        if (displayValue.length > availableValueWidth) {
            displayValue = displayValue.substring(0, availableValueWidth - 3) + '...';
        }

        const lineContent = prefix + displayValue;
        // Calculate padding based on the actual length of the displayed content
        const paddingCount = Math.max(0, BOX_WIDTH - (lineContent.length - prefix.length + label.length + 4)); // Adjust padding calculation
        const padding = ' '.repeat(paddingCount);

        return color(`│ ${label}: ${displayValue}` + padding + ' │'); // Reconstruct line
    };


    console.log(chalk.cyan(topBorder));
    console.log(formatLine(`Wallet #${walletNumber}`, `(${moment().format('YYYY-MM-DD HH:mm:ss')})`, chalk.cyan.bold));
    console.log(chalk.cyan(separator));
    // Ensure labels have consistent padding for alignment
    console.log(formatLine('Sui Address        ', walletData.publicKey, chalk.green));
    console.log(formatLine('Private Key (B64) ', walletData.privateKey, chalk.red));
    console.log(formatLine('Mnemonic Phrase   ', walletData.mnemonic, chalk.magenta));
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
    console.log(banner); // Make sure banner.js provides the 'banner' export

    try {
        // 2. Get User Input
        const numberOfWalletsInput = readlineSync.question(
            chalk.yellow('Number of Sui wallets to generate: ')
        );
        const requestedCount = parseInt(numberOfWalletsInput, 10);

        if (isNaN(requestedCount) || requestedCount <= 0) {
            console.log(chalk.red('Invalid input. Please enter a positive number.'));
            return;
        }

        console.log(chalk.cyan(`\nGenerating ${requestedCount} Sui wallet(s)...`));

        // 3. Generate Wallets in a Loop
        let successCount = 0;
        for (let i = 1; i <= requestedCount; i++) {
            const newWallet = generateNewSuiWallet(); // Use updated function

            if (newWallet && newWallet.publicKey && newWallet.privateKey && newWallet.mnemonic) {
                displayWalletInfoBox(newWallet, i);
                saveWalletToFile(newWallet);
                successCount++;
            } else {
                console.log(chalk.red(`[${moment().format('HH:mm:ss')}] ERROR: Failed to generate Sui wallet #${i}. Check console for details.`));
                // Optional: Stop execution if one fails, or continue
                // return;
            }
        }

        // 4. Final Confirmation Message
        if (successCount > 0) {
             console.log(
                chalk.greenBright(
                    `\n✅ Success! ${successCount} Sui wallet(s) generated.`
                )
            );
            console.log(
                chalk.green(
                    `Wallet details (Sui Address, PrivateKey Base64, Mnemonic) saved to ${chalk.bold(WALLET_FILE)}.`
                )
            );
            console.log(chalk.yellow.bold("\n⚠️ IMPORTANT: Secure BOTH your Mnemonic Phrase and your Base64 Private Key."))
            console.log(chalk.yellow.bold("   The Mnemonic Phrase is essential for recovery in most Sui wallets."))
            console.log(chalk.yellow.bold("   Treat these credentials as extremely sensitive! Do NOT share them!"))
        } else {
             console.log(chalk.red(`\n❌ Failed to generate any wallets. Please check errors above.`));
        }

    } catch (error) {
        console.error(chalk.red('\n❌ An unexpected error occurred during script execution:'));
        console.error(chalk.red(error.message || error));
         if (error.stack) {
             console.error(chalk.gray(error.stack));
         }
    }
})(); // End of IIFE
