const prompts = require('prompts');
const matter = require('gray-matter');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const daily = path.resolve(__dirname, '..', 'content/daily');
const suffix = '.md';

function getExistingCategories() {
  const categories = utils.getAllDailyFrontMatter()
    .map(parsed => parsed.data.category)
    .filter(Boolean)
    .map(category => category.trim())
    .reduce((set, category) => set.add(category), new Set());
  return Array.from(categories.keys()).map(category => ({
    title: category,
    value: category,
  }));
}

prompts([
  {
    type: 'text',
    name: 'title',
    message: 'specify the title of this daily tip',
  },
  {
    type: 'select',
    name: 'category',
    message: 'choose the category for this daily tip',
    choices: [
      { title: '[New/None]', value: '' }
    ].concat(getExistingCategories()),
  },
  {
    type: (prev) => prev === '' ? 'text' : null,
    name: 'newCategory',
    message: 'use new tag for this draft',
    format: value => value ? value[0].toUpperCase() + value.substr(1) : value,
  },
]).then((result) => {
  const category = result.newCategory || result.category || '';
  let filename = result.title.split(' ').join('-') + suffix;
  let filepath = path.resolve(daily, filename);
  let index = 2;
  while (fs.existsSync(filepath)) {
    filename = result.title.split(' ').join('-') + '-' + index + suffix;
    filepath = path.resolve(daily, filename);
    index += 1;  
  }
  const dateStr = utils.getTodayStr();

  const content = matter.stringify('\n', {
    title: result.title,
    date: dateStr,
    category,
  });
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Daily tip has been created at ${filepath}`);
});
