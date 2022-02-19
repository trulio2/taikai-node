import Prisma from '@prisma/client'

const prisma = new Prisma.PrismaClient()

const sendEmail = async (job) => {
  try {
    const users = await prisma.user.findMany()
    users.forEach((user) => {
      // SEND EMAIL
      console.log(user)
    })
    console.log(job)
  } catch (error) {
    console.log(error)
    return
  }
}

export default { sendEmail }
