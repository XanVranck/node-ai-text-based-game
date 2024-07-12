import inquirer from 'inquirer';
import callOpenAI from './openai.js';


let chosenScenarios = [];
const scenarios = [
    // Scenario 1: Introduction
    {
        name: 'intro',
        message: 'You wake up in a mysterious room. What do you do?',
        choices: [
            { name: 'Look around', nextScenario: 'lookAround' },
            { name: 'Open the door', nextScenario: 'openDoor' }
        ]
    },
    // ... (more scenarios)
    // Scenario 7: Conclusion
    {
        name: 'ending',
        message: 'Congratulations! You have completed the adventure.',
        choices: []
    }
];

// Function to present a scenario and get player choice
const presentScenario = async (scenario) => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: scenario.message,
            choices: scenario.choices.map(choice => choice.name),
            filter: async answer => {
              await new Promise(r => setTimeout(r, 3000));
              return `filtered${answer}`;
            },
            filteringText: 'Generating...'
        }
    ]);

    return answers.choice;
};

// Function to start the game
const startGame = async () => {
    // Start with the 'intro' scenario
    let currentScenario = scenarios.find(scenario => scenario.name === 'intro');
    

    // Continue looping through scenarios as long as there's a current scenario
    while (currentScenario) {
        // Present the current scenario to the player and get their choice

        const playerChoice = await presentScenario(currentScenario);
        chosenScenarios.push(currentScenario.message)
        currentScenario = await callOpenAI(chosenScenarios, playerChoice)
        console.log('------------------------')
        // Find the next scenario based on the player's choice and update the current scenario
    }

    // Print a thank-you message when the game ends
    console.log('Thanks for playing! Goodbye.');
};

// Start the game by calling the startGame function
startGame();