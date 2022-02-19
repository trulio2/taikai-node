import Joi from 'joi'
import Prisma from '@prisma/client'
import Validade from '../library/validade.js'

const prisma = new Prisma.PrismaClient()

/*
 * Return all Companies
 */
const findCompany = async (request, response) => {
  try {
    const company = await prisma.company.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        jobs: true,
      },
    })
    return response.json(company)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Create a Copmany, check if title is avaliable
 */
const createCompany = async (request, response) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  })
  const { error } = schema.validate(request.body)
  if (error) {
    return response.status(404).json(error)
  }
  try {
    const title = await Validade.checkCompanyByTitle(request.body.title)
    if (title)
      return response.json({
        error: 'Company title not avaliable',
      })

    const company = await prisma.company.create({
      data: request.body,
    })

    return response.json(company)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Update a Copmany, check if title is avaliable
 */
const updateCompany = async (request, response) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
  })
  const { error } = schema.validate(request.body)
  if (error) {
    return response.status(404).json(error)
  }
  try {
    const { id } = request.params

    const company = await prisma.company.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!company)
      return response.json({
        error: 'Company not found',
      })

    if (request.body.title) {
      const title = await Validade.checkCompanyByTitle(request.body.title)
      if (title)
        return response.json({
          error: 'Company title not avaliable',
        })
    }

    const update = await prisma.company.update({
      where: {
        id: Number(id),
      },
      data: request.body,
    })

    return response.json(update)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Delete Company by id
 */
const deleteCompany = async (request, response) => {
  try {
    const { id } = request.params

    const company = await prisma.company.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!company) {
      return response.json({
        error: 'Company not found',
      })
    }

    const title = company.title

    await prisma.company.delete({
      where: {
        id: Number(id),
      },
    })
    return response.end(`Company ${title} deleted`)
  } catch (error) {
    return response.json(error)
  }
}

export default { findCompany, createCompany, updateCompany, deleteCompany }
