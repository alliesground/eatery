import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import S3 from 'aws-sdk/clients/s3';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';

const AddItemForm = () => {

  const API_URL = "http://localhost:3000"

  const initialState = {
    imageUrls: []
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

  const [imageUrls, setImageUrls] = useState([])

  const [isSubmitted, setIsSubmitted] = useState(false)

  const [fileLoaded, setFileLoaded] = useState(0)

  const [selectedFiles, setSelectedFiles] = useState([])

  const [filesLoaded, setFilesLoaded] = useState([])

  const { register, handleSubmit, errors } = useForm();

  const form = useRef(null)

  const fileField = useRef()

  const resetForm = (e) => {

    e.target.reset();

    // reset selected files UI
    setSelectedFiles([])
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

            setImageUrls(prev => (prev.concat(data.Location)))
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

  const submitForm = (data, e) => {

    data.imageUrls = imageUrls
    postItem(data);

    resetForm(e)

    // alert("Successfully added new item")
  }

  async function postItem(data) {

    try {
      let res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      alert(await res.text())
      
    } catch(error) {
      alert("Something went wrong. Please contact your Admin");
    }
  }

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

      <h1>Add Item Form</h1>

      <form ref={form} onSubmit={handleSubmit(submitForm)}>
        <input
          type="text" 
          name="name"
          placeholder="Enter name"
          ref={register({ required: true })}
        />
        {errors.name && <span>This field is required</span>}

        <br></br>
        <br></br>

        <textarea
          name="description"
          placeholder="Enter description"
          ref={register({ required: true })}
        />
        {errors.description && <span>This field is required</span>}

        <br></br>
        <br></br>

        <input
          type="text" 
          name="price"
          placeholder="Enter price"
          ref={register({ required: true })}
        />
        {errors.price && <span>This field is required</span>}

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
          variant="secondary"
          onClick={triggerFileField}
        >
          <i className="bi-file-image"></i>{" "}
          Upload Image
        </Button>


        <br></br>
        <br></br>


        <br></br>
        <br></br>

        <Button variant="primary" type="submit">Submit</Button>{' '}

        <br></br>
        <br></br>

      </form>
    </div>
  )
}

export default AddItemForm;
