const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class CommentsController{
  async create(request, response){
    const { content } = request.body
    const { post_id } = request.params
    const user_id = request.user.id

    const userExists = await knex('users').where({id: user_id}).first()

    const postExists = await knex('posts').where({id: post_id}).first()

    if(!userExists || !postExists){
      throw new AppError('Usuário ou Post não encontrado!')
    }

    await knex("comments").insert({
      user_id,
      post_id,
      content
    })

    return response.json()
  }

  async addLike(request, response){
    const { comment_id } = request.params
    const user_id = request.user.id
    const permission = request.user.permission

    const commentExists = await knex('comments').where({id: comment_id}).first()
    const userExists = await knex('users').where({id: user_id}).first()

    if(!commentExists || !userExists){
      throw new AppError('O usuário ou comentário em questão não foram encontrados.')
    }

    if(permission !== 'mod' && permission !== 'owner') {
      const alreadyLiked = await knex("likes").where({ comment_id, user_id}).whereNull("post_id")

      if(alreadyLiked.length){
        throw new AppError("Você ja curtiu este comentário!")
      }
    }

    await knex('likes').insert({comment_id, user_id})

    return response.json({message: "Like adicionado com sucesso!"})
  }

  async show(request, response){
    const { id } = request.params
    const user_id = request.user.id
    const permission = request.user.permission

    const commentExists = await knex("comments").where({ id }).first()

    if(!commentExists){
      throw new AppError('O comentário não existe!')
    }

    return response.json(commentExists)
  }

  async updateComment(request, response) {
    const { id } = request.params
    const { content } = request.body
    const user_id = request.user.id
    const permission = request.user.permission

    const commentExists = await knex('comments').where({ id }).first()

    if(!commentExists){
      throw new AppError('O comentário não existe!')
    }

    if(!(commentExists.user_id === user_id || permission  === 'owner' || permission === 'mod')) {
      throw new AppError("Você não tem permissão para deletar este comentário!", 403)
    }

    await knex("comments").where({ id }).update({
      content,
      updated_at: knex.fn.now()
    })

    return response.json({ message: 'Comentário atualizado com sucesso!' });
  }


  async delete(request, response){
    const { id } = request.params
    const user_id = request.user.id
    const permission = request.user.permission
    console.log(permission)
    const commentExists = await knex("comments").where({ id }).first()

    if(!commentExists){
      throw new AppError('O comentário não existe!')
    }

    if(!(commentExists.user_id === user_id || permission  === 'owner' || permission === 'mod')) {
      throw new AppError("Você não tem permissão para deletar este comentário!", 403)
    }

    await knex("comments").where({ id }).delete()

    return response.json('Comentário deletado com sucesso!')
  }

}

module.exports = CommentsController