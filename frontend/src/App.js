import './App.css';
import { useState } from 'react';

const App = () => {

  const [title,setTitle] = useState('')
  const [images,setImages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()

    let formData = new FormData()
    formData.append('post[title]',title)

    for(let index in images){
      if(typeof images[index] === 'object'){
          formData.append('post[images][]',images[index])
      }
    }

    fetch('http://localhost:3000/posts',{
      method: 'POST',
      body: formData
    }).then(res => res.json())
    .then(console.log)
  }

  const handleChange = (e) => {
    if(e.target.name === "title"){
      setTitle(e.target.value)
    }else{
      setImages(e.target.files)
    }
  }

  return (
    <div className="App">

      <header>
        <h1> Upload Image :) </h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input name="title" onChange={handleChange} type="text" placeholder="Enter title.." />
        <br/>
        <input name="images" onChange={handleChange} type="file" multiple />
        <br />
        <input type="submit" value="Upload Image" />
      </form>
    </div>
  );
}

export default App;
