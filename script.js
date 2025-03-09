document.addEventListener("DOMContentLoaded", () => {
  // 添加一个初始化标志，用于处理页面刷新情况
  let isInitialized = false

  // 默认数据
  const defaultResumeData = {
    personalInfo: {
      name: "张三",
      title: "前端开发工程师",
      email: "zhangsan@example.com",
      phone: "13800138000",
      location: "北京市",
      website: "https://zhangsan.dev",
      summary: "拥有5年前端开发经验，精通React、Vue等前端框架，有丰富的大型应用开发经验。",
    },
    education: [
      {
        school: "北京大学",
        degree: "本科",
        field: "计算机科学与技术",
        startDate: "2015-09",
        endDate: "2019-06",
        description: "主修课程：数据结构、算法分析、计算机网络、操作系统、数据库系统",
      },
    ],
    experience: [
      {
        company: "科技有限公司",
        position: "高级前端开发工程师",
        startDate: "2019-07",
        endDate: "至今",
        description:
          "负责公司核心产品的前端架构设计和开发，优化前端性能，提升用户体验。使用React、TypeScript和Tailwind CSS构建现代化Web应用。",
      },
      {
        company: "互联网科技有限公司",
        position: "前端开发工程师",
        startDate: "2017-03",
        endDate: "2019-06",
        description: "参与多个Web应用的开发，使用Vue.js构建用户界面，与后端团队协作实现产品功能。",
      },
    ],
    skills: [
      { name: "JavaScript/TypeScript", level: 90 },
      { name: "React", level: 85 },
      { name: "Vue.js", level: 80 },
      { name: "HTML/CSS", level: 90 },
      { name: "Node.js", level: 75 },
      { name: "Git", level: 85 },
    ],
    projects: [
      {
        name: "企业管理系统",
        description: "使用React和TypeScript开发的企业内部管理系统，包含人员管理、任务分配、数据分析等功能。",
        link: "https://github.com/zhangsan/project1",
      },
      {
        name: "电商平台",
        description: "基于Vue.js的电商平台前端，实现了商品展示、购物车、订单管理等功能。",
        link: "https://github.com/zhangsan/project2",
      },
    ],
    custom: [], // 自定义模块
    // 模块配置
    moduleConfig: {
      // 模块顺序
      order: ["personalInfo", "experience", "education", "skills", "projects"],
      // 模块可见性
      visibility: {
        personalInfo: true,
        education: true,
        experience: true,
        skills: true,
        projects: true,
      },
    },
  }

  // 初始化数据 - 确保在任何函数调用之前初始化
  const resumeData = JSON.parse(localStorage.getItem("resumeData")) || defaultResumeData

  // 确保moduleConfig存在
  if (!resumeData.moduleConfig) {
    resumeData.moduleConfig = defaultResumeData.moduleConfig
  }

  // 确保custom数组存在
  if (!resumeData.custom) {
    resumeData.custom = []
  }

  // 主题设置
  let currentTheme = localStorage.getItem("resumeTheme") || "default"
  let customFonts = JSON.parse(localStorage.getItem("resumeFonts")) || {
    heading: "Inter",
    body: "Inter",
  }
  let customColors = JSON.parse(localStorage.getItem("resumeColors")) || {
    primary: "#3b82f6",
    accent: "#3b82f6",
  }
  // 加载样式设置
  const themeStyles = JSON.parse(localStorage.getItem("resumeStyles")) || {
    sectionStyle: "underline",
    skillStyle: "bar",
    dateStyle: "simple",
  }
  // 在页面加载时应用样式设置
  document.addEventListener("DOMContentLoaded", () => {
    // 其他初始化代码...

    // 应用主题和字体
    applyThemeAndFonts()

    // 应用样式设置
    applyThemeStyles(themeStyles)
  })
  // 模块标题映射
  const moduleNames = {
    personalInfo: "个人信息",
    education: "教育经历",
    experience: "工作经验",
    skills: "技能",
    projects: "项目经验",
  }

  // 更新导航栏主题选择下拉框中的自定义主题选项
  function updateThemeSelectOptions() {
    const themeSelect = document.getElementById("theme-select")
    
    // 移除所有自定义主题选项
    const customOptions = themeSelect.querySelectorAll("option[data-custom='true']")
    customOptions.forEach(option => option.remove())
    
    // 添加自定义主题选项
    customThemes.forEach(theme => {
      const option = document.createElement("option")
      option.value = theme.id
      option.textContent = theme.name
      option.dataset.custom = "true"
      themeSelect.appendChild(option)
    })
    
    // 设置当前选中的主题
    themeSelect.value = currentTheme
  }
  
  // 自定义主题存储
  let customThemes = JSON.parse(localStorage.getItem("customThemes")) || []
  
  // 应用保存的主题和字体 - 确保在 resumeData 初始化后调用
  applyThemeAndFonts()
  
  // 初始化导航栏主题选择下拉框中的自定义主题选项
  updateThemeSelectOptions()

  // 视图切换（移动端）
  const toggleViewBtn = document.getElementById("toggle-view-btn")
  const mainContainer = document.querySelector(".main-container")

  toggleViewBtn.addEventListener("click", () => {
    mainContainer.classList.toggle("preview-mode")
    const isPreviewMode = mainContainer.classList.contains("preview-mode")
    toggleViewBtn.querySelector("span").textContent = isPreviewMode ? "编辑模式" : "预览模式"
  })

  // 主题设置模态框
  const themeSettingsBtn = document.getElementById("theme-settings-btn")
  const themeSettingsModal = document.getElementById("theme-settings-modal")
  const themeSettingsCancel = document.getElementById("theme-settings-cancel")
  const themeSettingsSave = document.getElementById("theme-settings-save")
  const themeSettingsReset = document.getElementById("theme-settings-reset")
  const modalClose = document.querySelector(".modal-close")

  // 初始化主题设置表单
  function initThemeSettings() {
    document.getElementById("theme-select").value = currentTheme
    document.getElementById("heading-font").value = customFonts.heading
    document.getElementById("body-font").value = customFonts.body
    document.getElementById("primary-color").value = customColors.primary
    document.getElementById("accent-color").value = customColors.accent

    // 初始化主题卡片
    updateThemeCards()

    // 初始化选项卡
    initTabs()
  }

  // 初始化选项卡功能
  function initTabs() {
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabContents = document.querySelectorAll(".tab-content")

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.dataset.tab

        // 移除所有活动状态
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))

        // 设置当前选项卡为活动状态
        button.classList.add("active")
        document.getElementById(tabId).classList.add("active")
      })
    })
  }

  document.getElementById("theme-select").addEventListener("change", (e) => {
    const selectedTheme = e.target.value
    currentTheme = selectedTheme
    
    // 查找是否是自定义主题
    const customTheme = customThemes.find(theme => theme.id === selectedTheme)
    
    if (customTheme) {
      // 应用自定义主题
      applyCustomTheme(customTheme)
    } else {
      // 重置为内置主题
      customFonts = {
        heading: "Inter",
        body: "Inter",
      }
      customColors = {
        primary: "#3b82f6",
        accent: "#3b82f6",
      }
      
      // 应用主题
      applyThemeAndFonts()
      
      // 保存设置
      localStorage.setItem("resumeTheme", currentTheme)
      localStorage.setItem("resumeFonts", JSON.stringify(customFonts))
      localStorage.setItem("resumeColors", JSON.stringify(customColors))
    }
  })

  // 打开主题设置
  themeSettingsBtn.addEventListener("click", () => {
    // 初始化主题设置
    initThemeSettings()
    themeSettingsModal.classList.add("show")
  })

  // 关闭主题设置
  function closeThemeModal() {
    themeSettingsModal.classList.remove("show")
  }

  themeSettingsCancel.addEventListener("click", closeThemeModal)
  modalClose.addEventListener("click", closeThemeModal)

  // 更新主题卡片
  function updateThemeCards() {
    const themeGrid = document.querySelector(".theme-grid")
    const builtInThemes = ["default", "modern", "elegant", "creative", "minimal", "corporate", "bold", "classic"]

    // 移除所有自定义主题卡片
    const customCards = themeGrid.querySelectorAll(".theme-card.custom-theme")
    customCards.forEach((card) => card.remove())

    // 设置当前主题卡片的活动状态
    const allCards = themeGrid.querySelectorAll(".theme-card")
    allCards.forEach((card) => {
      if (card.dataset.theme === currentTheme) {
        card.classList.add("active")
      } else {
        card.classList.remove("active")
      }
    })

    // 添加自定义主题卡片
    customThemes.forEach((theme) => {
      const card = document.createElement("div")
      card.className = "theme-card custom-theme"
      card.dataset.theme = theme.id

      const preview = document.createElement("div")
      preview.className = "theme-preview"
      preview.style.backgroundColor = theme.colors.primary

      const name = document.createElement("div")
      name.className = "theme-name"
      name.textContent = theme.name

      // 添加操作按钮容器
      const actions = document.createElement("div")
      actions.className = "theme-card-actions"

      // 添加编辑按钮
      const editBtn = document.createElement("button")
      editBtn.className = "theme-card-btn theme-edit-btn"
      editBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation() // 防止触发卡片点击事件
        editCustomTheme(theme)
      })

      // 添加删除按钮
      const deleteBtn = document.createElement("button")
      deleteBtn.className = "theme-card-btn theme-delete-btn"
      deleteBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation() // 防止触发卡片点击事件
        if (confirm(`确定要删除主题 "${theme.name}" 吗？`)) {
          deleteCustomTheme(theme.id)
        }
      })

      actions.appendChild(editBtn)
      actions.appendChild(deleteBtn)

      card.appendChild(preview)
      card.appendChild(name)
      card.appendChild(actions)

      // 点击事件
      card.addEventListener("click", () => {
        // 只在模态框内部更新选中状态，不立即应用主题
        // 更新活动状态
        allCards.forEach((c) => c.classList.remove("active"))
        card.classList.add("active")
        
        // 记录当前选中的主题ID，但不立即应用
        currentTheme = theme.id
      })

      themeGrid.appendChild(card)
    })

    // 为内置主题添加点击事件和占位按钮（不可编辑/删除）
    builtInThemes.forEach((themeId) => {
      const card = themeGrid.querySelector(`.theme-card[data-theme="${themeId}"]`)
      if (card) {
        // 添加占位按钮容器（不可操作）
        if (!card.querySelector(".theme-card-actions")) {
          const actions = document.createElement("div")
          actions.className = "theme-card-actions"

          // 添加禁用的占位按钮
          const disabledEditBtn = document.createElement("button")
          disabledEditBtn.className = "theme-card-btn theme-edit-btn disabled"
          disabledEditBtn.disabled = true
          disabledEditBtn.innerHTML =
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'

          const disabledDeleteBtn = document.createElement("button")
          disabledDeleteBtn.className = "theme-card-btn theme-delete-btn disabled"
          disabledDeleteBtn.disabled = true
          disabledDeleteBtn.innerHTML =
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'

          actions.appendChild(disabledEditBtn)
          actions.appendChild(disabledDeleteBtn)
          card.appendChild(actions)
        }

        card.addEventListener("click", () => {
          // 只在模态框内部更新选中状态，不立即应用主题
          // 更新活动状态
          allCards.forEach((c) => c.classList.remove("active"))
          card.classList.add("active")
          
          // 记录当前选中的主题ID，但不立即应用
          currentTheme = themeId

          // 重置为内置主题的表单值
          customFonts = {
            heading: "Inter",
            body: "Inter",
          }
          customColors = {
            primary: "#3b82f6",
            accent: "#3b82f6",
          }

          // 更新表单
          document.getElementById("heading-font").value = customFonts.heading
          document.getElementById("body-font").value = customFonts.body
          document.getElementById("primary-color").value = customColors.primary
          document.getElementById("accent-color").value = customColors.accent
          document.getElementById("primary-color-preview").textContent = customColors.primary
          document.getElementById("accent-color-preview").textContent = customColors.accent
        })
      }
    })
  }

  // 编辑自定义主题
  function editCustomTheme(theme) {
    // 切换到自定义主题选项卡
    document.querySelector('.tab-button[data-tab="theme-customize-tab"]').click()

    // 填充表单
    document.getElementById("theme-name").value = theme.name
    document.getElementById("heading-font").value = theme.fonts.heading
    document.getElementById("body-font").value = theme.fonts.body
    document.getElementById("primary-color").value = theme.colors.primary
    document.getElementById("accent-color").value = theme.colors.accent
    document.getElementById("primary-color-preview").textContent = theme.colors.primary
    document.getElementById("accent-color-preview").textContent = theme.colors.accent

    // 填充样式设置
    if (theme.styles) {
      if (theme.styles.sectionStyle) {
        document.getElementById("section-style").value = theme.styles.sectionStyle
      }
      if (theme.styles.skillStyle) {
        document.getElementById("skill-style").value = theme.styles.skillStyle
      }
      if (theme.styles.dateStyle) {
        document.getElementById("date-style").value = theme.styles.dateStyle
      }
    }

    // 设置编辑模式标记
    document.getElementById("theme-customize-tab").dataset.editMode = "true"
    document.getElementById("theme-customize-tab").dataset.editThemeId = theme.id

    // 更改保存按钮文本
    document.getElementById("theme-settings-save").textContent = "更新主题"
  }


  // 应用自定义主题
  function applyCustomTheme(theme) {
    // 更新当前主题
    currentTheme = theme.id

    // 更新字体和颜色
    customFonts = {
      heading: theme.fonts.heading,
      body: theme.fonts.body,
    }

    customColors = {
      primary: theme.colors.primary,
      accent: theme.colors.accent,
    }

    // 更新表单
    document.getElementById("heading-font").value = customFonts.heading
    document.getElementById("body-font").value = customFonts.body
    document.getElementById("primary-color").value = customColors.primary
    document.getElementById("accent-color").value = customColors.accent

    // 更新颜色预览文本
    const primaryPreview = document.getElementById("primary-color-preview")
    const accentPreview = document.getElementById("accent-color-preview")
    if (primaryPreview) primaryPreview.textContent = customColors.primary
    if (accentPreview) accentPreview.textContent = customColors.accent

    // 更新样式选择器（如果存在）
    if (theme.styles) {
      const sectionStyleSelect = document.getElementById("section-style")
      const skillStyleSelect = document.getElementById("skill-style")
      const dateStyleSelect = document.getElementById("date-style")

      if (sectionStyleSelect && theme.styles.sectionStyle) {
        sectionStyleSelect.value = theme.styles.sectionStyle
        document.documentElement.style.setProperty("--section-style", theme.styles.sectionStyle)
      }

      if (skillStyleSelect && theme.styles.skillStyle) {
        skillStyleSelect.value = theme.styles.skillStyle
        document.documentElement.style.setProperty("--skill-style", theme.styles.skillStyle)
      }

      if (dateStyleSelect && theme.styles.dateStyle) {
        dateStyleSelect.value = theme.styles.dateStyle
        document.documentElement.style.setProperty("--date-style", theme.styles.dateStyle)
      }
    }
    // 应用主题
    applyThemeAndFonts()
    // 应用额外的样式设置
    applyThemeStyles(theme.styles || {})
    // 保存设置
    localStorage.setItem("resumeTheme", currentTheme)
    localStorage.setItem("resumeFonts", JSON.stringify(customFonts))
    localStorage.setItem("resumeColors", JSON.stringify(customColors))
  }
  // 添加新函数：应用主题样式设置
  function applyThemeStyles(styles) {
    // 应用章节样式
    if (styles.sectionStyle) {
      document.documentElement.style.setProperty("--section-style", styles.sectionStyle)

      // 根据不同的章节样式应用特定的CSS类
      document.body.classList.remove("section-underline", "section-boxed", "section-simple")
      document.body.classList.add(`section-${styles.sectionStyle}`)
    }

    // 应用技能样式
    if (styles.skillStyle) {
      document.documentElement.style.setProperty("--skill-style", styles.skillStyle)

      // 根据不同的技能样式应用特定的CSS类
      document.body.classList.remove("skill-bar", "skill-circle", "skill-simple")
      document.body.classList.add(`skill-${styles.skillStyle}`)
    }

    // 应用日期样式
    if (styles.dateStyle) {
      document.documentElement.style.setProperty("--date-style", styles.dateStyle)

      // 根据不同的日期样式应用特定的CSS类
      document.body.classList.remove("date-simple", "date-boxed", "date-modern")
      document.body.classList.add(`date-${styles.dateStyle}`)
    }
  }
  // 保存自定义主题
  function saveCustomTheme() {
    const themeName = document.getElementById("theme-name").value.trim()

    if (!themeName) {
      alert("请输入主题名称")
      return false
    }

    // 检查是否处于编辑模式
    const customizeTab = document.getElementById("theme-customize-tab")
    const isEditMode = customizeTab.dataset.editMode === "true"
    const editThemeId = customizeTab.dataset.editThemeId

    // 创建主题对象
    const theme = {
      id: isEditMode ? editThemeId : `custom-${Date.now()}`,
      name: themeName,
      fonts: {
        heading: document.getElementById("heading-font").value,
        body: document.getElementById("body-font").value,
      },
      colors: {
        primary: document.getElementById("primary-color").value,
        accent: document.getElementById("accent-color").value,
      },
      styles: {
        sectionStyle: document.getElementById("section-style").value,
        skillStyle: document.getElementById("skill-style").value,
        dateStyle: document.getElementById("date-style").value,
      },
    }

    if (isEditMode) {
      // 更新现有主题
      const index = customThemes.findIndex((t) => t.id === editThemeId)
      if (index !== -1) {
        customThemes[index] = theme
      }

      // 重置编辑模式
      customizeTab.dataset.editMode = "false"
      customizeTab.dataset.editThemeId = ""

      // 恢复保存按钮文本
      document.getElementById("theme-settings-save").textContent = "保存设置"
    } else {
      // 添加到自定义主题列表
      customThemes.push(theme)
    }

    // 保存到本地存储
    localStorage.setItem("customThemes", JSON.stringify(customThemes))
    
    // 更新UI
    updateThemeCards()
    
    // 更新导航栏的主题选择下拉框
    updateThemeSelectOptions()

    // 清空表单
    document.getElementById("theme-name").value = ""

    // 切换到主题管理选项卡
    document.querySelector('.tab-button[data-tab="theme-select-tab"]').click()

    return true
  }

  // 删除自定义主题
  function deleteCustomTheme(themeId) {
    // 如果当前正在使用这个主题，切换到默认主题
    if (currentTheme === themeId) {
      currentTheme = "default"
      localStorage.setItem("resumeTheme", currentTheme)
      applyThemeAndFonts()
    }

    // 从列表中移除
    customThemes = customThemes.filter((theme) => theme.id !== themeId)

    // 保存到本地存储
    localStorage.setItem("customThemes", JSON.stringify(customThemes))

    // 更新UI
    updateThemeCards()
    // 更新导航栏的主题选择下拉框
    updateThemeSelectOptions()
    // updateCustomThemesList()
  }

  // 保存主题设置
  themeSettingsSave.addEventListener("click", () => {
    // 检查当前是否在自定义主题选项卡
    const activeTab = document.querySelector(".tab-content.active")

    if (activeTab.id === "theme-customize-tab") {
      // 保存自定义主题
      if (saveCustomTheme()) {
        closeThemeModal()
      }
    } else {
      // 保存当前主题设置
      const headingFont = document.getElementById("heading-font").value
      const bodyFont = document.getElementById("body-font").value
      const primaryColor = document.getElementById("primary-color").value
      const accentColor = document.getElementById("accent-color").value
      // 获取样式设置（如果存在）
      const styles = {}

      const sectionStyleSelect = document.getElementById("section-style")
      const skillStyleSelect = document.getElementById("skill-style")
      const dateStyleSelect = document.getElementById("date-style")

      if (sectionStyleSelect) {
        styles.sectionStyle = sectionStyleSelect.value
      }

      if (skillStyleSelect) {
        styles.skillStyle = skillStyleSelect.value
      }

      if (dateStyleSelect) {
        styles.dateStyle = dateStyleSelect.value
      }
      // 保存设置
      customFonts = { heading: headingFont, body: bodyFont }
      customColors = { primary: primaryColor, accent: accentColor }

      localStorage.setItem("resumeTheme", currentTheme)
      localStorage.setItem("resumeFonts", JSON.stringify(customFonts))
      localStorage.setItem("resumeColors", JSON.stringify(customColors))

      // 保存样式设置
      localStorage.setItem("resumeStyles", JSON.stringify(styles))
      // 应用设置
      applyThemeAndFonts()
      // 应用样式设置
      applyThemeStyles(styles)
      // 更新导航栏的主题选择下拉框
      document.getElementById("theme-select").value = currentTheme
      // 关闭模态框
      closeThemeModal()
    }
  })

  // 重置主题设置
  themeSettingsReset.addEventListener("click", () => {
    if (confirm("确定要重置主题设置吗？这将恢复默认主题。")) {
      // 重置为默认主题
      currentTheme = "default"
      customFonts = {
        heading: "Inter",
        body: "Inter",
      }
      customColors = {
        primary: "#3b82f6",
        accent: "#3b82f6",
      }

      // 保存设置
      localStorage.setItem("resumeTheme", currentTheme)
      localStorage.setItem("resumeFonts", JSON.stringify(customFonts))
      localStorage.setItem("resumeColors", JSON.stringify(customColors))

      // 应用设置
      applyThemeAndFonts()

      // 更新UI
      initThemeSettings()
    }
  })

  // 在保存主题设置之后，添加重置按钮的逻辑

  // 重置所有数据按钮
  document.getElementById("reset-all-data").addEventListener("click", () => {
    if (confirm("确定要重置所有数据吗？这将清除您所有的简历内容和设置。")) {
      // 清除所有本地存储数据
      localStorage.removeItem("resumeData")
      localStorage.removeItem("resumeTheme")
      localStorage.removeItem("resumeFonts")
      localStorage.removeItem("resumeColors")

      // 重新加载页面以应用默认设置
      window.location.reload()
    }
  })

  // 更新颜色选择器预览文本
  document.getElementById("primary-color").addEventListener("input", (e) => {
    document.getElementById("primary-color-preview").textContent = e.target.value
  })

  document.getElementById("accent-color").addEventListener("input", (e) => {
    document.getElementById("accent-color-preview").textContent = e.target.value
  })

  // 初始化颜色预览文本
  document.getElementById("primary-color-preview").textContent = document.getElementById("primary-color").value
  document.getElementById("accent-color-preview").textContent = document.getElementById("accent-color").value

  // 应用主题和字体
  function applyThemeAndFonts() {
    // 移除所有主题相关的类
    document.body.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.body.classList.remove(className)
      }
    })

    // 添加新的主题类
    if (currentTheme !== "default") {
      document.body.classList.add(`theme-${currentTheme}`)
    }

    // 应用自定义字体
    document.documentElement.style.setProperty("--resume-heading-font", `"${customFonts.heading}", sans-serif`)
    document.documentElement.style.setProperty("--resume-body-font", `"${customFonts.body}", sans-serif`)

    // 应用自定义颜色
    document.documentElement.style.setProperty("--resume-accent", customColors.accent)
    document.documentElement.style.setProperty("--resume-primary", customColors.primary)
    document.documentElement.style.setProperty("--resume-primary-light", adjustColor(customColors.primary, 40))
    document.documentElement.style.setProperty("--resume-primary-dark", adjustColor(customColors.primary, -40))
    // 导出按钮使用固定颜色，不受主题影响
    document.documentElement.style.setProperty("--primary", "#3b82f6")
  }
  // 添加一个辅助函数来调整颜色亮度
  function adjustColor(color, amount) {
    // 将十六进制颜色转换为RGB
    let hex = color
    if (hex.startsWith("#")) {
      hex = hex.slice(1)
    }

    // 确保颜色格式正确
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    // 转换为RGB
    let r = Number.parseInt(hex.slice(0, 2), 16)
    let g = Number.parseInt(hex.slice(2, 4), 16)
    let b = Number.parseInt(hex.slice(4, 6), 16)

    // 调整亮度
    r = Math.max(0, Math.min(255, r + amount))
    g = Math.max(0, Math.min(255, g + amount))
    b = Math.max(0, Math.min(255, b + amount))

    // 转回十六进制
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }
  // 修改 initializeModules 函数，确保能够正确显示和展开模块
  function initializeModules() {
    const modulesContainer = document.getElementById("resume-modules")
    modulesContainer.innerHTML = ""

    // 如果没有模块，显示空状态
    if (resumeData.moduleConfig.order.length === 0) {
      const emptyState = document.createElement("div")
      emptyState.className = "empty-state"
      emptyState.innerHTML = `
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <h3 class="empty-state-title">没有模块</h3>
          <p class="empty-state-description">点击"添加模块"按钮开始创建您的简历</p>
        `
      modulesContainer.appendChild(emptyState)
      return
    }

    // 根据模块顺序和可见性创建模块
    resumeData.moduleConfig.order.forEach((moduleId) => {
      // 如果模块不可见，跳过
      if (!resumeData.moduleConfig.visibility[moduleId]) {
        return
      }

      // 创建模块
      const moduleElement = createModule(moduleId)
      if (moduleElement) {
        modulesContainer.appendChild(moduleElement)
      }
    })

    // 初始化手风琴功能
    initializeAccordion()

    // 重新初始化拖拽功能
    initializeDragAndDrop()

    isInitialized = true
  }

  // 修复手风琴初始化函数
  function initializeAccordion() {
    const accordionTriggers = document.querySelectorAll(".accordion-trigger")
    accordionTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        // 如果点击的是拖动手柄或删除按钮，不展开/收起手风琴
        if (e.target.closest(".drag-handle") || e.target.closest(".remove-module")) {
          return
        }

        const accordionItem = trigger.closest(".accordion-item")
        accordionItem.classList.toggle("expanded")
      })
    })
  }

  // 添加模块
  function addModule(moduleType) {
    if (!resumeData.moduleConfig.order.includes(moduleType)) {
      resumeData.moduleConfig.order.push(moduleType)
      resumeData.moduleConfig.visibility[moduleType] = true
      saveData()
      initializeModules()
    }
  }

  // 保存数据
  function saveData() {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
    renderPreview()
  }

  // 更新个人信息
  function updatePersonalInfo(key, value) {
    resumeData.personalInfo[key] = value
    saveData()
  }

  // 创建教育经历项
  function createEducationItem(edu, index) {
    const eduItem = document.createElement("div")
    eduItem.className = "education-item"
    eduItem.innerHTML = `
        <div class="form-group">
          <label>学校</label>
          <input type="text" class="school" value="${edu.school}" placeholder="学校名称">
        </div>
        <div class="form-group">
          <label>学位</label>
          <input type="text" class="degree" value="${edu.degree}" placeholder="学位">
        </div>
        <div class="form-group">
          <label>专业</label>
          <input type="text" class="field" value="${edu.field}" placeholder="专业">
        </div>
        <div class="form-group form-grid">
          <div>
            <label>开始时间</label>
            <input type="text" class="start-date" value="${edu.startDate}" placeholder="开始时间">
          </div>
          <div>
            <label>结束时间</label>
            <input type="text" class="end-date" value="${edu.endDate}" placeholder="结束时间">
          </div>
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea class="description" rows="3" placeholder="描述">${edu.description}</textarea>
        </div>
        <button class="button button-icon remove-education">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `

    // 添加事件监听器
    eduItem.querySelector(".school").addEventListener("input", (e) => updateEducation(index, "school", e.target.value))
    eduItem.querySelector(".degree").addEventListener("input", (e) => updateEducation(index, "degree", e.target.value))
    eduItem.querySelector(".field").addEventListener("input", (e) => updateEducation(index, "field", e.target.value))
    eduItem
      .querySelector(".start-date")
      .addEventListener("input", (e) => updateEducation(index, "startDate", e.target.value))
    eduItem
      .querySelector(".end-date")
      .addEventListener("input", (e) => updateEducation(index, "endDate", e.target.value))
    eduItem
      .querySelector(".description")
      .addEventListener("input", (e) => updateEducation(index, "description", e.target.value))
    eduItem.querySelector(".remove-education").addEventListener("click", () => removeEducation(index))

    return eduItem
  }

  // 更新教育经历
  function updateEducation(index, key, value) {
    resumeData.education[index][key] = value
    saveData()
  }

  // 移除教育经历
  function removeEducation(index) {
    resumeData.education.splice(index, 1)
    saveData()

    // 重新初始化模块
    initializeModules()
  }

  // 创建工作经验项
  function createExperienceItem(exp, index) {
    const expItem = document.createElement("div")
    expItem.className = "experience-item"
    expItem.innerHTML = `
        <div class="form-group">
          <label>公司</label>
          <input type="text" class="company" value="${exp.company}" placeholder="公司名称">
        </div>
        <div class="form-group">
          <label>职位</label>
          <input type="text" class="position" value="${exp.position}" placeholder="职位">
        </div>
        <div class="form-group form-grid">
          <div>
            <label>开始时间</label>
            <input type="text" class="start-date" value="${exp.startDate}" placeholder="开始时间">
          </div>
          <div>
            <label>结束时间</label>
            <input type="text" class="end-date" value="${exp.endDate}" placeholder="结束时间">
          </div>
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea class="description" rows="3" placeholder="描述">${exp.description}</textarea>
        </div>
        <button class="button button-icon remove-experience">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `

    // 添加事件监听器
    expItem
      .querySelector(".company")
      .addEventListener("input", (e) => updateExperience(index, "company", e.target.value))
    expItem
      .querySelector(".position")
      .addEventListener("input", (e) => updateExperience(index, "position", e.target.value))
    expItem
      .querySelector(".start-date")
      .addEventListener("input", (e) => updateExperience(index, "startDate", e.target.value))
    expItem
      .querySelector(".end-date")
      .addEventListener("input", (e) => updateExperience(index, "endDate", e.target.value))
    expItem
      .querySelector(".description")
      .addEventListener("input", (e) => updateExperience(index, "description", e.target.value))
    expItem.querySelector(".remove-experience").addEventListener("click", () => removeExperience(index))

    return expItem
  }

  // 更新工作经验
  function updateExperience(index, key, value) {
    resumeData.experience[index][key] = value
    saveData()
  }

  // 移除工作经验
  function removeExperience(index) {
    resumeData.experience.splice(index, 1)
    saveData()

    // 重新初始化模块
    initializeModules()
  }

  // 创建技能项
  function createSkillItem(skill, index) {
    const skillItem = document.createElement("div")
    skillItem.className = "skill-item"
    skillItem.innerHTML = `
        <div class="form-group">
          <label>技能名称</label>
          <input type="text" class="name" value="${skill.name}" placeholder="技能名称">
        </div>
        <div class="form-group">
          <label>技能等级</label>
          <input type="number" class="level" value="${skill.level}" min="0" max="100">
        </div>
        <button class="button button-icon remove-skill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `

    // 添加事件监听器
    skillItem.querySelector(".name").addEventListener("input", (e) => updateSkill(index, "name", e.target.value))
    skillItem
      .querySelector(".level")
      .addEventListener("input", (e) => updateSkill(index, "level", Number.parseInt(e.target.value)))
    skillItem.querySelector(".remove-skill").addEventListener("click", () => removeSkill(index))

    return skillItem
  }

  // 更新技能
  function updateSkill(index, key, value) {
    resumeData.skills[index][key] = value
    saveData()
  }

  // 移除技能
  function removeSkill(index) {
    resumeData.skills.splice(index, 1)
    saveData()

    // 重新初始化模块
    initializeModules()
  }

  // 创建项目经验项
  function createProjectItem(project, index) {
    const projectItem = document.createElement("div")
    projectItem.className = "project-item"
    projectItem.innerHTML = `
        <div class="form-group">
          <label>项目名称</label>
          <input type="text" class="name" value="${project.name}" placeholder="项目名称">
        </div>
        <div class="form-group">
          <label>项目描述</label>
          <textarea class="description" rows="3" placeholder="项目描述">${project.description}</textarea>
        </div>
        <div class="form-group">
          <label>项目链接</label>
          <input type="text" class="link" value="${project.link}" placeholder="项目链接">
        </div>
        <button class="button button-icon remove-project">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `

    // 添加事件监听器
    projectItem.querySelector(".name").addEventListener("input", (e) => updateProject(index, "name", e.target.value))
    projectItem
      .querySelector(".description")
      .addEventListener("input", (e) => updateProject(index, "description", e.target.value))
    projectItem.querySelector(".link").addEventListener("input", (e) => updateProject(index, "link", e.target.value))
    projectItem.querySelector(".remove-project").addEventListener("click", () => removeProject(index))

    return projectItem
  }

  // 更新项目经验
  function updateProject(index, key, value) {
    resumeData.projects[index][key] = value
    saveData()
  }

  // 移除项目经验
  function removeProject(index) {
    resumeData.projects.splice(index, 1)
    saveData()

    // 重新初始化模块
    initializeModules()
  }

  // 删除模块
  function removeModule(moduleId) {
    const index = resumeData.moduleConfig.order.indexOf(moduleId)
    if (index > -1) {
      resumeData.moduleConfig.order.splice(index, 1)
      delete resumeData.moduleConfig.visibility[moduleId]

      // 如果是自定义模块，还需要从custom数组中删除
      if (moduleId.startsWith("custom-")) {
        const customIndex = Number.parseInt(moduleId.split("-")[1])
        resumeData.custom.splice(customIndex, 1)

        // 更新所有custom模块的索引
        resumeData.moduleConfig.order.forEach((id, i) => {
          if (id.startsWith("custom-")) {
            const currentIndex = Number.parseInt(id.split("-")[1])
            if (currentIndex > customIndex) {
              resumeData.moduleConfig.order[i] = `custom-${currentIndex - 1}`
            }
          }
        })
      }

      saveData()
      initializeModules()
    }
  }

  // 重写拖拽功能初始化，优化拖拽体验
  function initializeDragAndDrop() {
    const container = document.getElementById("resume-modules")
    const draggables = document.querySelectorAll(".accordion-item")

    // 确保所有元素都是可拖拽的
    draggables.forEach((item) => {
      item.setAttribute("draggable", "true")
    })

    let draggedItem = null
    let initialY = 0
    let initialScroll = 0
    let autoScrollInterval = null
    let lastClientY = 0

    // 清除旧的事件监听器，防止重复绑定
    container.removeEventListener("dragstart", handleDragStart)
    container.removeEventListener("dragend", handleDragEnd)
    container.removeEventListener("dragover", handleDragOver)
    container.removeEventListener("drop", handleDrop)
    container.removeEventListener("dragenter", handleDragEnter)
    container.removeEventListener("dragleave", handleDragLeave)
    document.removeEventListener("dragover", handleDocumentDragOver)

    // 使用命名函数便于移除事件监听器
    function handleDragStart(e) {
      if (!e.target.classList.contains("accordion-item")) return

      // 只有通过拖拽手柄才能拖拽
      if (
        !e.target.contains(e.target.querySelector(".drag-handle")) &&
        !e.target.querySelector(".drag-handle").contains(e.composedPath()[0])
      ) {
        e.preventDefault()
        return
      }

      draggedItem = e.target
      initialY = e.clientY
      initialScroll = container.scrollTop
      lastClientY = e.clientY

      // 添加拖拽开始的视觉反馈
      setTimeout(() => {
        draggedItem.classList.add("dragging")
        // 创建拖拽时的幽灵图像
        const ghostElement = draggedItem.cloneNode(true)
        ghostElement.style.opacity = "0.5"
        ghostElement.style.position = "absolute"
        ghostElement.style.top = "-1000px"
        document.body.appendChild(ghostElement)
        e.dataTransfer.setDragImage(ghostElement, 20, 20)
        setTimeout(() => document.body.removeChild(ghostElement), 0)
      }, 0)

      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", draggedItem.dataset.moduleId)
    }

    function handleDragEnd(e) {
      if (!draggedItem) return

      // 停止自动滚动
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
        autoScrollInterval = null
      }

      // 移除拖拽状态样式
      draggedItem.classList.remove("dragging")
      draggedItem = null

      // 移除所有占位符
      document.querySelectorAll(".accordion-item-placeholder").forEach((el) => el.remove())

      // 更新模块顺序
      updateModuleOrder()

      // 添加完成动画效果
      const items = container.querySelectorAll(".accordion-item")
      items.forEach((item, index) => {
        item.style.transition = "transform 0.3s ease"
        item.style.transform = "scale(1.02)"
        setTimeout(() => {
          item.style.transform = "scale(1)"
        }, 150)
      })
    }

    function handleDragOver(e) {
      e.preventDefault()
      if (!draggedItem) return

      lastClientY = e.clientY

      // 处理自动滚动
      handleAutoScroll(e)

      // 创建或获取占位符
      let placeholder = document.querySelector(".accordion-item-placeholder")
      if (!placeholder) {
        placeholder = document.createElement("div")
        placeholder.className = "accordion-item-placeholder"
      }

      const targetItem = e.target.closest(".accordion-item")

      if (targetItem && targetItem !== draggedItem) {
        const rect = targetItem.getBoundingClientRect()
        const midY = rect.top + rect.height / 2

        // 添加视觉指示，显示将放置在目标上方还是下方
        if (e.clientY < midY) {
          targetItem.classList.remove("drag-below")
          targetItem.classList.add("drag-above")
          container.insertBefore(placeholder, targetItem)
        } else {
          targetItem.classList.remove("drag-above")
          targetItem.classList.add("drag-below")
          container.insertBefore(placeholder, targetItem.nextSibling)
        }
      } else if (container.contains(e.target) && !targetItem) {
        // 如果拖拽到容器但不是在任何项目上，则添加到末尾
        container.appendChild(placeholder)
      }
    }

    function handleDragEnter(e) {
      e.preventDefault()
      if (e.target.classList.contains("accordion-item") && e.target !== draggedItem) {
        e.target.classList.add("drag-hover")
      }
    }

    function handleDragLeave(e) {
      if (e.target.classList.contains("accordion-item")) {
        e.target.classList.remove("drag-hover", "drag-above", "drag-below")
      }
    }

    function handleDrop(e) {
      e.preventDefault()
      if (!draggedItem) return

      // 停止自动滚动
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
        autoScrollInterval = null
      }

      // 移除所有拖拽相关的类
      document.querySelectorAll(".accordion-item").forEach((item) => {
        item.classList.remove("drag-hover", "drag-above", "drag-below")
      })

      const placeholder = document.querySelector(".accordion-item-placeholder")
      if (placeholder) {
        container.insertBefore(draggedItem, placeholder)
        placeholder.remove()
      }

      updateModuleOrder()
    }

    // 处理文档级别的拖拽，用于边界检测和自动滚动
    function handleDocumentDragOver(e) {
      if (!draggedItem) return
      e.preventDefault()

      // 更新最后的鼠标位置
      lastClientY = e.clientY
    }

    // 自动滚动功能
    function handleAutoScroll(e) {
      const containerRect = container.getBoundingClientRect()
      const scrollSensitivity = 60 // 滚动敏感区域高度
      const scrollSpeed = 5 // 滚动速度

      // 清除现有的自动滚动
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
        autoScrollInterval = null
      }

      // 检查是否在容器的顶部或底部边缘
      if (e.clientY < containerRect.top + scrollSensitivity) {
        // 向上滚动
        autoScrollInterval = setInterval(() => {
          container.scrollTop -= scrollSpeed
          // 模拟拖拽事件以更新占位符位置
          updatePlaceholderPosition()
        }, 16)
      } else if (e.clientY > containerRect.bottom - scrollSensitivity) {
        // 向下滚动
        autoScrollInterval = setInterval(() => {
          container.scrollTop += scrollSpeed
          // 模拟拖拽事件以更新占位符位置
          updatePlaceholderPosition()
        }, 16)
      }
    }

    // 更新占位符位置的辅助函数
    function updatePlaceholderPosition() {
      if (!draggedItem) return

      const placeholder = document.querySelector(".accordion-item-placeholder")
      if (!placeholder) return

      // 根据最后的鼠标位置找到目标元素
      const elementsAtPoint = document.elementsFromPoint(lastClientY, lastClientY)
      const targetItem = elementsAtPoint.find((el) => el.classList.contains("accordion-item") && el !== draggedItem)

      if (targetItem) {
        const rect = targetItem.getBoundingClientRect()
        const midY = rect.top + rect.height / 2

        if (lastClientY < midY) {
          container.insertBefore(placeholder, targetItem)
        } else {
          container.insertBefore(placeholder, targetItem.nextSibling)
        }
      }
    }

    // 绑定事件监听器
    container.addEventListener("dragstart", handleDragStart)
    container.addEventListener("dragend", handleDragEnd)
    container.addEventListener("dragover", handleDragOver)
    container.addEventListener("drop", handleDrop)
    container.addEventListener("dragenter", handleDragEnter)
    container.addEventListener("dragleave", handleDragLeave)
    document.addEventListener("dragover", handleDocumentDragOver)

    // 为拖拽手柄添加触摸反馈
    const dragHandles = document.querySelectorAll(".drag-handle")
    dragHandles.forEach((handle) => {
      handle.addEventListener("mousedown", () => {
        handle.closest(".accordion-item").classList.add("drag-ready")
      })
    })

    document.addEventListener("mouseup", () => {
      document.querySelectorAll(".drag-ready").forEach((item) => {
        item.classList.remove("drag-ready")
      })
    })
  }

  // 渲染预览
  renderPreview()

  // 导出PDF按钮
  document.getElementById("exportButton").addEventListener("click", () => {
    // 更新预览
    renderPreview()

    // 使用setTimeout确保内容完全渲染后再打印
    setTimeout(() => {
      window.print()
    }, 100)
  })

  // 添加模块下拉菜单
  const addModuleBtn = document.getElementById("add-module-btn")
  const moduleDropdown = document.getElementById("module-dropdown")

  addModuleBtn.addEventListener("click", () => {
    moduleDropdown.classList.toggle("show")
  })

  // 点击其他地方关闭下拉菜单
  window.addEventListener("click", (e) => {
    if (!e.target.matches("#add-module-btn") && !e.target.closest("#add-module-btn")) {
      moduleDropdown.classList.remove("show")
    }
  })

  // 添加模块
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      const moduleType = item.dataset.module

      // 关闭下拉菜单
      moduleDropdown.classList.remove("show")

      if (moduleType === "custom") {
        // 直接添加一个空的自定义模块
        addCustomModule()
      } else {
        // 添加预定义模块
        addModule(moduleType)
      }
    })
  })

  // 添加自定义模块的新函数
  function addCustomModule() {
    // 创建一个新的自定义模块
    const customModule = {
      title: "自定义模块",
      content: "",
      items: [],
      style: {
        layout: "list",
        spacing: "normal",
        textAlign: "left",
        textStyle: "normal",
        accentColor: "#3b82f6",
      },
    }

    // 添加到数据中
    resumeData.custom.push(customModule)

    // 添加到模块顺序
    const customId = `custom-${resumeData.custom.length - 1}`
    resumeData.moduleConfig.order.push(customId)
    resumeData.moduleConfig.visibility[customId] = true

    // 保存数据
    saveData()

    // 重新初始化模块
    initializeModules()

    // 找到新添加的模块并展开它
    setTimeout(() => {
      const modules = document.querySelectorAll(".accordion-item")
      const lastModule = modules[modules.length - 1]
      if (lastModule) {
        lastModule.classList.add("expanded")
      }
    }, 100)
  }

  // 修改创建自定义模块的函数
  function createCustomModuleContent(customIndex) {
    const customModule = resumeData.custom[customIndex]
    const container = document.createElement("div")
    container.className = "custom-module-editor"

    // 标题编辑
    const titleGroup = document.createElement("div")
    titleGroup.className = "form-group"

    const titleLabel = document.createElement("label")
    titleLabel.textContent = "模块标题"

    const titleInput = document.createElement("input")
    titleInput.type = "text"
    titleInput.value = customModule.title
    titleInput.placeholder = "输入模块标题"
    titleInput.addEventListener("input", (e) => {
      customModule.title = e.target.value
      // 更新模块标题显示
      const moduleTitle = e.target.closest(".accordion-item").querySelector(".module-title")
      if (moduleTitle) {
        moduleTitle.textContent = e.target.value
      }
      saveData()
    })

    titleGroup.appendChild(titleLabel)
    titleGroup.appendChild(titleInput)
    container.appendChild(titleGroup)

    // 样式设置
    const styleGroup = document.createElement("div")
    styleGroup.className = "form-group"

    const styleLabel = document.createElement("label")
    styleLabel.textContent = "样式设置"

    const styleGrid = document.createElement("div")
    styleGrid.className = "form-grid"

    // 布局选择
    const layoutGroup = document.createElement("div")
    layoutGroup.className = "form-group"

    const layoutLabel = document.createElement("label")
    layoutLabel.textContent = "布局"

    const layoutSelect = document.createElement("select")
    ;["list", "grid", "columns"].forEach((layout) => {
      const option = document.createElement("option")
      option.value = layout
      option.textContent = layout === "list" ? "列表布局" : layout === "grid" ? "网格布局" : "双列布局"
      option.selected = (customModule.style?.layout || "list") === layout
      layoutSelect.appendChild(option)
    })

    layoutSelect.addEventListener("change", (e) => {
      if (!customModule.style) customModule.style = {}
      customModule.style.layout = e.target.value
      saveData()
    })

    layoutGroup.appendChild(layoutLabel)
    layoutGroup.appendChild(layoutSelect)
    styleGrid.appendChild(layoutGroup)

    // 文本对齐
    const alignGroup = document.createElement("div")
    alignGroup.className = "form-group"

    const alignLabel = document.createElement("label")
    alignLabel.textContent = "文本对齐"

    const alignSelect = document.createElement("select")
    ;["left", "center", "right"].forEach((align) => {
      const option = document.createElement("option")
      option.value = align
      option.textContent = align === "left" ? "左对齐" : align === "center" ? "居中" : "右对齐"
      option.selected = (customModule.style?.textAlign || "left") === align
      alignSelect.appendChild(option)
    })

    alignSelect.addEventListener("change", (e) => {
      if (!customModule.style) customModule.style = {}
      customModule.style.textAlign = e.target.value
      saveData()
    })

    alignGroup.appendChild(alignLabel)
    alignGroup.appendChild(alignSelect)
    styleGrid.appendChild(alignGroup)

    // 文本样式
    const textStyleGroup = document.createElement("div")
    textStyleGroup.className = "form-group"

    const textStyleLabel = document.createElement("label")
    textStyleLabel.textContent = "文本样式"

    const textStyleSelect = document.createElement("select")
    ;["normal", "bold", "italic", "bold-italic"].forEach((style) => {
      const option = document.createElement("option")
      option.value = style
      option.textContent =
        style === "normal" ? "正常" : style === "bold" ? "粗体" : style === "italic" ? "斜体" : "粗斜体"
      option.selected = (customModule.style?.textStyle || "normal") === style
      textStyleSelect.appendChild(option)
    })

    textStyleSelect.addEventListener("change", (e) => {
      if (!customModule.style) customModule.style = {}
      customModule.style.textStyle = e.target.value
      saveData()
    })

    textStyleGroup.appendChild(textStyleLabel)
    textStyleGroup.appendChild(textStyleSelect)
    styleGrid.appendChild(textStyleGroup)

    // 强调颜色
    const colorGroup = document.createElement("div")
    colorGroup.className = "form-group"

    const colorLabel = document.createElement("label")
    colorLabel.textContent = "强调颜色"

    const colorWrapper = document.createElement("div")
    colorWrapper.className = "color-picker-wrapper"

    const colorInput = document.createElement("input")
    colorInput.type = "color"
    colorInput.value = customModule.style?.accentColor || "#3b82f6"

    const colorPreview = document.createElement("span")
    colorPreview.className = "color-preview"
    colorPreview.textContent = colorInput.value

    colorInput.addEventListener("input", (e) => {
      if (!customModule.style) customModule.style = {}
      customModule.style.accentColor = e.target.value
      colorPreview.textContent = e.target.value
      saveData()
    })

    colorWrapper.appendChild(colorInput)
    colorWrapper.appendChild(colorPreview)

    colorGroup.appendChild(colorLabel)
    colorGroup.appendChild(colorWrapper)
    styleGrid.appendChild(colorGroup)

    styleGroup.appendChild(styleLabel)
    styleGroup.appendChild(styleGrid)
    container.appendChild(styleGroup)

    // 子项管理
    const itemsGroup = document.createElement("div")
    itemsGroup.className = "form-group"

    const itemsLabel = document.createElement("div")
    itemsLabel.className = "form-group-header"
    itemsLabel.innerHTML = `
        <label>子项管理</label>
        <button class="button button-outline button-sm add-custom-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          添加子项
        </button>
      `

    const itemsContainer = document.createElement("div")
    itemsContainer.className = "custom-items-container"

    // 添加现有子项
    if (customModule.items && customModule.items.length > 0) {
      customModule.items.forEach((item, idx) => {
        const itemElement = createCustomItemElement(item, idx, customIndex)
        itemsContainer.appendChild(itemElement)
      })
    }

    // 添加子项按钮事件
    itemsLabel.querySelector(".add-custom-item").addEventListener("click", () => {
      const newItem = { title: "", content: "" }
      if (!customModule.items) customModule.items = []
      customModule.items.push(newItem)

      const itemElement = createCustomItemElement(newItem, customModule.items.length - 1, customIndex)
      itemsContainer.appendChild(itemElement)

      saveData()
    })

    itemsGroup.appendChild(itemsLabel)
    itemsGroup.appendChild(itemsContainer)
    container.appendChild(itemsGroup)

    return container
  }

  // 创建自定义子项元素
  function createCustomItemElement(item, itemIndex, customIndex) {
    const itemElement = document.createElement("div")
    itemElement.className = "custom-item"

    const itemHeader = document.createElement("div")
    itemHeader.className = "custom-item-header"

    const titleInput = document.createElement("input")
    titleInput.type = "text"
    titleInput.className = "custom-item-title"
    titleInput.placeholder = "子项标题"
    titleInput.value = item.title || ""

    titleInput.addEventListener("input", (e) => {
      resumeData.custom[customIndex].items[itemIndex].title = e.target.value
      saveData()
    })

    const removeButton = document.createElement("button")
    removeButton.className = "button-icon remove-custom-item"
    removeButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      `

    removeButton.addEventListener("click", () => {
      resumeData.custom[customIndex].items.splice(itemIndex, 1)
      itemElement.remove()
      saveData()
    })

    itemHeader.appendChild(titleInput)
    itemHeader.appendChild(removeButton)

    const contentTextarea = document.createElement("textarea")
    contentTextarea.className = "custom-item-content"
    contentTextarea.placeholder = "子项内容"
    contentTextarea.rows = 3
    contentTextarea.value = item.content || ""

    contentTextarea.addEventListener("input", (e) => {
      resumeData.custom[customIndex].items[itemIndex].content = e.target.value
      saveData()
    })

    itemElement.appendChild(itemHeader)
    itemElement.appendChild(contentTextarea)

    return itemElement
  }

  // 修改创建模块函数，整合自定义模块逻辑
  function createModule(moduleId) {
    const template = document.getElementById("module-template")
    const clone = document.importNode(template.content, true)

    const moduleElement = clone.querySelector(".accordion-item")
    const moduleTitle = clone.querySelector(".module-title")
    const moduleContent = clone.querySelector(".accordion-content")

    moduleElement.dataset.moduleId = moduleId

    // 设置模块标题
    if (moduleId.startsWith("custom-")) {
      const customIndex = Number.parseInt(moduleId.split("-")[1])
      if (customIndex >= resumeData.custom.length) {
        return null // 防止索引越界
      }
      moduleTitle.textContent = resumeData.custom[customIndex].title

      // 创建自定义模块内容编辑器
      const customContent = createCustomModuleContent(customIndex)
      moduleContent.appendChild(customContent)
    } else {
      moduleTitle.textContent = moduleNames[moduleId]

      // 根据模块类型设置内容
      switch (moduleId) {
        case "personalInfo":
          const personalTemplate = document.getElementById("personal-info-content")
          const personalContent = document.importNode(personalTemplate.content, true)

          // 设置初始值
          personalContent.querySelector(".name").value = resumeData.personalInfo.name
          personalContent.querySelector(".title").value = resumeData.personalInfo.title
          personalContent.querySelector(".email").value = resumeData.personalInfo.email
          personalContent.querySelector(".phone").value = resumeData.personalInfo.phone
          personalContent.querySelector(".location").value = resumeData.personalInfo.location
          personalContent.querySelector(".website").value = resumeData.personalInfo.website
          personalContent.querySelector(".summary").value = resumeData.personalInfo.summary

          // 添加事件监听器
          personalContent
            .querySelector(".name")
            .addEventListener("input", (e) => updatePersonalInfo("name", e.target.value))
          personalContent
            .querySelector(".title")
            .addEventListener("input", (e) => updatePersonalInfo("title", e.target.value))
          personalContent
            .querySelector(".email")
            .addEventListener("input", (e) => updatePersonalInfo("email", e.target.value))
          personalContent
            .querySelector(".phone")
            .addEventListener("input", (e) => updatePersonalInfo("phone", e.target.value))
          personalContent
            .querySelector(".location")
            .addEventListener("input", (e) => updatePersonalInfo("location", e.target.value))
          personalContent
            .querySelector(".website")
            .addEventListener("input", (e) => updatePersonalInfo("website", e.target.value))
          personalContent
            .querySelector(".summary")
            .addEventListener("input", (e) => updatePersonalInfo("summary", e.target.value))

          moduleContent.appendChild(personalContent)
          break

        case "education":
          const educationTemplate = document.getElementById("education-container")
          const educationContent = document.importNode(educationTemplate.content, true)
          const educationItems = educationContent.querySelector("#education-items")

          // 添加教育经历项
          resumeData.education.forEach((edu, index) => {
            const eduItem = createEducationItem(edu, index)
            educationItems.appendChild(eduItem)
          })

          // 添加按钮事件
          educationContent.querySelector(".add-education").addEventListener("click", () => {
            const newEdu = {
              school: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              description: "",
            }

            resumeData.education.push(newEdu)

            const eduItem = createEducationItem(newEdu, resumeData.education.length - 1)
            educationItems.appendChild(eduItem)

            saveData()
          })

          moduleContent.appendChild(educationContent)
          break

        case "experience":
          const experienceTemplate = document.getElementById("experience-container")
          const experienceContent = document.importNode(experienceTemplate.content, true)
          const experienceItems = experienceContent.querySelector("#experience-items")

          // 添加工作经验项
          resumeData.experience.forEach((exp, index) => {
            const expItem = createExperienceItem(exp, index)
            experienceItems.appendChild(expItem)
          })

          // 添加按钮事件
          experienceContent.querySelector(".add-experience").addEventListener("click", () => {
            const newExp = {
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
            }

            resumeData.experience.push(newExp)

            const expItem = createExperienceItem(newExp, resumeData.experience.length - 1)
            experienceItems.appendChild(expItem)

            saveData()
          })

          moduleContent.appendChild(experienceContent)
          break

        case "skills":
          const skillsTemplate = document.getElementById("skills-container")
          const skillsContent = document.importNode(skillsTemplate.content, true)
          const skillsItems = skillsContent.querySelector("#skills-items")

          // 添加技能项
          resumeData.skills.forEach((skill, index) => {
            const skillItem = createSkillItem(skill, index)
            skillsItems.appendChild(skillItem)
          })

          // 添加按钮事件
          skillsContent.querySelector(".add-skill").addEventListener("click", () => {
            const newSkill = { name: "", level: 50 }

            resumeData.skills.push(newSkill)

            const skillItem = createSkillItem(newSkill, resumeData.skills.length - 1)
            skillsItems.appendChild(skillItem)

            saveData()
          })

          moduleContent.appendChild(skillsContent)
          break

        case "projects":
          const projectsTemplate = document.getElementById("projects-container")
          const projectsContent = document.importNode(projectsTemplate.content, true)
          const projectsItems = projectsContent.querySelector("#projects-items")

          // 添加项目经验项
          resumeData.projects.forEach((project, index) => {
            const projectItem = createProjectItem(project, index)
            projectsItems.appendChild(projectItem)
          })

          // 添加按钮事件
          projectsContent.querySelector(".add-project").addEventListener("click", () => {
            const newProject = {
              name: "",
              description: "",
              link: "",
            }

            resumeData.projects.push(newProject)

            const projectItem = createProjectItem(newProject, resumeData.projects.length - 1)
            projectsItems.appendChild(projectItem)

            saveData()
          })

          moduleContent.appendChild(projectsContent)
          break

        default:
          return null
      }
    }

    // 添加删除模块按钮事件
    const removeButton = clone.querySelector(".remove-module")
    removeButton.addEventListener("click", () => {
      removeModule(moduleId)
    })

    return moduleElement
  }

  // 修改渲染预览函数，优化自定义模块的渲染
  function renderPreview() {
    const previewContainer = document.getElementById("resume-preview")
    const { personalInfo, education, experience, skills, projects, custom, moduleConfig } = resumeData

    let html = ""

    // 按照模块顺序和可见性渲染预览
    moduleConfig.order.forEach((moduleId) => {
      // 如果模块不可见，跳过
      if (!moduleConfig.visibility[moduleId]) {
        return
      }

      // 根据模块ID渲染对应内容
      if (moduleId.startsWith("custom-")) {
        const customIndex = Number.parseInt(moduleId.split("-")[1])
        if (customIndex < custom.length) {
          const customModule = custom[customIndex]
          const style = customModule.style || {}

          // 创建自定义模块的HTML
          let customHtml = `<div class="resume-section">
              <h2 class="resume-section-title">${customModule.title}</h2>`

          // 添加主要内容
          if (customModule.content) {
            customHtml += `<p style="text-align: ${style.textAlign || "left"};">${customModule.content}</p>`
          }

          // 添加子项
          if (customModule.items && customModule.items.length > 0) {
            // 根据布局类型设置不同的样式
            let itemsContainerClass = ""
            let itemsContainerStyle = ""

            if (style.layout === "grid") {
              itemsContainerClass = "resume-skills" // 使用技能网格样式
            } else if (style.layout === "columns") {
              itemsContainerClass = "custom-columns"
              itemsContainerStyle = "column-count: 2; column-gap: 1.5rem;"
            }

            // 添加间距样式
            if (style.spacing === "compact") {
              itemsContainerStyle += "gap: 0.5rem; margin-top: 0.5rem;"
            } else if (style.spacing === "relaxed") {
              itemsContainerStyle += "gap: 2rem; margin-top: 1.5rem;"
            } else {
              itemsContainerStyle += "gap: 1rem; margin-top: 1rem;"
            }

            customHtml += `<div class="${itemsContainerClass}" style="${itemsContainerStyle}">`

            customModule.items.forEach((item) => {
              const itemStyle = `color: ${style.accentColor || "var(--resume-primary)"}; text-align: ${style.textAlign || "left"};`

              customHtml += `<div class="custom-item" style="${itemStyle}">`

              if (item.title) {
                let titleStyle = ""
                if (style.textStyle === "bold" || style.textStyle === "bold-italic") {
                  titleStyle += "font-weight: bold;"
                }
                if (style.textStyle === "italic" || style.textStyle === "bold-italic") {
                  titleStyle += "font-style: italic;"
                }

                customHtml += `<h4 class="resume-item-title">${item.title}</h4>`
              }

              if (item.content) {
                customHtml += `<p class="resume-item-description">${item.content}</p>`
              }

              customHtml += `</div>`
            })

            customHtml += `</div>`
          }

          customHtml += `</div>`

          html += customHtml
        }
      } else {
        switch (moduleId) {
          case "personalInfo":
            html += `
          <div class="resume-header">
            <h1 class="resume-name">${personalInfo.name}</h1>
            <p class="resume-title">${personalInfo.title}</p>
            
            <div class="resume-contact">
              ${
                personalInfo.email
                  ? `
                <div class="resume-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>${personalInfo.email}</span>
                </div>
              `
                  : ""
              }
              
              ${
                personalInfo.phone
                  ? `
                <div class="resume-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>${personalInfo.phone}</span>
                </div>
              `
                  : ""
              }
              
              ${
                personalInfo.location
                  ? `
                <div class="resume-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>${personalInfo.location}</span>
                </div>
              `
                  : ""
              }
              
              ${
                personalInfo.website
                  ? `
                <div class="resume-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <span>${personalInfo.website}</span>
                </div>
              `
                  : ""
              }
            </div>
            
            ${
              personalInfo.summary
                ? `
              <p class="resume-summary">${personalInfo.summary}</p>
            `
                : ""
            }
          </div>
        `
            break

          case "experience":
            if (experience && experience.length > 0) {
              html += `
            <div class="resume-section">
              <h2 class="resume-section-title">工作经验</h2>
              <div class="resume-items">
                ${experience
                  .map(
                    (exp) => `
                  <div class="resume-item">
                    <div class="resume-item-header">
                      <div>
                        <h3 class="resume-item-title">${exp.position}</h3>
                        <p class="resume-item-subtitle">${exp.company}</p>
                      </div>
                      <p class="resume-item-date">${exp.startDate} - ${exp.endDate}</p>
                    </div>
                    <p class="resume-item-description">${exp.description}</p>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
            }
            break

          case "education":
            if (education && education.length > 0) {
              html += `
            <div class="resume-section">
              <h2 class="resume-section-title">教育经历</h2>
              <div class="resume-items">
                ${education
                  .map(
                    (edu) => `
                  <div class="resume-item">
                    <div class="resume-item-header">
                      <div>
                        <h3 class="resume-item-title">${edu.school}</h3>
                        <p class="resume-item-subtitle">${edu.degree} · ${edu.field}</p>
                      </div>
                      <p class="resume-item-date">${edu.startDate} - ${edu.endDate}</p>
                    </div>
                    <p class="resume-item-description">${edu.description}</p>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
            }
            break

          case "projects":
            if (projects && projects.length > 0) {
              html += `
            <div class="resume-section">
              <h2 class="resume-section-title">项目经验</h2>
              <div class="resume-items">
                ${projects
                  .map(
                    (project) => `
                  <div class="resume-item">
                    <h3 class="resume-item-title">${project.name}</h3>
                    ${
                      project.link
                        ? `
                      <a href="${project.link}" target="_blank" class="resume-project-link">${project.link}</a>
                    `
                        : ""
                    }
                    <p class="resume-item-description">${project.description}</p>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
            }
            break

          case "skills":
            if (skills && skills.length > 0) {
              html += `
            <div class="resume-section">
              <h2 class="resume-section-title">技能</h2>
              <div class="resume-skills">
                ${skills
                  .map(
                    (skill) => `
                  <div class="resume-skill">
                    <div class="resume-skill-header">
                      <span class="resume-skill-name">${skill.name}</span>
                      <span class="resume-skill-level">${skill.level}%</span>
                    </div>
                    <div class="resume-skill-bar">
                      <div class="resume-skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
            }
            break
        }
      }
    })

    previewContainer.innerHTML = html
  }

  function updateModuleOrder() {
    const resumeModules = document.getElementById("resume-modules")
    const modules = Array.from(resumeModules.children)
    resumeData.moduleConfig.order = modules.map((module) => module.dataset.moduleId)
    saveData()
  }

  // 确保一开始就调用 initializeModules，且末尾再次调用
  initializeModules()
})

