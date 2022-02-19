import express from 'express'
import router from './src/routes.js'
import 'dotenv/config'
const app = express()

app.use(express.json())
app.use(router)

app.get('*', (request, response) => {
  response.end(`
  <html>
    <body> 
        <h3>Job</h3>
        <li>GEt    /job => Return every Job</li>
        <li>GET    /job/key/text => Return every Job that has a text match in the key field</li>
        <li>GET    /job/text => Return every Job that has a text match in any field</li>
        <li>POST   /job => Create an Job (Params: title, description, skils, market, type, location, companyId)</li>
        <li>PUT    /job/id => Update the Job with this id</li>
        <li>DELETE /job/id => Delete the Job with this id</li>
        <br/>
        <h3>Company</h3>
        <li>GET    /company => Return every Company</li>
        <li>POST   /company => Create an Company (Params: title, description)</li>
        <li>PUT    /company/id => Update the Company with this id</li>
        <li>DELETE /company/id => Delete the Job with this id</li>
        <br/>
        <h3>User</h3>
        <li>GET    /user => Return every User</li>
        <li>POST   /user => Create an User (Params: name, email)</li>
        <li>DELETE /user => Delete User by user email</li>
        <li>DELETE /user/id => Delete User by user id</li>
    </body>
  </html>`)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server listening on port ', port)
})
