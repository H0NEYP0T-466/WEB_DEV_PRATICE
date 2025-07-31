import React from 'react'
import { useForm } from "react-hook-form"
import './Form.css'

const Form = () => {

    function cliclhandeler(data)
    {
        console.log(data)
    }
    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()


  return (
    <div >
        
        <form id='for' onSubmit={handleSubmit(cliclhandeler)}>
         
                <label>Email</label>
                <input {...register('Email')}/>
                <br />
                <label>Password</label>
                <input {...register('Password')}/>
                <br />
                <input  type="submit" />

        </form>
    </div>
  )
}

export default Form