const path = require('path');
const fs = require('fs');
const prompts = require('prompts');
const utils = require('./utils');
const matter = require('gray-matter');

const drafts = path.resolve(__dirname, '..', 'content/draft');
const suffix = '.md';

function getAllFrontMatter() {
  return utils.getAllPostsFrontMatter()
    .concat(utils.getAllDraftsFrontMatter())
    .map(parsed => parsed.data);
}

function getExistingTags() {
  const tags = getAllFrontMatter()
    .map(frontmatter => frontmatter.tags)
    .filter(_ => _)
    .map(tags => tags.split(','))
    .reduce((list, curr) => list.concat(curr), [])
    .map(tag => tag.trim())
    .reduce((set, tag) => set.add(tag), new Set());
  return Array.from(tags.keys()).map(tag => ({ title: tag, value: tag }));
}

function getExistingCategories() {
  const categories = getAllFrontMatter()
    .map(frontmatter => frontmatter.category)
    .filter(_ => _)
    .map(category => category.trim())
    .reduce((set, category) => set.add(category), new Set());
  return Array.from(categories.keys()).map(category => ({ title: category, value: category }));
}

prompts([
  {
    type: 'text',
    name: 'title',
    message: 'specify the title of this draft',
  },
  {
    type: 'text',
    name: 'filename',
    message: 'specify the filename of this draft',
    format: value => value.endsWith(suffix) ? value : value + suffix,
    validate(value) {
      if (!value) return 'field is required!';
      const filepath = path.resolve(drafts, value);
      if (fs.existsSync(filepath)) return 'file already exists!';
      return true;
    },
  },
  {
    type: 'multiselect',
    name: 'tags',
    message: 'choose the tags used for this draft (multi-select)',
    choices: [{ title: '[New]', value: '', selected: true }].concat(getExistingTags()),
  },
  {
    type: (prev) => prev.indexOf('') >= 0 ? 'text' : null,
    name: 'extraTags',
    message: 'add new tags for this draft, use , to separate each',
  },
  {
    type: 'select',
    name: 'category',
    message: 'choose the category for this draft',
    choices: [{ title: '[New/None]', value: '' }].concat(getExistingCategories()),
  },
  {
    type: (prev) => prev === '' ? 'text' : null,
    name: 'newCategory',
    message: 'use new tag for this draft',
  },
]).then((result) => {
  let tags = result.tags.filter(_ => _);
  if (result.extraTags) {
    tags = [...new Set(tags.concat(result.extraTags.split(',').map(tag => tag.trim())))];
  }
  let category = result.newCategory || result.category || '';
  const filepath = path.resolve(drafts, result.filename);
  const dateStr = utils.getTodayStr();

  const content = matter.stringify('\n', {
    title: result.title || '',
    date: dateStr,
    modified: dateStr,
    tags: tags.join(', '),
    category,
    description: '',
  });
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Draft has been saved to ${result.filename}`);
});
