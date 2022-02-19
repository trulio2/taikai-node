import Prisma from '@prisma/client'

const prisma = new Prisma.PrismaClient()

/*
 * Check if a company with the id param exist and return it if positive
 */
const checkCompanyById = async (id) => {
  return await prisma.company.findUnique({
    where: {
      id: Number(id),
    },
  })
}

/*
 * Check if User with given email exists and return it
 */
const checkCompanyByTitle = async (title) => {
  return await prisma.company.findUnique({
    where: {
      title: title,
    },
  })
}

/*
 * Check if User with given email exists and return it
 */
const checkUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
}

export default { checkCompanyById, checkCompanyByTitle, checkUserByEmail }
