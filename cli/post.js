const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const fse  = require('fs-extra');
const matter = require('gray-matter');
const utils = require('./utils');

function getAllDrafts() {
  const drafts = utils.getAllDraftsFrontMatter();
  console.log(drafts.map(draft => draft.filename));
  return drafts
    .filter(draft => (typeof draft.data.title === 'string'))
    .sort((a, b) => a.data.date < b.data.date ? -1 : 1)
    .map(draft => ({
      title: draft.data.title,
      value: {
        from: path.resolve(utils.draftsDir, draft.filename),
        to: path.resolve(utils.postsDir, draft.filename),
      },
    }));
}

prompts([
  {
    type: 'select',
    name: 'draft',
    message: 'select draft that is ready to deliver',
    choices: getAllDrafts(),
  },
]).then(({ draft }) => {
  const content = fs.readFileSync(draft.from);
  const parsed = matter(content);
  const frontmatter = parsed.data;
  frontmatter.date = utils.getTodayStr();
  frontmatter.modified = utils.getTodayStr();
  if (!frontmatter.description) {
    console.error('[ERROR]Description is empty, please fill in before commit.');
    frontmatter.description = '';
  }
  fs.writeFileSync(draft.to, matter.stringify(parsed.content, frontmatter), 'utf8');
  fse.removeSync(draft.from);
  console.log(`Saved to ${draft.to}`);
});
