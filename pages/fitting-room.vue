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
          <p class="loading-tip">⚡ All Platforms Optimized: Rendering instantly...</p>
        </div>

        <div class="result-box" v-if="generatedImageUrl && !isGenerating">
          <img 
            :src="generatedImageUrl" 
            alt="AI Generated Model" 
            class="final-image clickable-image" 
            @click="openLightbox"
            title="Click to view high-res image"
          />
          
          <button @click="downloadImage(generatedImageUrl)" class="btn-download">
            💾 Download High-Res Image
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLightboxOpen" class="image-modal" @click="closeLightbox">
      <span class="close-btn" @click="closeLightbox">&times;</span>
      <img :src="generatedImageUrl" class="modal-content" @click.stop />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const BACKEND_URL = 'https://seak-backend.onrender.com'

const selectedFile = ref(null)
const previewUrl = ref(null)
const modelType = ref('southeast_asia')
const isGenerating = ref(false)
const generatedImageUrl = ref(null)
const isLightboxOpen = ref(false)

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  generatedImageUrl.value = null 
  isLightboxOpen.value = false
}

const openLightbox = () => { isLightboxOpen.value = true }
const closeLightbox = () => { isLightboxOpen.value = false }

// ✨ 核心提速优化：无论是PC还是手机，全部通过前端画布压缩体积
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        // 限制最大宽高为 1200px，保留高品质服装细节，但体积能骤降 95%
        if (width > 1200 || height > 1200) {
          if (width > height) {
            height = Math.round((height * 1200) / width)
            width = 1200
          } else {
            width = Math.round((width * 1200) / height)
            height = 1200
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name || 'photo.jpg', { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.85) // 0.85 高清无损体感压缩
      }
    }
  })
}

// 核心生成流程
const startGeneration = async () => {
  if (!selectedFile.value) return
  isGenerating.value = true
  isLightboxOpen.value = false
  
  try {
    console.log('正在执行全平台高保真加速压缩...')
    const compressedFile = await compressImage(selectedFile.value)

    const formData = new FormData()
    formData.append('file', compressedFile, 'garment_photo.jpg') 
    formData.append('modelType', modelType.value)
    
    console.log('🚀 正在向线上后端投递优化文件...')
    
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
    alert('Generation Failed: ' + (error.data?.message || error.message))
  } finally {
    isGenerating.value = false
  }
}

const downloadImage = (imageUrl) => {
  if (imageUrl && imageUrl.includes('/upload/')) {
    const forcedDownloadUrl = imageUrl.replace('/upload/', '/upload/fl_attachment/')
    const tempLink = document.createElement('a')
    tempLink.href = forcedDownloadUrl
    tempLink.setAttribute('download', `seak_ai_model_${Date.now()}.jpg`)
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
  } else {
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
.image-preview { max-width: 100%; max-height: 260px; object-fit: contain; }
.final-image { max-height: 400px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: transform 0.2s ease; }
.clickable-image { cursor: zoom-in; }
.clickable-image:hover { transform: scale(1.01); }
.model-selector { display: flex; flex-direction: column; gap: 10px; }
.radio-card { border: 1px solid #ddd; padding: 14px; border-radius: 6px; display: flex; align-items: center; gap: 10px; cursor: pointer; background: #fff; transition: all 0.2s ease; }
.radio-card.active { border-color: #1a1a1a; background: #fcfcfc; font-weight: 600; }
.btn-generate { width: 100%; background: #1a1a1a; color: #fff; border: none; padding: 16px; font-size: 16px; font-weight: 600; border-radius: 6px; cursor: pointer; }
.btn-generate:disabled { background: #ccc; cursor: not-allowed; }
.result-panel { display: flex; flex-direction: column; min-height: 450px; }
.result-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; border: 1px dashed #ddd; color: #999; border-radius: 6px; }
.loading-box { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; }
.loading-tip { font-size: 12px; color: #888; }
.spinner { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #1a1a1a; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.result-box { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.btn-download { display: inline-block; background: #27ae60; color: white; border: none; padding: 12px 24px; font-weight: 600; border-radius: 6px; cursor: pointer; }

.image-modal { position: fixed; z-index: 99999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
.modal-content { max-width: 95vw; max-height: 85vh; object-fit: contain; border-radius: 4px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); cursor: default; animation: zoomIn 0.2s ease-out; }
.close-btn { position: absolute; top: 16px; right: 24px; color: rgba(255, 255, 255, 0.7); font-size: 40px; font-weight: 300; cursor: pointer; user-select: none; }

@media (max-width: 768px) {
  .fitting-room-container { padding: 20px 14px; }
  .page-title { font-size: 22px; }
  .page-subtitle { margin-bottom: 24px; font-size: 13px; }
  .main-layout { grid-template-columns: 1fr; gap: 20px; }
  .panel { padding: 16px; }
  .upload-box { min-height: 200px; }
  .final-image { max-height: 340px; }
  .modal-content { max-width: 98vw; max-height: 80vh; }
  .close-btn { top: 10px; right: 20px; font-size: 36px; }
}
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>