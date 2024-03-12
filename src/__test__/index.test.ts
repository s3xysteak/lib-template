import { parse } from 'node:path'

const removeExtension = (filePath: string) => parse(filePath).name

it('should remove extension', () => {
  expect(removeExtension('index.ts')).toBe('index')
  expect(removeExtension('index')).toBe('index')
})
