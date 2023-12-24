import chalk from "chalk";
import readlineSync from "readline-sync";
import { ethers } from 'ethers';
import { appendFileSync } from "fs";

// Function to check if a mnemonic phrase is valid
const isValidMnemonic = (phrase) => {
    return phrase.trim().split(" ").length >= 12 && phrase.trim().split(" ").length <= 24;
};

// Main function using async IIFE (Immediately Invoked Function Expression)
(async () => {
    try {
        let numberOfPhrases;

        // Get the number of phrases to convert from user input
        do {
            numberOfPhrases = parseInt(readlineSync.question(chalk.yellow("Enter the number of phrases to convert: ")), 10);
            if (isNaN(numberOfPhrases) || numberOfPhrases <= 0) {
                console.log(chalk.red("Please enter a valid number greater than 0."));
            }
        } while (isNaN(numberOfPhrases) || numberOfPhrases <= 0);

        const phrases = [];

        // Get each phrase from the user
        for (let i = 1; i <= numberOfPhrases; i++) {
            let phraseKey;
            do {
                // Get user input for the phrase or mnemonic key
                phraseKey = readlineSync.question(
                    chalk.yellow(`Input phrase or mnemonic key ${i}/${numberOfPhrases} (12 or 24 words is possible): `)
                );

                // Validate the entered phrase
                if (!isValidMnemonic(phraseKey)) {
                    console.log(chalk.red(`Error for phrase ${i}/${numberOfPhrases}: Your phrase must have between 12 and 24 words and should not be empty. Please re-enter.`));
                }
            } while (!isValidMnemonic(phraseKey));

            phrases.push(phraseKey);
        }

        // Convert each phrase to a private key and write to result.txt
        for (let i = 0; i < numberOfPhrases; i++) {
            const result = ethers.Wallet.fromPhrase(phrases[i]).privateKey;
            if (result) {
                // Append the result to the result.txt file
                appendFileSync('./result.txt', `Mnemonic: ${phrases[i]} || Private key: ${result}\n`);
            }
            console.log(chalk.green(`Conversion ${i + 1}/${numberOfPhrases} successful! Private key: ${result}`));
        }
    } catch (error) {
        console.log(chalk.red("Sorry, we encountered an error. Error details: " + error));
    }
})();
