const express = require('express');
const router = express.Router();
const axios=require('axios');
const http=require('http');
const URL=require('./ml-server');

const validation=(age, fare, standard, gender, boarding ,sibSp, parch)=>{
    //age fare standard gender sibsp parch
    console.log(typeof age,typeof fare,typeof standard,typeof gender,typeof sibSp,typeof parch);
    if(typeof age !=='number') return false;
    if(typeof fare !=='number') return false;
    if(typeof standard !=='number') return false;
    if(typeof gender !=='string') return false;
    if(typeof boarding !=='string') return false;
    if(typeof sibSp !=='number') return false;
    if(typeof parch !=='number') return false;
    
    if(standard<1 || standard>3){
        console.log('Select Class')
        return false;
    };
    if(!(['M','F'].includes(gender))){
        console.log('Select Gender')
        return false;
    };
    
    if(!(['S','C','Q'].includes(boarding))){
        return false;
    };
    if(age<1 || age>100){
        console.log('Invalid Age')
        return false;
    }
    if(fare<1 || fare>900){
        console.log('Invalid Fare')
        return false;
    };
    if(sibSp<0 || sibSp>10){
        console.log('Invalid sibiling spouse')
        return false;
    };
    if(parch<1 || parch>10){
        console.log('Invalid parent child')
        return false;
    };

    return true;
}

const predictionToMessage=(prediction)=>{
    scent=Math.floor(Math.random() * 6);
    if(prediction===0){
        switch (scent) {
            case 1:
                return 'You did not survive.'
            case 2:
                return 'You died.'
            case 3:
                return 'You did not return from the trip.'
            case 4:
                return 'That was your last trip.'
            default:
                return 'You perished in the sea.'
        }
    }else if(prediction===1){
        switch (scent) {
            case 1:
                return 'You survived.'
            case 2:
                return 'You made it through.'
            case 3:
                return 'You returned from the trip.'
            case 4:
                return 'You made it through the disaster.'
            default:
                return 'You reached the shore safely.'
        }
    }
}

module.exports = () => {
    router.post('/predict',async (request,response)=>{
        console.log(request.body);
        age=request.body.age
        fare=request.body.fare
        standard=request.body.class
        gender=request.body.gender
        boarding=request.body.embarked
        sibSp=request.body.sibSp
        parch=request.body.parch
        
        if(validation(age,fare, standard, gender, boarding ,sibSp, parch)==false){
            response.json({'response':false});
            return;
        }

        axios.post(`${URL}`,request.body).then(e=>{
            console.log(e.data);
            if(e.data.response==true){
                message=predictionToMessage(e.data.prediction);
                response.json({'response':true,'prediction':e.data.prediction,'message':message});
            }else{
                response.json({'response':false});
            }
        }).catch(err=>{
            response.json({'response':false});
        })
    });

    return router;
}