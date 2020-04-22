const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')

const mongoose = require("mongoose")

const User = require('../models/user');

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  databases: [mongoose],
  resources:[
    User
  ],
  rootPath: '/admin',
})

const ADMIN = {
  email: process.env.ADMINEMAIL,
  password: process.env.ADMINPASSWORD,
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: 'adminbro',
    cookiePassword: 'somepassword',
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
      return null
    }
});

module.exports=router;