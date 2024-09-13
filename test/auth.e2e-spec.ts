import { type INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { AppModule } from '~/app.module'
import { PrismaService } from '~/prisma/prisma.service'

import { setupSession } from './utils/setupSession'

describe('AuthController (e2e)', () => {
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

  it('/auth/signup (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('email', 'test@test.com')
  })

  it('/auth/signup (POST) - Email already exists', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201)

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(403)
  })

  it('/auth/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201)

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('email', 'test@test.com')
  })

  it('/auth/login (POST) - Invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201)

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'wrongpassword' })
      .expect(403)
  })
})
