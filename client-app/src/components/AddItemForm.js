import { useState, useRef, useEffect } from 'react';
import useFormValidation from '../hooks/useFormValidation';

const AddItemForm = () => {

  const API_URL = "http://localhost:3000"

  const initialState = {
    name: "",
    description: "",
    price: "",
    file: null
  }

  const [items, setItems] = useState([])

  const [item, setItem] = useState(initialState)

  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useRef(null)

  const fileField = useRef(null)

  const resetForm = () => {
    setItem({
      name: '',
      description: '',
      price: ''
    })

    fileField.current.value = null
  }

  const handleItemChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    if(isValidFile(e)){
      setItem({
        ...item,
        file: e.target.files
      })
    }
  }

  const isValidFile = (e) => {
    return checkFileMimeType(e)
  }

  const checkFileMimeType = (e) => {

    const files = e.target.files
    const types = ['image/png', 'image/jpeg', 'image.gif']

    let errMsg = ""

    for(const file of files) {
      if(types.every(type => file.type !== type)) {

        errMsg += file.type + ' is not supported format.\n Only png, jpeg and gif files are supported.'
      }
    }

    if(errMsg !== "") {
      e.target.value = null

      alert(errMsg)
      return false
    }

    return true
  }

  const submitForm = () => {

    // adding items locally, not persisted in database
    setItems(items.concat(item))

    const data = new FormData(form.current)

    postItem(data);

    resetForm()

    alert("Successfully added new item")
  }

  const {
    handlePresenceValidation,
    errors
  } = useFormValidation(submitForm, isSubmitted)

  const handleSubmit = (e) => {
    setIsSubmitted(true)
    handlePresenceValidation({...item});
  }

  async function postItem(data) {
    try {
      let res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log(res.statusText)

    } catch (error) {
      throw new Error(error);
    }
  }

  const errorList = Object.entries(errors)

  return(
    <div>
      <ul>
        {
          errorList.map((err, idx) => (
            <li key={idx}>
              {err[0]}: {err[1]}
            </li>
          ))
        }
      </ul>

      <ul>
        {
          items.map((item, idx) => (
            <li key={idx}>{item.name}</li>
          ))
        }
      </ul>

      <h1>Add Item Form</h1>

      <form ref={form}>
        <input
          type="text" 
          name="name"
          placeholder="Enter name"
          onChange={handleItemChange}
          value={item.name}
        >
        </input>

        <br></br>
        <br></br>

        <textarea
          name="description"
          placeholder="Enter description"
          onChange={handleItemChange}
          value={item.description}
        >
        </textarea>

        <br></br>
        <br></br>

        <input
          type="text" 
          name="price"
          placeholder="Enter price"
          onChange={handleItemChange}
          value={item.price}
        >
        </input>

        <br></br>
        <br></br>

        <input 
          type="file" 
          name="file" 
          multiple
          onChange={handleFileChange}
          ref={fileField}
        />

        <br></br>
        <br></br>

        <button
          type="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default AddItemForm;
