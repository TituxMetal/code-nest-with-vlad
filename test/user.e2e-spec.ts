import { type INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

import { setupSession } from './utils/setupSession'

describe('UserController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = app.get(PrismaService)

    await setupSession(app)

    await prisma.$connect()
    await app.init()
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('/users/me (GET)', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201)

    const cookie = signupResponse.headers['set-cookie']

    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Cookie', cookie)
      .expect(200)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('email', 'test@test.com')
    expect(response.body).not.toHaveProperty('password')
  })

  it('/users/me (GET) - Unauthorized', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401)
  })
})
