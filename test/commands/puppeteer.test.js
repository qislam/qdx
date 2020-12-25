const {expect, test} = require('@oclif/test')

describe('puppeteer', () => {
  test
  .stdout()
  .command(['puppeteer'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['puppeteer', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
