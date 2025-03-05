const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class PostsController{
  async create(request, response){
    const { content, tags } = request.body
    const user_id = request.user.id

    const userExists = await knex('users').where({id: user_id}).first()

    if(!userExists){
      throw new AppError("Você não é um usuário autenticado!")
    }

    const [post_id] = await knex("posts").insert({
      content,
      user_id
    })

    if(tags){
      const tagsInsert = tags.map(name => {
        return {
          post_id,
          name,
          user_id
        }
      })
      await knex("tags").insert(tagsInsert)
    }
    

    return response.json()

  }

  async showAll(request, response){
    const posts = await knex("posts").select('*')
    
    for(let post of posts) {
      const comments = await knex("comments").where({post_id: post.id})
      const tags = await knex("tags").where({post_id: post.id})

      const postLikes = await knex("likes").where({ post_id: post.id }).whereNull("comment_id");  
      
      let postNumberLikes = postLikes.length
      const transformedLikes = postLikes.map(like => ({
        id: like.id,
        user_id: like.user_id,
        post_id: like.post_id
      }));
      
      let commentLikes = []
      for(let comment of comments) {
        const likes = await knex("likes").where({ comment_id: comment.id }).whereNotNull("comment_id");
        commentLikes.push({
          comment_id: comment.id,
          likesCount: likes.length
        })
      }
      
      post.TotalLikes = postNumberLikes
      post.comments = comments
      post.tags = tags
      post.likes = transformedLikes
      post.commentLikes = commentLikes
      

    }

      return response.json(posts)
  }

  async showPostComments(request, response){
    const { id } = request.params

    const postExists = await knex("posts").where({ id }).first()

    if(!postExists){
      throw new AppError('O post não existe!')
    }

    const comments = await knex("comments").where({ post_id: id})

    return response.json(comments);
  }

  async updatePost(request, response) {
    const { id } = request.params
    const { content } = request.body
    const postExists = await knex('posts').where({ id }).first()
    const permission = request.user.permission
    const user_id = request.user.id
    
    if(!postExists) {

      throw new AppError('O post não existe!')
    }

    if(!(postExists.user_id === user_id || permission  === 'owner')) {
      throw new AppError("Você não tem permissão para editar este post!", 403)
    }
    

    await knex("posts").where({ id }).update({
      content,
      updated_at: knex.fn.now()
    })

    return response.json({ message: 'Post atualizado com sucesso!' });
  }

  async fixPost(request, response) {
    const { id } = request.params
    const postExists = await knex("posts").where({ id }).first()
    const permission = request.user.permission
    const user_id = request.user.id
    
    if(!postExists) {
      throw new AppError('O post não existe!', 404)
    }

    if(!(postExists.user_id === user_id || permission  === 'owner' || permission === 'mod')) {
      throw new AppError("Você não tem permissão para fixar posts!", 403)
    }

    const newFixedValue = postExists.isFixed == 1 ? 0 : 1

    await knex.transaction(async trx => {
      // Desfixa qualquer post fixado
      if(newFixedValue === 1){
        await trx("posts").update({ isFixed: false }).where({ isFixed: true });
      }
      
      // Fixar o post atual
      await trx("posts").update({ isFixed: newFixedValue }).where({ id });
    });

    return response.json({
      message: newFixedValue === 1 ? 'Post fixado com sucesso!' : 'Post desfixado com sucesso!',
      isFixed: newFixedValue,
    });
  }



  async addLike(request, response) {
    const { post_id } = request.params
    const  user_id  = request.user.id
    const permission = request.user.permission

    const userExists = await knex('users').where({id: user_id}).first()
    const postExists = await knex('posts').where({id: post_id}).first()

    if(!userExists || !userExists) {
      throw new AppError("O usuário ou post em questão não foram encontrados.")
    }

    if (permission !== "mod" && permission !== "owner") {
      const alreadyLiked = await knex("likes")
          .where({ post_id, user_id })
          .whereNull("comment_id");
      console.log('alou')
      console.log(permission)
      if (alreadyLiked.length) {
          throw new AppError("Você já curtiu este post!");
      }
    }

    await knex("likes").insert({post_id, user_id})

    return response.json({message: "Like adicionado com sucesso!"})
  }

  async delete(request, response){
    const { id } = request.params
    const user_id = request.user.id
    const permission = request.user.permission

    const postExists = await knex("posts").where({ id }).first()

    if(!postExists){
      throw new AppError('O post não existe!')
    }

    if(!(postExists.user_id === user_id || permission  === 'owner' || permission === 'mod')) {
      throw new AppError("Você não tem permissão para deletar este post!", 403)
    }

    await knex("posts").where({ id }).delete()

    return response.json('Post deletado com sucesso!')
  }

  async index(request, response){
    const { content, tags } = request.query

    const user_id = request.user.id
   
    let myPosts
    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())
      
      myPosts = await knex("tags")
      .select([
        "posts.id",
        "posts.content",
        "posts.user_id"
      ])
      .where("posts.user_id", user_id)
      .whereLike("posts.content", `%${content}%`)
      .whereIn("name", filterTags)
      .innerJoin("posts", "posts.id", "tags.post_id")
      .orderBy("created_at", "desc")

    } else {      
        myPosts = await knex("posts")
        .where({ user_id })
        .whereLike("content", `%${content}%`)
        .orderBy("created_at", "desc")
      }
    
    const userTags = await knex("tags").where({ user_id })
    const postsWithTags = myPosts.map(post => {
      const postTags = userTags.filter(tag => tag.post_id === post.id)

      return {
        ...post,
        tags: postTags
      }
    })

    return response.json(postsWithTags)
  }
}

module.exports = PostsController