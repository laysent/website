const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

const postsDir = path.resolve(__dirname, '..', 'content/blog');
const draftsDir = path.resolve(__dirname, '..', 'content/draft');
const tilDir = path.resolve(__dirname, '..', 'content/til');
const suffix = '.md';

function getAllFrontMatterFromDir(dir) {
  return glob.sync('**/*.md', { cwd: dir })
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
const getAllTILFrontMatter = getAllFrontMatterFromDir.bind(null, tilDir);

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
  getAllTILFrontMatter,
  postsDir,
  draftsDir,
  suffix,
  getTodayStr,
};
