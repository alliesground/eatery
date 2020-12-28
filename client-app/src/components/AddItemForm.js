import { useState, useCallback } from 'react';
import useFormValidation from '../hooks/useFormValidation';

const AddItemForm = () => {

  const API_URL = "http://localhost:3000"

  const initialState = {
    name: "",
    description: "",
    price: ""
  }

  const [items, setItems] = useState([])

  const [item, setItem] = useState(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState(null)

  const resetForm = () => {
    setItem({
      name: '',
      description: '',
      price: ''
    })
  }

  const onDrop = useCallback(acceptedFiles => {

    setSelectedFiles(acceptedFiles);

  }, [])

  const handleItemChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    console.log(e.target.files[0].name);
    setSelectedFiles(e.target.files[0]);
  }

  const handleImageUpload = (e) => {
    // Send file to AWS s3

    if(selectedFiles) {
      selectedFiles.forEach(file => {
        console.log('uploaded file: ', file)
      })
    }
  }

  const submitForm = () => {

    // adding items locally, not persisted in database
    setItems(items.concat(item))

    resetForm()

    alert("Successfully added new item")
  }

  const {
    handlePresenceValidation,
    errors
  } = useFormValidation(submitForm, isSubmitted)

  const handleSubmit = (e) => {
    // setIsSubmitted(true)
    // handlePresenceValidation({...item});

    const data = new FormData()
    data.append("file", selectedFiles)
    postItem(data);

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

      <form>
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
          name="item-image" 
          onChange={handleImageChange}
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
