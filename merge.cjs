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
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const contents = await Promise.all(urls.map(fetch));
    const lines = contents
      .map(content => content.split('\n'))
      .flat()
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .filter((line, index, arr) => arr.indexOf(line) === index) // 去重
      .sort();

    fs.mkdirSync('./rules', { recursive: true });
    fs.writeFileSync('./rules/apple.list', lines.join('\n') + '\n');
    console.log('✅ 合并完成，共', lines.length, '条规则');
  } catch (err) {
    console.error('❌ 合并失败:', err);
    process.exit(1);
  }
})();
