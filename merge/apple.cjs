const fs = require('fs');
const https = require('https');

const urls = [
  'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Loon/Apple/Apple.list',
  'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Loon/Apple/Apple_Domain.list'
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const contents = await Promise.all(urls.map(fetch));
  const lines = contents
    .flatMap(c => c.split('\n'))
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .sort();
  
  fs.mkdirSync('rules', { recursive: true });
  fs.writeFileSync('rules/apple.list', lines.join('\n') + '\n');
})();
