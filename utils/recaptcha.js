import { response } from 'express'

export default function verifycaptcha(token){

    var express = require('express')
    var cors = require('cors')
    var app = express()
    var axios = require('axios')
    app.use(cors({credentials:true,origin:true}))

    app.post('/verify',(req,res)=>{
        var secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
        var userKey = req.body.token
        axios.post('https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + userKey).then(response=>{
            console.log('got response',response.data)

            if(response.data.success){
                return true
            }

            return false 
        })
    })
   
}


