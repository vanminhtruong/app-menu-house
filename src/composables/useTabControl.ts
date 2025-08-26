import { ref } from 'vue'

export function useTabControl(defaultTab: string = 'both') {
  // Tab state
  const activeTab = ref(defaultTab)
  
  // Change tab method
  const changeTab = (tabName: string) => {
    activeTab.value = tabName
  }
  
  return {
    activeTab,
    changeTab
  }
} 