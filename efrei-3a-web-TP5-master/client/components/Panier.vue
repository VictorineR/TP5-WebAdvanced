<template>
  <div id="all">
    <h2>Mon Panier</h2>
    <article v-for="article in panier.articles" :key="article.id">
      <div class="article-content">
        <div class="article-img">
          <div
            :style="{
              backgroundImage:
                'url(' + articles.find((a) => a.id === article.id).image + ')',
            }"
          ></div>
        </div>
        <h3>
          {{ article.quantity }}
          {{ articles.find((a) => a.id === article.id).name }} | Prix total:
          {{
            articles.find((a) => a.id === article.id).price * article.quantity
          }}€
        </h3>
        <p>{{ articles.find((a) => a.id === article.id).description }}</p>

        <input
          type="number"
          v-model="article.articleQuantity"
          placeholder="Quantité"
        />
        <button @click="putInPanier(article.id, article.articleQuantity)">
          Changer la quantité
        </button>
      </div>
    </article>
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
      articleQuantity: "",
    };
  },
  async mounted() {},
  methods: {
    putInPanier(articleId, articleQuantity) {
      this.$emit("put-in-panier", articleId, articleQuantity);
    },
  },
};
</script>

<style scoped>
#all{
  padding-left: 1%;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
}

h2 {
  text-align: center;
  text-transform: uppercase;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
   color:black,
}

.article-img {
  display: center;
  margin-right: auto;
  margin-left: auto;
  margin-top: 5%;
}
.article-img div {
  width: 160px;
  height: 160px;
  background-size: cover;
}


button {
  border: none;
  border-radius: 6px;
  box-shadow: 3px 3px 12px gray;
  background: white;
  font: bold 13px;
  color: black;
  cursor: pointer;
}
button:hover {
  background: #5a5a5abb;
  color: white;
  transition: 0.5s;
}
</style>
