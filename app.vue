<template>
  <div class="bg-gray-50 min-h-screen flex flex-col font-sans">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold tracking-wide">seakapparel</NuxtLink>
        <nav class="hidden md:flex gap-8 font-medium text-gray-600">
          <NuxtLink to="/" active-class="text-blue-600">Home</NuxtLink>
          <NuxtLink to="/products" active-class="text-blue-600">Products</NuxtLink>
          <NuxtLink to="/blog" active-class="text-blue-600">Blog</NuxtLink>
          <NuxtLink to="/faq" active-class="text-blue-600">FAQ</NuxtLink>
          <NuxtLink to="/about" active-class="text-blue-600">About Us</NuxtLink>
          <NuxtLink to="/contact" active-class="text-blue-600">Contact</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <footer class="bg-gray-900 text-gray-400 py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm">
        <p>©2026 seakapparel | Women Clothing Wholesale Supplier For Southeast Asia</p>
      </div>
    </footer>
  </div>
</template>