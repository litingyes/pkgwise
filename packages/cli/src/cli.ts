import { Command } from 'commander'
import { connect } from './connect.js'

const program = new Command()

program
  .name('pkgwise')
  .description('pkgwise CLI for local npm authorization')
  .version('0.1.0')

program
  .command('connect')
  .description('Authorize pkgwise with your npm account')
  .option('-r, --registry <url>', 'npm registry URL', 'https://registry.npmjs.org')
  .option('-w, --web <url>', 'pkgwise web URL', 'https://pkgwise.vercel.app')
  .action(connect)

program.parse()
