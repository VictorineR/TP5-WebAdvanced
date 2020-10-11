<template>
  <div>
    <div class="content">
      <article v-for="article in articles" :key="article.id">
        <div class="article-content" v-if="editingArticle.id !== article.id">
          <div class="article-title">
            <div class="article-img">
              <div
                :style="{ backgroundImage: 'url(' + article.image + ')' }"
              ></div>
            </div>

            <h2>{{ article.name }} - {{ article.price }}€</h2>
            <div class="paragraphe">
              {{ article.description }}
            </div>
            <div>
              <button
                class="button"
                v-if="
                  panier.articles.find((a) => a.id === article.id) == undefined
                "
                @click="addToPanier(article.id)"
              >
                Ajouter au panier
              </button>
              <button
                class="button"
                v-else
                @click="removeFromPanier(article.id)"
              >
                Retirer du panier
              </button>

              <button class="button" @click="deleteArticle(article.id)">
                Supprimer
              </button>
              <button class="button" @click="editArticle(article)">
                Modifier
              </button>
            </div>
          </div>
        </div>

        <div class="article-content" v-else>
          <div class="article-title">
            <input
            type="text"
            v-model="editingArticle.image"
            placeholder="Lien vers l'image"
          />
            <h2>
              <input type="text" v-model="editingArticle.name" /> -
              <input type="number" v-model="editingArticle.price" />
            </h2>
            <p><textarea v-model="editingArticle.description"></textarea></p>

            <div>
              <button @click="sendEditArticle()">Valider</button>
              <button @click="abortEditArticle()">Annuler</button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="formulaire">
      <form @submit.prevent="addArticle">
        <h2>Nouveau produit à ajouter</h2>
        <input
          type="text"
          v-model="newArticle.name"
          placeholder="Nom du produit"
          required
        />
        <input
          type="number"
          v-model="newArticle.price"
          placeholder="Prix"
          required
        />
        <textarea
          type="text"
          v-model="newArticle.description"
          placeholder="Description du produit"
          required
        ></textarea>
        <input
          type="text"
          v-model="newArticle.image"
          placeholder="Lien vers l'image"
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object },
  },
  data() {
    return {
      newArticle: {
        name: "",
        description: "",
        image: "",
        price: 0,
      },
      editingArticle: {
        id: -1,
        name: "",
        description: "",
        image: "",
        price: 0,
      },
      isActivated: false,
    };
  },
  methods: {
    addArticle() {
      this.$emit("add-article", this.newArticle);
    },
    addToPanier(articleId) {
      this.$emit("add-to-panier", articleId, this.article);
    },
    removeFromPanier(articleId) {
      this.$emit("remove-from-panier", articleId);
    },
    deleteArticle(articleId) {
      this.$emit("delete-article", articleId);
    },
    editArticle(article) {
      this.editingArticle.id = article.id;
      this.editingArticle.name = article.name;
      this.editingArticle.description = article.description;
      this.editingArticle.image = article.image;
      this.editingArticle.price = article.price;
    },
    sendEditArticle() {
      this.$emit("update-article", this.editingArticle);
      this.abortEditArticle();
    },
    abortEditArticle() {
      this.editingArticle = {
        id: -1,
        name: "",
        description: "",
        image: "",
        price: 0,
      };
    },
  },
};
</script>

<style scoped>
.content {
  display: center;
  text-align: center;
  padding: 30px;
}
.article-img {
  margin-left: 43%;
  margin-top: 3%;
}
.article-img div {
  width: 200px;
  height: 200px;
  background-size: cover;
  border-radius: 6px;
}
.article-title h2 {
  justify-content: space-around;
  text-align: flex;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  color: black;
}
.paragraphe {
  float: center;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  color: black;
}
.button {
  border: none;
  padding: 6px 3px 6px 3px;
  border-radius: 6px;
  margin-top: 15px;
  margin-bottom: 40px;
  box-shadow: 3px 3px 12px gray;
  background: white;
  font: bold 13px;
  color: black;
  cursor: pointer;
}
.button:hover {
  background: #5a5a5abb;
  color: white;
  transition: 0.5s;
}

form button {
  border: none;
  border-radius: 6px;
  box-shadow: 3px 1px 10px gray;
  background: white;
  font: bold 11px;
  color: black;
  cursor: pointer;
}

form button:hover {
  background: #5a5a5abb;
  color: white;
  transition: 0.5s;
}

.formulaire {
  padding-left: 40%;
  margin-bottom: 20px;
}

form {
  background-color: rgba(245, 245, 245, 0);
  border: dotted #5a5a5abb 2px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 5%;
  padding: 13px;
  width: 280px;
}
form h2 {
  justify-content: space-around;
  text-align: center;
  font-size: 25px;
  text-align: flex;
  color: black;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
}
textarea {
  width: 100%;
}
</style>