import { ref } from 'vue'

export function useImageOCR() {
  
  const isProcessing = ref(false)
  const progress = ref(0)
  
  // Process image and extract text
  const processImage = async (imageFile: File): Promise<string> => {
    isProcessing.value = true
    progress.value = 0
    
    try {
      // Sử dụng dynamic import để tránh lỗi DataCloneError
      const { createWorker } = await import('tesseract.js')

      console.info('🔍 Đang khởi tạo công cụ nhận dạng...')

      // Trong tesseract.js 6.0.1, createWorker đã thay đổi cách sử dụng
      // Truyền ngôn ngữ trực tiếp vào createWorker thay vì gọi loadLanguage và initialize
      progress.value = 10

      // Tạo worker với ngôn ngữ 'eng' (tiếng Anh)
      const worker = await createWorker('eng')

      progress.value = 40

      // Cấu hình để nhận dạng số tốt hơn
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
      })

      console.info('🔍 Đang phân tích ảnh...')
      progress.value = 50
      
      // Đọc file ảnh
      const imageData = await readImageFile(imageFile)
      
      progress.value = 60
      
      // Nhận dạng văn bản
      const { data } = await worker.recognize(imageData)
      
      progress.value = 90
      
      // Dọn dẹp worker
      await worker.terminate()
      
      progress.value = 100
      
      // Trích xuất số
      const numbers = data.text.replace(/[^0-9]/g, '')

      if (numbers.length === 0) {
        console.error('❌ Không thể nhận dạng số từ ảnh này!')
        return ''
      }

      console.log('✅ Đã nhận dạng thành công!')
      return numbers
    } catch (error) {
      console.error('OCR Error:', error)
      console.error('❌ Lỗi khi xử lý ảnh!')
      return ''
    } finally {
      isProcessing.value = false
    }
  }
  
  // Helper function to read image file
  const readImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = () => {
        resolve(reader.result as string)
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  return {
    isProcessing,
    progress,
    processImage
  }
} 