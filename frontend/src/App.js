import './App.css';
import { useState } from 'react';

const App = () => {

  const [title,setTitle] = useState('')
  const [images,setImages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(title,images)
  }

  const handleUpload = (e) => {
    console.log(e.target.files)
  }

  return (
    <div className="App">

      <header>
        <h1> Upload Image :) </h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input name="title" type="text" id="title" placeholder="Enter title.." />
        <br/>
        <input name="images" onChange={handleUpload} type="file" />
        <br />
        <input type="submit" value="Upload Image" />
      </form>
    </div>
  );
}

export default App;
