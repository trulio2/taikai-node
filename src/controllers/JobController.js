import Joi from 'joi'
import Prisma from '@prisma/client'
import EmailHandler from '../library/emailHandler.js'
import Validade from '../library/validade.js'
import Query from '../library/query.js'

const prisma = new Prisma.PrismaClient()

/*
 * Return all Jobs
 */
const findJobs = async (request, response) => {
  try {
    const jobs = await prisma.job.findMany({
      select: Query.job,
    })
    return response.json(jobs)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Key and text search as param and return every match with the text in the key field
 * If key is an company will return every job from the matched companies
 */
const findJobByKey = async (request, response) => {
  const schema = Joi.object({
    key: Joi.string().required(),
    search: Joi.any().required(),
  })
  const { error } = schema.validate(request.params)
  if (error) {
    return response.status(404).json(error)
  }
  try {
    let jobs
    switch (request.params.key) {
      case 'title':
        jobs = await prisma.job.findMany({
          select: Query.job,
          where: {
            title: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        })
        return response.json(jobs)
      case 'description':
        jobs = await prisma.job.findMany({
          select: Query.job,
          where: {
            description: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        })
        return response.json(jobs)
      case 'skills':
        jobs = await prisma.job.findMany({
          select: Query.job,
          where: {
            skills: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        })
        return response.json(jobs)
      case 'market':
        jobs = await prisma.job.findMany({
          select: Query.job,
          where: {
            market: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        })
        return response.json(jobs)
      case 'type':
        jobs = await prisma.job.findMany({
          select: Query.job,
          where: {
            type: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        })
        return response.json(jobs)
      case 'location':
        jobs = await prisma.job.findMany({
          select: Query.job,
          where: {
            location: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        })
        return response.json(jobs)
      case 'company':
        jobs = await prisma.company.findMany({
          select: Query.company,
          where: {
            title: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        })
        return response.json(jobs)
      default:
        return response.end()
    }
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Search the input string in every Job field and return every match
 * Search for companies namies with the inputed string and return every job from those
 * companies
 */
const findJobAny = async (request, response) => {
  try {
    let jobs = await prisma.job.findMany({
      select: Query.job,
      where: {
        OR: [
          {
            title: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
          {
            skills: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
          {
            market: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
          {
            type: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
          {
            location: {
              contains: request.params.search,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    let company = await prisma.company.findMany({
      where: {
        title: {
          contains: request.params.search,
          mode: 'insensitive',
        },
      },
    })
    company = company.map((a) => a.id)
    const result = await prisma.job.findMany({
      select: Query.job,
      where: {
        companyId: { in: company },
      },
    })
    for (let i = 0; i < result.length; i++) {
      if (!jobs.some((e) => e.id === result[i].id)) {
        jobs.push(result[i])
      }
    }
    return response.json(jobs)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Create a job, check if company id exists and call the sendEmail function
 */
const createJob = async (request, response) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    skills: Joi.string().required(),
    market: Joi.string().required(),
    type: Joi.string().required(),
    location: Joi.string().required(),
    companyId: Joi.number().required(),
  })
  const { error } = schema.validate(request.body)
  if (error) {
    return response.status(404).json(error)
  }
  try {
    const company = await Validade.checkCompanyById(request.body.companyId)
    if (!company)
      return response.json({
        error: 'Company not found',
      })

    const job = await prisma.job.create({
      data: request.body,
    })
    EmailHandler.sendEmail(job)
    return response.json(job)
  } catch (error) {
    return response.json(error)
  }
}

/*
 * Update a Job
 */
const updateJob = async (request, response) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    skills: Joi.string(),
    market: Joi.string(),
    type: Joi.string(),
    location: Joi.string(),
  })
  const { error } = schema.validate(request.body)
  if (error) {
    return response.status(404).json(error)
  }
  try {
    const { id } = request.params

    const job = await prisma.job.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!job)
      return response.json({
        error: 'Job not found',
      })

    const update = await prisma.job.update({
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
 * Delete a Job
 */
const deleteJob = async (request, response) => {
  try {
    const { id } = request.params

    const job = await prisma.job.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!job) {
      return response.json({
        error: 'Job not found',
      })
    }

    const title = job.title

    await prisma.job.delete({
      where: {
        id: Number(id),
      },
    })
    return response.end(`Job ${title} deleted`)
  } catch (error) {
    return response.json(error)
  }
}

export default {
  findJobs,
  findJobByKey,
  findJobAny,
  createJob,
  updateJob,
  deleteJob,
}
