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
          <a :href="generatedImageUrl" target="_blank" download="seak_ai_model.jpg" class="btn-download">
            💾 Download High-Res Image
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    // 1. 第一步：将图片文件与数据打包塞入 FormData
    const formData = new FormData()
    formData.append('files.source_image', selectedFile.value) 
    formData.append('data', JSON.stringify({
      model_type: modelType.value,
      generation_status: 'pending'
    }))
    
    console.log('正在初始化试衣间单据并上传原图...')
    
    // ✨ 确保这里正确声明了 createResponse 变量
    const createResponse = await $fetch('https://seak-backend.onrender.com/api/ai-generations', {
      method: 'POST',
      body: formData
    })

    // 2. 提取刚刚由 Strapi 官方接口返回的 唯一单据 ID
    const documentId = createResponse?.data?.documentId || createResponse?.data?.id
    if (!documentId) {
      throw new Error('未能成功创建 AI 任务单据或获取条目 ID')
    }

    console.log('单据创建成功，正在传回后端触发 Agnes AI，ID 为:', documentId)

    // 3. 第二步：把拿到的 ID 丢给你的自定义后端核心执行路由
    const generateResponse = await $fetch('https://seak-backend.onrender.com/api/ai-generations/run-generate', {
      method: 'POST',
      body: {
        id: documentId // 对应你后端代码的 const { id } = ctx.request.body;
      }
    })

    // 4. 第三步：同步回显由你后端返回的图片数据
    if (generateResponse && generateResponse.data && generateResponse.data.resultImageUrl) {
      generatedImageUrl.value = generateResponse.data.resultImageUrl
    } else if (generateResponse && generateResponse.url) {
      generatedImageUrl.value = generateResponse.url
    } else {
      alert('任务虽然触发成功，但返回的响应格式不包含 url，请刷新数据库检查。')
    }

  } catch (error) {
    console.error('AI Generation Error:', error)
    alert('Failed to generate image. Please check route configuration or ID mismatch.')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
/* 保持你漂亮大气的工业简约风格 UI 样式不变 */
.fitting-room-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, sans-serif; color: #1a1a1a; }
.page-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.page-subtitle { color: #666; margin-bottom: 40px; }
.main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.panel { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 24px; }
.section { margin-bottom: 24px; }
h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #333; }
.upload-box { border: 2px dashed #ddd; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; min-height: 260px; }
.image-preview, .final-image { max-width: 100%; max-height: 260px; object-fit: contain; }
.final-image { max-height: 400px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.model-selector { display: flex; flex-direction: column; gap: 10px; }
.radio-card { border: 1px solid #ddd; padding: 14px; border-radius: 6px; display: flex; align-items: center; gap: 10px; cursor: pointer; background: #fff; }
.radio-card.active { border-color: #1a1a1a; background: #fcfcfc; font-weight: 600; }
.btn-generate { width: 100%; background: #1a1a1a; color: #fff; border: none; padding: 16px; font-size: 16px; font-weight: 600; border-radius: 6px; cursor: pointer; }
.btn-generate:disabled { background: #ccc; cursor: not-allowed; }
.result-panel { display: flex; flex-direction: column; min-height: 450px; }
.result-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; border: 1px dashed #ddd; color: #999; border-radius: 6px; }
.loading-box { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.spinner { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #1a1a1a; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.result-box { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.btn-download { display: inline-block; background: #27ae60; color: white; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 6px; }
.hidden-input { display: none; }
.upload-label { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; color: #888; }
</style>