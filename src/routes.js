import express from 'express'
import JobController from './controllers/JobController.js'
import CompanyController from './controllers/CompanyController.js'
import UserController from './controllers/UserController.js'

const router = express.Router()

router.get('/job', JobController.findJobs)
router.get('/job/:key/:search', JobController.findJobByKey)
router.get('/job/:search', JobController.findJobAny)
router.post('/job', JobController.createJob)
router.put('/job/:id', JobController.updateJob)
router.delete('/job/:id', JobController.deleteJob)

router.get('/company', CompanyController.findCompany)
router.post('/company', CompanyController.createCompany)
router.put('/company/:id', CompanyController.updateCompany)
router.delete('/company/:id', CompanyController.deleteCompany)

router.get('/user', UserController.findUsers)
router.post('/user', UserController.subscribe)
router.delete('/user/unsubscribe', UserController.unsubscribeByEmail)
router.delete('/user/unsubscribe/:id', UserController.unsubscribe)

export default router
