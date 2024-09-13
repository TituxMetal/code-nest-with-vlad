import 'tsconfig-paths/register'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/testdb'
