const express = require('express')
const router = express.Router()
const articles = require('../data/articles.js')

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.articles = []
  }
}

/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 * Votre objectif est, en apprenant des exemples de ce fichier, de créer l'API pour le panier de l'utilisateur
 *
 * Notre site ne contient pas d'authentification, ce qui n'est pas DU TOUT recommandé.
 * De même, les informations sont réinitialisées à chaque redémarrage du serveur, car nous n'avons pas de système de base de données pour faire persister les données
 */

/**
 * Notre mécanisme de sauvegarde des paniers des utilisateurs sera de simplement leur attribuer un panier grâce à req.session, sans authentification particulière
 */
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

/*
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (req, res) => {
  res.json(req.session.panier)
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', (req, res) => {
  const id = parseInt(req.body.id) 
  const quantity = parseInt(req.body.quantity)
  
  if (isNaN(id) || id>articles.length || 
    isNaN(quantity) || quantity <= 0){
    
    res.status(400).json({ message:'bad request'})
    return
  }
  
  for (var i= 0; i < req.session.panier.articles.length; i++){
    if (req.session.panier.articles[i].id == id){
      res.status(400).json ({ message: 'bad resquest'})
    }
  }

  const article = {
    id: id, 
    quantity: quantity
  }

  req.session.panier.articles.push(article)
  res.json(req.session.panier)
})

/* Remettre des commentaire */

router.post('/panier/pay', (req, res) => {
  const prenom = req.body.prenom // on recupere le name
  const nom = req.body.nom // we recup the lastname

  if(prenom ==''  || nom ==''){
    res.status(400).json({message:'bad request'})
    return
  }

  res.send("Merci " + prenom +" "+ nom + " pour votre achat")

  req.session.destroy()
  res.json(res.session.panier.articles)
  
})


/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:articleId', (req, res) => {
  const id = parseInt(req.params.articleId)
  const quantity = parseInt(req.body.quantity) // we recup the quantity value
  var i = 0

  if(isNaN(id) || (id > articles.length || quantity <= 0)){
    res.status(400).json({message:'bad request'})
    return}

    while(i < req.session.panier.articles.length && req.session.panier.articles[i].id != id){
      i++;
    }

    if(req.session.panier.articles[i].id != id){
      res.status(400).json({message: 'bad request'}) // if the id of the article is not found into the articles arrays
      return
    }

    req.session.panier.articles[i].quantity = quantity // we change the value quantity
    
    res.json(req.session.panier) // we return the basket

 
})

/*
 * Cette route doit supprimer un article dans le panier
 */

router.delete('/panier/:articleId', (req, res) => {
  const id = parseInt(req.params.articleId) // we recup the article id 
  var i = 0

  if(isNaN(id) || (id > articles.length)){
    res.status(400).json({message:'bad request'})
    return
  } // we test if not number or not in the articles arrays, there is an error 

  while(i < req.session.panier.articles.length && req.session.panier.articles[i].id != id){
    i++;
  }
  if(req.session.panier.articles[i].id != id){
    res.status(400).json({message: 'bad request'}) // if the id of the article is not found into the articles arrays
    return
  }

  req.session.panier.articles.splice(i,1) // we remove the wanted article from the basket

  res.json(req.session.panier) // we return the modified array 
})


/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/articles', (req, res) => {
  res.json(articles)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/article', (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const image = req.body.image
  const price = parseInt(req.body.price)

  // vérification de la validité des données d'entrée
  if (typeof name !== 'string' || name === '' ||
      typeof description !== 'string' || description === '' ||
      typeof image !== 'string' || image === '' ||
      isNaN(price) || price <= 0) {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const article = {
    id: articles.length + 1,
    name: name,
    description: description,
    image: image,
    price: price
  }
  articles.push(article)
  // on envoie l'article ajouté à l'utilisateur
  res.json(article)
})

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */

function parseArticle (req, res, next) {
  const articleId = parseInt(req.params.articleId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(articleId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.articleId = articleId

  const article = articles.find(a => a.id === req.articleId)
  if (!article) {
    res.status(404).json({ message: 'article ' + articleId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.article = article
  next()
}

router.route('/article/:articleId')
  /**
   * Cette route envoie un article particulier
   */
  .get(parseArticle, (req, res) => {
    // req.article existe grâce au middleware parseArticle
    res.json(req.article)
  })

  /**
   * Cette route modifie un article.
   * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
   * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
   *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
   */

  .put(parseArticle, (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const price = parseInt(req.body.price)

    req.article.name = name
    req.article.description = description
    req.article.image = image
    req.article.price = price
    res.send()
  })

  .delete(parseArticle, (req, res) => {
    const index = articles.findIndex(a => a.id === req.articleId)

    articles.splice(index, 1) // remove the article from the array
    res.send()
  })

module.exports = router
