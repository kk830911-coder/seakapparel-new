<template>
  <div class="fitting-room-container">
    <h1 class="page-title">AI Virtual Fitting Room / 试衣间</h1>
    <p class="page-subtitle">Upload your flat lay image to instantly generate local professional model shots.</p>

    <div class="main-layout">
      <div class="panel control-panel">
        <div class="section">
          <h3>1. Upload Garment Image (上传服装)</h3>
          <div class="upload-box" :class="{ 'has-file': previewUrl }">
            <input type="file" accept="image/*" @change="onFileSelected" id="file-input" class="hidden-input" />
            <label for="file-input" class="upload-label">
              <div v-if="!previewUrl" class="upload-placeholder">
                <span class="icon">＋</span>
                <span>Click to upload flat lay or mannequin photo</span>
              </div>
              <img v-else :src="previewUrl" class="image-preview" alt="Preview" />
            </label>
          </div>
        </div>

        <div class="section">
          <h3>2. Select Model Type (选择模特)</h3>
          <div class="model-selector">
            <label class="radio-card" :class="{ active: modelType === 'southeast_asia' }">
              <input type="radio" v-model="modelType" value="southeast_asia" />
              <span>Southeast Asian Model (东南亚模特)</span>
            </label>
            <label class="radio-card" :class="{ active: modelType === 'european' }">
              <input type="radio" v-model="modelType" value="european" />
              <span>European Model (欧美模特)</span>
            </label>
          </div>
        </div>

        <button class="btn-generate" :disabled="isGenerating || !selectedFile" @click="startGeneration">
          {{ isGenerating ? 'Generating Studio Shots...' : '✨ Generate Model Images' }}
        </button>
      </div>

      <div class="panel result-panel">
        <h3>3. AI Generation Result (生成结果)</h3>
        
        <div class="result-placeholder" v-if="!isGenerating && !generatedImageUrl">
          <p>Your generated model images will appear here.</p>
        </div>

        <div class="loading-box" v-if="isGenerating">
          <div class="spinner"></div>
          <p>Agnes AI is tailoring the garment to the model...</p>
        </div>

        <div class="result-box" v-if="generatedImageUrl && !isGenerating">
          <img :src="generatedImageUrl" alt="AI Generated Model" class="final-image" />
          
          <button @click="downloadImage(generatedImageUrl)" class="btn-download">
            💾 Download High-Res Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ✨ 核心切换：本地测试完毕，直接切为你的线上正式 Render 后端网址
const BACKEND_URL = 'https://seak-backend.onrender.com'

const selectedFile = ref(null)
const previewUrl = ref(null)
const modelType = ref('southeast_asia')
const isGenerating = ref(false)
const generatedImageUrl = ref(null)

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  generatedImageUrl.value = null 
}

const startGeneration = async () => {
  if (!selectedFile.value) return
  isGenerating.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value) 
    formData.append('modelType', modelType.value)
    
    console.log('🚀 正在向线上后端复合公开路由投递图片，Agnes AI 正在全自动同步出图...')
    
    // 连通线上无冲突路径 /api/seak-ai/try-on
    const response = await $fetch(`${BACKEND_URL}/api/seak-ai/try-on`, {
      method: 'POST',
      body: formData
    })

    if (response && response.data && response.data.resultImageUrl) {
      generatedImageUrl.value = response.data.resultImageUrl
    } else if (response && response.url) {
      generatedImageUrl.value = response.url
    } else {
      alert('AI 渲染成功！但是未能捕获到正确的图片展示，请刷新线上数据库检查。')
    }

  } catch (error) {
    console.error('AI Generation Error:', error)
    alert('Failed to generate image. Please check if your online Strapi server is Live.')
  } finally {
    isGenerating.value = false
  }
}

// 强制跨域直接下载函数
const downloadImage = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const localBlobUrl = URL.createObjectURL(blob)
    
    const tempLink = document.createElement('a')
    tempLink.href = localBlobUrl
    tempLink.download = `seak_ai_model_${Date.now()}.jpg`
    document.body.appendChild(tempLink)
    tempLink.click()
    
    document.body.removeChild(tempLink)
    URL.revokeObjectURL(localBlobUrl)
  } catch (error) {
    console.error('强制下载失败，启用新窗口打开兜底:', error)
    window.open(imageUrl, '_blank')
  }
}
</script>

<style scoped>
.fitting-room-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, sans-serif; color: #1a1a1a; }
.page-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
.page-subtitle { color: #666; margin-bottom: 40px; }
.main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.panel { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 24px; }
.section { margin-bottom: 24px; }
h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #333; }
.upload-box { border: 2px dashed #ddd; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; overflow: hidden; min-height: 260px; }
.upload-box:hover { border-color: #1a1a1a; }
.hidden-input { display: none; }
.upload-label { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; color: #888; font-size: 14px; }
.upload-placeholder .icon { font-size: 32px; margin-bottom: 8px; }
.image-preview, .final-image { max-width: 100%; max-height: 260px; object-fit: contain; }
.final-image { max-height: 400px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.model-selector { display: flex; flex-direction: column; gap: 10px; }
.radio-card { border: 1px solid #ddd; padding: 14px; border-radius: 6px; display: flex; align-items: center; gap: 10px; cursor: pointer; background: #fff; transition: all 0.2s ease; }
.radio-card.active { border-color: #1a1a1a; background: #fcfcfc; font-weight: 600; }
.btn-generate { width: 100%; background: #1a1a1a; color: #fff; border: none; padding: 16px; font-size: 16px; font-weight: 600; border-radius: 6px; cursor: pointer; }
.btn-generate:disabled { background: #ccc; cursor: not-allowed; }
.result-panel { display: flex; flex-direction: column; min-height: 450px; }
.result-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; border: 1px dashed #ddd; color: #999; border-radius: 6px; }
.loading-box { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.spinner { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #1a1a1a; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.result-box { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.btn-download { display: inline-block; background: #27ae60; color: white; border: none; padding: 12px 24px; font-weight: 600; border-radius: 6px; cursor: pointer; }
.btn-download:hover { background: #219653; }
</style>