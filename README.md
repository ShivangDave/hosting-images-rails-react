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
    - [Additional Resources]

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

- Step 1:
  - Let's start by scaffolding a new `Rails` application using `rails new <app-name> --api` command.


- Step 2:
  - Once the command is done running, we can start to configure [ActiveStorage]. That's where our images / attachments are going to be stored.
  - Use `rails active_storage:install` command to scaffold migrations needed to start using [ActiveStorage].
  - Next run `rails db:migrate`. That'll create the `ActiveStorage` tables.


- Step 3:
  - For our sample resource, we're going to go with a `Post` model.
  - Use `rails g resource post title:string --no-test-framework` to generate the files.
  - Once that's done, we can add the association for the image.

  ```ruby
    class Post
      #
      # One image association
      #
      has_one_attached :image
    end

    # OR

    class Post
      #
      # Multiple image associations
      #
      has_many_attached :images
    end
  ```

- Step 4:
  - Now we can choose where we want to store our images.
  - Rails conveniently provides us a way to use `Local` or `Remote` storages for the attachments.
  - We can configure those services in `config/storage.yml`
  ```yml
      local:
        service: Disk
        root: <%= Rails.root.join("storage") %>

      test:
        service: Disk
        root: <%= Rails.root.join("tmp/storage") %>

      amazon:
        service: S3
        access_key_id: ""
        secret_access_key: ""
        bucket: ""
        region: "" # e.g. 'us-east-1'
  ```

  - And round that up by adding services to `development.rb` and/or `production.rb`
  ```ruby
    #
    # Using local disk
    # Store files locally.
    config.active_storage.service = :local

    #
    # Store files on Amazon S3.
    config.active_storage.service = :amazon
  ```

- Step 5:
  - Optional: Configure the controller method
  ```ruby
    class PostsController < ApplicationController

        def create
          @post = Post.create(posts_params)

          #
          # There are better ways to serialize the response
          #
          render :json => {
            post: @post,
            images: @post.images.map { |img| url_for(img) }
          }
        end

        #
        # Strong params
        #
        private
        def posts_params
          params.require(:post).permit(:title,:images => [])
        end
    end
  ```

- **All Done!** Our backend is now ready to create posts and attach images. ***optional:*** Throw a `byebug` in your `create` method and test it out :)

**Note:**
- ***url_for*** method will return the direct link to the image(s) that are stored in our database.

## More Resources
- [Rails Docs on ActiveStorage]
- [Rails Docs on ActiveModel Serializers]
- [Rails Docs on ActiveModel Validators]
- [AWS S3 Service Configuration]
- [Microsoft Azure Configuration]
- [Google Cloud Configuration]
- [Mirror Service]

[Rails Docs on ActiveStorage]: https://edgeguides.rubyonrails.org/active_storage_overview.html
[ActiveStorage]: https://edgeguides.rubyonrails.org/active_storage_overview.html
[Rails Docs on ActiveModel Serializers]: https://github.com/rails-api/active_model_serializers
[ActiveModel Serializers]: https://github.com/rails-api/active_model_serializers
[Rails Docs on ActiveModel Validators]: https://api.rubyonrails.org/v6.1.3.1/classes/ActiveModel/Validator.html
[ActiveModel Validators]: https://api.rubyonrails.org/v6.1.3.1/classes/ActiveModel/Validator.html
[AWS S3 Service Configuration]: https://edgeguides.rubyonrails.org/active_storage_overview.html#s3-service-amazon-s3-and-s3-compatible-apis
[Microsoft Azure Configuration]: https://edgeguides.rubyonrails.org/active_storage_overview.html#microsoft-azure-storage-service
[Google Cloud Configuration]: https://edgeguides.rubyonrails.org/active_storage_overview.html#google-cloud-storage-service
[Mirror Service]: https://edgeguides.rubyonrails.org/active_storage_overview.html#mirror-service
[Additional Resources]: https://github.com/ShivangDave/hosting-images-rails-react/README.md#more-resources
