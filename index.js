import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const markCommit = (date) => {
  const data = {
    date: date,
  };

  console.log("Creating commit for date:", date);

  jsonfile.writeFile(path, data, (err) => {
    if (err) {
      console.error("Error writing to data.json:", err);
      return;
    }
    simpleGit()
      .addConfig("user.name", "hima3210")
      .addConfig("user.email", "himaseevadlamudi@gmail.com")
      .add([path])
      .commit(date, { "--date": date }, (commitErr) => {
        if (commitErr) {
          console.error("Error committing changes:", commitErr);
        } else {
          console.log("Commit created successfully:", date);
          simpleGit().push((pushErr) => {
            if (pushErr) {
              console.error("Error pushing changes:", pushErr);
            } else {
              console.log("Changes pushed successfully.");
            }
          });
        }
      });
  });
};

const makeCommits = () => {
  const totalWeeks = 52; // Number of weeks in a year
  const contributionsPerMonth = 10; // Number of contributions per month
  const darkGreenDaysPerMonth = 2; // Number of days with higher activity per month

  for (let month = 0; month < 12; month++) {
    const darkGreenDays = [];

    // Generate random days for dark green contributions
    for (let i = 0; i < darkGreenDaysPerMonth; i++) {
      const week = random.int(month * 4, (month + 1) * 4 - 1); // Random week in the month
      const day = random.int(0, 6); // Random day in the week
      darkGreenDays.push({ week, day });
    }

    for (let i = 0; i < contributionsPerMonth; i++) {
      const isDarkGreenDay = i < darkGreenDaysPerMonth; // First few contributions are dark green
      const week = isDarkGreenDay
        ? darkGreenDays[i].week
        : random.int(month * 4, (month + 1) * 4 - 1); // Random week in the month
      const day = isDarkGreenDay
        ? darkGreenDays[i].day
        : random.int(0, 6); // Random day in the week

      const date = moment()
        .subtract(1, "y") // Start from one year ago
        .add(week, "w")
        .add(day, "d")
        .format();

      markCommit(date);

      // If it's a dark green day, make additional commits
      if (isDarkGreenDay) {
        const extraCommits = random.int(3, 5); // Random number of extra commits
        for (let j = 0; j < extraCommits; j++) {
          markCommit(date); // Additional commits on the same day
        }
      }
    }
  }
};

makeCommits();