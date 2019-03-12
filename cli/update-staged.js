const path = require('path');
const fs = require('fs');
const sgf = require('staged-git-files');
const matter = require('gray-matter');
const chalk = require('chalk');
const utils = require('./utils');

function getStagedFiles() {
  return new Promise((resolve, reject) => {
    sgf((error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

const todayStr = utils.getTodayStr();

function checkAndModify(list, keys) {
  let hasError = false;
  list.forEach(({ filename }) => {
    let hasModified = false;
    const filepath = path.resolve(process.cwd(), filename);
    const content = fs.readFileSync(filepath, 'utf8');
    const parsed = matter(content);
    const frontmatter = parsed.data;
    keys.forEach((key) => {
      if (frontmatter[key] === todayStr) return;
      hasModified = true;
      hasError = true;
      frontmatter[key] = todayStr;
    });
    if (hasModified) {
      fs.writeFileSync(filepath, matter.stringify(parsed.content, frontmatter), 'utf8');
    }
  });
  return hasError;
}

getStagedFiles()
  .then((list) => {
    const posts = list.filter(({ filename }) => /^content\/blog\/.+\.md$/.test(filename));
    const modified = posts.filter(({ status }) => status === 'Modified');
    const newAdded = posts.filter(({ status }) => status === 'Added');
    let needToUpdateModified = checkAndModify(modified, ['modified']);
    let needToUpdateAdded = checkAndModify(newAdded, ['date', 'modified']);
    if (needToUpdateAdded || needToUpdateModified) {
      console.error(chalk.red('[ERROR]: date or modified date has not been updated. Please commit again!'));
      process.exit(1);
    }
  });
