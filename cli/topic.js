const prompts = require('prompts');
const matter = require('gray-matter');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const utils = require('./utils');

const topic = path.resolve(__dirname, '..', 'content/topic');
const suffix = '.md';

prompts([
  {
    type: 'text',
    name: 'title',
    message: 'specify the title of this TIL',
  },
]).then((result) => {
  const dateStr = utils.getTodayStr();
  let filename = result.title.replace(/\s/g, '-') + '_' + dateStr + suffix;
  let filepath = path.resolve(topic, filename);
  let index = 2;
  while (fs.existsSync(filepath)) {
    filename = dateStr + '-' + index.toString().padStart(2, '0') + suffix;
    filepath = path.resolve(til, folderName, filename);
    index += 1;
  }

  const content = matter.stringify('\n', {
    title: result.title,
    date: dateStr,
  });
  fse.ensureFileSync(filepath);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Topic has been created at ${filepath}`);
});
