const { DateTime } = require('luxon');
const jsonfile = require('jsonfile');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

function getRandomLetters() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomLetters = '';
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        randomLetters += alphabet[randomIndex];
    }
    return randomLetters;
}

async function commitDates(startDateStr) {
    let currentDate = DateTime.fromISO(startDateStr);
    const endDate = DateTime.local().minus({ days: 1 });

    const selectedDays = new Set();

    // Randomly select days
    while (currentDate <= endDate) {
        if (Math.random() < 0.55) {
            selectedDays.add(currentDate.toISODate());
        }
        currentDate = currentDate.plus({ days: 1 });
    }

    // Create one commit on each selected day
    for (const selectedDay of selectedDays) {
        let formattedDate = DateTime.fromISO(selectedDay).toISO();
        const randomLetters = getRandomLetters();
        const data = {
            date: `${formattedDate} - ${randomLetters}`,
        };
        jsonfile.writeFileSync(FILE_PATH, data);
        console.log(jsonfile.readFileSync(FILE_PATH, 'utf8'));
        await simpleGit().add([FILE_PATH]).commit(`Commit on ${formattedDate} - ${randomLetters}`, { '--date': DateTime.fromISO(selectedDay).toRFC2822() }).push();

        // With a 0.5 probability, create another random number of commits (between 1 and 4) on the same day
        if (Math.random() < 0.7) {
            const numberOfAdditionalCommits = getRandomInt(1, 4);
            for (let i = 0; i < numberOfAdditionalCommits; i++) {
                const additionalRandomLetters = getRandomLetters();
                const additionalData = {
                    date: `${formattedDate} - ${additionalRandomLetters}`,
                };
                jsonfile.writeFileSync(FILE_PATH, additionalData);
                console.log(jsonfile.readFileSync(FILE_PATH, 'utf8'));
                await simpleGit().add([FILE_PATH]).commit(`Additional commit on ${formattedDate} - ${additionalRandomLetters}`, { '--date': DateTime.fromISO(selectedDay).toRFC2822() }).push();
            }
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

commitDates('2022-07-11T00:00:00.000+03:00');
