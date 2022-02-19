import Joi from 'joi'
import Prisma from '@prisma/client'
import Validade from '../library/validade.js'

const prisma = new Prisma.PrismaClient()

/*
 * Return all Users
 */
const findUsers = async (request, response) => {
  try {
    const users = await prisma.user.findMany()
    return response.json(users)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Add user name and email to the list of subscribed users
 */
const subscribe = async (request, response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  })
  const { error } = schema.validate(request.body)
  if (error) {
    return response.status(404).json(error)
  }
  try {
    const email = await Validade.checkUserByEmail(request.body.email)
    if (email)
      return response.json({
        error: 'E-mail already subscribed',
      })

    const user = await prisma.user.create({
      data: request.body,
    })

    return response.json(user)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Delete and unsubscribe user by userId
 */
const unsubscribe = async (request, response) => {
  try {
    const id = request.params.id

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!user)
      return response.json({
        error: 'User not found',
      })

    const name = user.name

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    })
    return response.end(`User ${name} unsubscribed`)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Delete and unsubscribe user my userEmail
 */
const unsubscribeByEmail = async (request, response) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  })
  const { error } = schema.validate(request.body)
  if (error) {
    return response.status(404).json(error)
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: request.body.email,
      },
    })

    if (!user)
      return response.json({
        error: 'Email not subscribed',
      })

    const name = user.name

    await prisma.user.delete({
      where: {
        id: Number(user.id),
      },
    })
    return response.end(`User ${name} unsubscribed`)
  } catch (error) {
    return response.json(error)
  }
}

export default { findUsers, subscribe, unsubscribe, unsubscribeByEmail }
