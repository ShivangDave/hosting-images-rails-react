# How to host images Rails + React
- Let's learn how to upload images and associate 'em to an instance while using `React` as your frontend and `Rails API` as backend.


- I'll divide the guide into two parts:
  - Front End Instructions
  - Backend Instructions


- **Prerequisites**:
  - Knowledge of how React controlled forms work
  - Knowledge of Rails routing
  - Knowledge of ActiveRecord Associations
  - Optional:
    - [ActiveStorage]
    - [ActiveModel Serializers]
    - [ActiveModel Validators]

## Front End

- Step 1:
  - Let's start by scaffolding a new `React` application using `npx create-react-app <app-name>` command.


- Step 2:
  - Let's add a form to `App.js`
```html
  <div className="App">
      <header>
        <h1> Upload Image :) </h1>
      </header>

      <form>
        <input name="title" type="text" id="title" placeholder="Enter title.." />
        <br/>
        <input name="images" type="file" multiple />
        <br />
        <input type="submit" value="Upload Image" />
      </form>
  </div>
```

- Step 3:
  - Once the form has been added, let's make it a controlled form.
  - For this example, I'll be using React Hooks.
  ```js
    import { useState } from 'react';

    const [title, setTitle] = useState('');
    const [images, setImages] = useState(null);
  ```
  - Once the state has been initialized, we can go forward with the callback function.
  ```js
  const handleChange = (e) => {
      if(e.target.name === "title"){
        setTitle(e.target.value)
      }else{
        setImages(e.target.files)
      }
    }
  ```
  - Now all that's left is to connect it to the form.
  ```html
      <input name="title" onChange={handleChange} type="text" placeholder="Enter title.." />
      ...
      <input name="images" onChange={handleChange} type="file" multiple />
      ...
  ```
  - You can test it out by throwing in a `debugger`

- Step 4:
  - Time to define a callback function that handles form submission.
  - We also want to send a request to our rails server with the information that's part of the form.
  ```js
  const handleSubmit = (e) => {
     // stops the form from sending a request
      e.preventDefault()

      //
      // Initialize new FormData object
      //
      let formData = new FormData()
      formData.append('post[title]',title)

      //
      // If multiple images are selected,
      // This loop will add it to FormData object
      //
      for(let index in images){
        if(typeof images[index] === 'object'){
            formData.append('post[images][]',images[index])
        }
      }

      //
      // Send FormData to the server
      // Prints response to the console.
      //
      fetch('http://localhost:3000/posts',{
        method: 'POST',
        body: formData
      }).then(res => res.json())
      .then(console.log)
    }
  ```

- **All Done!** Our front end is now ready to send attachments to our backend on `POST /posts` path.

- ***Spoilers:*** The form supports more file types than just the images.

## Backend

## Resources
- [Rails Docs on ActiveStorage]
- [Rails Docs on ActiveModel Serializers]
- [Rails Docs on ActiveModel Validators]

[Rails Docs on ActiveStorage]: https://edgeguides.rubyonrails.org/active_storage_overview.html
[ActiveStorage]: https://edgeguides.rubyonrails.org/active_storage_overview.html
[Rails Docs on ActiveModel Serializers]: https://github.com/rails-api/active_model_serializers
[ActiveModel Serializers]: https://github.com/rails-api/active_model_serializers
[Rails Docs on ActiveModel Validators]: https://api.rubyonrails.org/v6.1.3.1/classes/ActiveModel/Validator.html
[ActiveModel Validators]: https://api.rubyonrails.org/v6.1.3.1/classes/ActiveModel/Validator.html
