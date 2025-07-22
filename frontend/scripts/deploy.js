import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

console.log('当前目录：', process.cwd())

const command =
  'rsync -avz --delete ./dist/ root@49.233.41.155:/opt/bastion-brotherhood'

console.log('🚀 开始部署...')

try {
  const { stdout, stderr } = await execAsync(command)
  if (stderr) {
    console.warn('⚠️ stderr:', stderr)
  }
  console.log('✅ 部署成功:\n' + stdout)
} catch (error) {
  console.error('❌ 部署失败:\n', error.message)
  process.exit(1)
}
