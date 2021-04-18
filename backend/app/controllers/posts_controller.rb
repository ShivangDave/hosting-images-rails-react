class PostsController < ApplicationController

  def create
    @post = Post.create(post_params)
    render :json => {
      post: @post,
      images: @post.images.map { |img| url_for(img) }
    }
  end

  private
  def post_params
    params.require(:post).permit(:title,:images => [])
  end

end
