<template>
  <div id = "app">
    <header>
      <router-link to="/">📝 我的博客😅😨🤣</router-link>
      <nav>
        <router-link to="/article/create" class="new-btn">✍️ 写文章</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts"></script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #42b883;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
header a {
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
}
.new-btn {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  font-size: 14px !important;
}
.new-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
