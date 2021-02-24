import { useState, useRef, useEffect } from 'react';
import useFormValidation from '../hooks/useFormValidation';
import axios from 'axios';
import S3 from 'aws-sdk/clients/s3';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button'

const AddItemForm = () => {

  const API_URL = "http://localhost:3000"

  const initialState = {
    name: "",
    description: "",
    price: ""
  }

  const s3 = new S3({
    apiVersion: '2006-03-01',
    region: 'ap-southeast-2',
    credentials: {
      accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY
    }
  })

  const uploadParams = {
    Bucket: 'restro-development',
    ACL: 'public-read'
  }

  const [items, setItems] = useState([])

  const [item, setItem] = useState(initialState)

  const [isSubmitted, setIsSubmitted] = useState(false)

  const [fileLoaded, setFileLoaded] = useState(0)

  const [selectedFiles, setSelectedFiles] = useState([])

  const [filesLoaded, setFilesLoaded] = useState([])

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

  useEffect(() => {

    for(let i=0; i<selectedFiles.length; i++) {

      // upload file only if loaded is 0, i.e not uploaded yet.
      if(filesLoaded[i] === 0) {

        for(let j=0; j<101; j++) {
          setFilesLoaded(prev => Object.assign([...prev], {[i]: j}))
        }

        // upload to s3
        uploadParams.Body = selectedFiles[i]
        uploadParams.Key = `items/id_1/${selectedFiles[i].name}`

        s3.upload(uploadParams, function(err, data) {
          if(err) {
            console.log("Error", err)
          }
          if(data) {
            console.log("Upload Success", data)
          }
        }).
          on('httpUploadProgress', function(progress) {

            let loaded = Math.round(progress.loaded / progress.total * 100)

            setFilesLoaded(prev => Object.assign([...prev], {[i]: loaded}))
          })
      }
    }
  }, [selectedFiles]);

  useEffect(() => {

  }, [filesLoaded])

  const handleFileChange = (e) => {
    if(isValidFile(e)){

      let files = [];

      for(let i=0; i<e.target.files.length; i++) {

        files.push(e.target.files[i])

        setFilesLoaded(previousVal => [...previousVal].concat(0))
      }

      setSelectedFiles(selectedFiles.concat(files))

      // reset file field
      fileField.current.value = null
    }
  }

  const isValidFile = (e) => {
    return checkFileMimeType(e)
  }

  const checkFileMimeType = (e) => {

    const files = e.target.files
    const types = ['image/png', 'image/jpeg', 'image/gif']

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

    setItems(items.concat(item))

    postItem();

    resetForm()

    // alert("Successfully added new item")
  }

  const {
    handlePresenceValidation,
    errors
  } = useFormValidation(submitForm, isSubmitted)

  const handleSubmit = (e) => {
    setIsSubmitted(true)
    handlePresenceValidation({...item});
  }

  async function postItem() {

    try {
      let res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        body: JSON.stringify(item)
      });

      if(res.status === 500) {
        alert("INTERNAL SERVER ERROR. Please contact your developer");
      }
      
    } catch(error) {
      alert("Something went wrong. Please contact your Admin");
    }
  }

  const errorList = Object.entries(errors)

  const renderSelectedFiles = selectedFiles.map((file, idx) => (
    <div 
      style={{ padding: 10, border: '1px solid #ccc' }}
      key={idx}
    >
      {file.name}
      <ProgressBar now={filesLoaded[idx]} label={`${filesLoaded[idx]}%`} />
    </div>
  ))

  const triggerFileField = (e) => {
    fileField.current.click();
  }

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

        <div>
          { renderSelectedFiles }
        </div>

        <br></br>

        <input 
          type="file" 
          name="file" 
          multiple
          onChange={handleFileChange}
          ref={fileField}
          style={{display: "none"}}
        />

        <Button
          variant="primary"
          onClick={triggerFileField}
        >
          <i className="bi-file-image"></i>{" "}
          Upload Image
        </Button>


        <br></br>
        <br></br>


        <br></br>
        <br></br>

        <Button variant="secondary">Primary</Button>{' '}

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
