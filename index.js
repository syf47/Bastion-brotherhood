// {
//   "朱永博": {
//     "realname": "朱永博",
//     "avatar": "https://example.com/avatar.jpg"
//   },
// }

// 有一个 json 是以上这种格式，要求读取后，写入一个 md 文件，md 文档格式为：
// # Bastion Brotherhood
// ### 朱永博
// ![朱永博](https://example.com/avatar.jpg)

const fs = require('fs')
const path = require('path')
const jsonFilePath = path.join(__dirname, 'roster.json')
const mdFilePath = path.join(__dirname, 'README.md')
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
const mdContent = ['# Bastion Brotherhood']
Object.keys(jsonData).forEach((name) => {
  const member = jsonData[name]
  mdContent.push(`### <img src="${member.avatar}" alt="${member.realname}" width="36"/> ${member.realname} `)
})
fs.writeFileSync(mdFilePath, mdContent.join('\n'), 'utf8')
console.log(`Markdown file created at ${mdFilePath}`)
