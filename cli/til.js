const prompts = require('prompts');
const matter = require('gray-matter');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const utils = require('./utils');

const til = path.resolve(__dirname, '..', 'content/til');
const suffix = '.md';

function getExistingCategories() {
  const categories = utils.getAllTILFrontMatter()
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
    message: 'specify the title of this TIL',
  },
  {
    type: 'select',
    name: 'category',
    message: 'choose the category for this TIL',
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
  let dateStr = utils.getTodayStr();
  if (typeof process.argv[2] === 'string' && process.argv[2].split('-').length === 3) {
    dateStr = process.argv[2];
  }
  const folderName = dateStr.split('-').slice(0, 2).join('-');
  let filename = dateStr + suffix;
  let filepath = path.resolve(til, folderName, filename);
  let index = 2;
  while (fs.existsSync(filepath)) {
    filename = dateStr + '-' + index.toString().padStart(2, '0') + suffix;
    filepath = path.resolve(til, folderName, filename);
    index += 1;
  }

  const content = matter.stringify('\n', {
    title: result.title,
    date: dateStr,
    category,
  });
  fse.ensureFileSync(filepath);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`TIL has been created at ${filepath}`);
});
