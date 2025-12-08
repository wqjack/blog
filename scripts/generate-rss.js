import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/posts');
const PUBLIC_DIR = path.join(__dirname, '../public');
const SITE_URL = 'https://wqjack.github.io/blog';
const SITE_TITLE = 'Jey.Dev Blog';
const SITE_DESC = 'Frontend, Vue, React, and Tech Thoughts';

// Ensure public dir exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 1. Read & Parse Posts
const posts = [];
const files = fs.readdirSync(POSTS_DIR);

files.forEach(file => {
    if (!file.endsWith('.md')) return;

    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
    const match = content.match(frontmatterRegex);

    if (match) {
        const metadata = {};
        const frontmatterBlock = match[1];

        frontmatterBlock.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                metadata[key] = value;
            }
        });

        // Slug is filename without .md
        const slug = file.replace(/\.md$/, '');

        posts.push({
            title: metadata.title || slug,
            description: metadata.description || '',
            date: new Date(metadata.date || '1970-01-01'),
            link: `${SITE_URL}/#/articles/${slug}`, // Hash router link
            guid: `${SITE_URL}/#/articles/${slug}`
        });
    }
});

// 2. Sort by date desc
posts.sort((a, b) => b.date - a.date);

// 3. Generate XML
const xmlItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.link}</link>
      <guid>${post.guid}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${post.date.toUTCString()}</pubDate>
    </item>`).join('');

const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${xmlItems}
  </channel>
</rss>`;

// 4. Write File
const destPath = path.join(PUBLIC_DIR, 'rss.xml');
fs.writeFileSync(destPath, rssContent);

console.log(`✅ RSS Feed generated at ${destPath}`);
console.log(`   Contains ${posts.length} posts.`);
