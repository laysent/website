const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.resolve(__dirname, '..', 'content/blog');
const draftsDir = path.resolve(__dirname, '..', 'content/draft');
const suffix = '.md';

function getAllFrontMatterFromDir(dir) {
  return fs.readdirSync(dir)
    .filter(filename => filename.endsWith(suffix))
    .map((filename) => {
      const filepath = path.resolve(dir, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      const parsed = matter(content);
      parsed.filename = filename;
      return parsed;
    });
}

const getAllPostsFrontMatter = getAllFrontMatterFromDir.bind(null, postsDir);
const getAllDraftsFrontMatter = getAllFrontMatterFromDir.bind(null, draftsDir);

function getTodayStr() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const date = today.getDate().toString().padStart(2, '0');
  const dateStr = `${year}-${month}-${date}`;
  return dateStr;
}

module.exports = {
  getAllPostsFrontMatter,
  getAllDraftsFrontMatter,
  postsDir,
  draftsDir,
  suffix,
  getTodayStr,
};
