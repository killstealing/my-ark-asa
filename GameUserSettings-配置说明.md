# GameUserSettings.ini 配置节说明（除 ServerSettings）

---

## 1. `[ScalabilityGroups]` — 可扩展性组（画质预设）

客户端本地画质设置，与服务器无关。数值 0=低，1=中，2=高，3=史诗。

| 参数 | 含义 |
|------|------|
| sg.ResolutionQuality | 分辨率缩放质量 |
| sg.ViewDistanceQuality | 视野距离质量 |
| sg.AntiAliasingQuality | 抗锯齿质量 |
| sg.ShadowQuality | 阴影质量 |
| sg.GlobalIlluminationQuality | 全局光照质量 |
| sg.ReflectionQuality | 反射质量 |
| sg.PostProcessQuality | 后期处理质量 |
| sg.TextureQuality | 纹理质量 |
| sg.EffectsQuality | 特效质量 |
| sg.FoliageQuality | 植被质量 |
| sg.ShadingQuality | 着色质量 |
| sg.LandscapeQuality | 地形质量 |

---

## 2. `[/Script/ShooterGame.ShooterGameUserSettings]` — 游戏用户设置（客户端偏好）

最大的配置节，包含所有游戏客户端的个性化设置。

### 🎵 音频类

| 参数 | 含义 |
|------|------|
| MasterAudioVolume | 主音量 |
| MusicAudioVolume | 音乐音量 |
| SFXAudioVolume | 音效音量 |
| VoiceAudioVolume | 语音音量 |
| SoundUIAudioVolume | UI 音效音量 |
| CharacterAudioVolume | 角色音量 |
| AmbientSoundVolume | 环境音音量 |
| DisableMenuMusic | 禁用菜单音乐 |
| DisableLoadScreenMusic | 禁用加载界面音乐 |
| PlayActionWheelClickSound | 动作轮盘点击音效 |
| PlayHUDRolloverSound | HUD 悬停音效 |
| bPreventInventoryOpeningSounds | 禁用物品栏开启音效 |
| bPreventItemCraftingSounds | 禁用制作音效 |

### 🖥️ 显示/画面类

| 参数 | 含义 |
|------|------|
| GraphicsQuality | 整体画质等级（0=低） |
| ResolutionSizeX / ResolutionSizeY | 分辨率 |
| FullscreenMode | 全屏模式（1=窗口化全屏） |
| VSyncModeType / bUseVSync | 垂直同步 |
| FrameRateLimit | 帧率上限 |
| TheGammaCorrection | 伽马校正 |
| Gamma1 / Gamma2 | 伽马值（低/高） |
| bFilmGrain | 胶片颗粒效果 |
| bUserMotionBlur | 动态模糊 |
| bEnableLowLightEnhancement | 低光增强 |
| bDisableBloom | 禁用泛光 |
| bDisableLightShafts | 禁用光轴 |
| bDisableShadows | 禁用阴影 |
| bDistanceFieldShadowing | 距离场阴影 |
| FOVMultiplier | 视野倍数 |
| bTemperatureF | 温度单位（True=华氏度，False=摄氏度） |
| TrueSkyQuality | 真实天空质量 |
| GroundClutterDensity | 地面杂物密度 |
| GroundClutterRadius | 地面杂物半径 |
| LODScalar | LOD 缩放 |
| HighQualityMaterials | 高质量材质 |
| HighQualitySurfaces | 高质量表面 |
| bHighQualityLODs | 高质量 LOD |
| bHighQualityAnisotropicFiltering | 高质量各向异性过滤 |
| bExtraLevelStreamingDistance | 额外关卡流送距离 |
| bEnableColorGrading | 色彩分级 |
| bUseDFAO | 使用 DFAO |
| bUseSSAO | 使用 SSAO |
| bUseDistanceFieldAmbientOcclusion | 距离场环境光遮蔽 |
| bUseLowQualityLevelStreaming | 低质量关卡流送 |
| bEnableFluidInteraction | 流体交互 |
| bDisableHLOD | 禁用 HLOD |
| bCinematicLightingMode | 电影光照模式 |
| GUI3DWidgetQuality | 3D 控件质量 |
| FoliageInteractionDistance | 植被交互距离 |
| FoliageInteractionDistanceLimit | 植被交互距离上限 |
| FoliageInteractionQuantityLimit | 植被交互数量上限 |
| BubbleParticlesMultiplier | 气泡粒子倍率 |
| bShowAmbientInsectsVFX | 环境昆虫特效 |
| bEnableFootstepDecals | 脚印贴花 |
| bEnableFootstepParticles | 脚印粒子 |
| bNoBloodEffects | 无血效果 |
| bLowQualityVFX | 低质量特效 |
| bDisablePaintings | 禁用画布渲染 |

### 🎮 操作/视角类

| 参数 | 含义 |
|------|------|
| bFirstPersonRiding | 骑乘时第一人称 |
| bFirstPersonShipDriving | 开船时第一人称 |
| bThirdPersonPlayer | 第三人称玩家 |
| CameraShakeScale | 镜头震动强度 |
| LookLeftRightSensitivity | 左右视角灵敏度 |
| LookUpDownSensitivity | 上下视角灵敏度 |
| bInvertLookY | Y 轴反转 |
| bCameraViewBob | 镜头晃动 |
| bToggleToTalk | 按键说话（False=自由麦） |
| bVibration | 手柄震动 |
| bUIVibration | UI 震动 |
| bFPVClimbingGear | 第一人称攀爬装备视角 |
| bFPVGlidingGear | 第一人称滑翔装备视角 |
| bEnableASACamera | ASA 相机模式 |
| bForceTPVCameraOffset | 强制第三人称相机偏移 |
| bDisableTPVCameraInterpolation | 禁用第三人称相机插值 |
| CurrentCameraModeIndex | 当前相机模式索引 |
| CurrentDinoCameraModeIndex | 当前骑乘恐龙相机模式 |
| TPVCameraHorizontalOffsetFactor | 第三人称水平偏移系数 |
| bUseOldThirdPersonCameraTrace | 旧版第三人称相机射线 |
| bUseOldThirdPersonCameraOffset | 旧版第三人称相机偏移 |
| radialSelectionSpeed | 径向菜单选择速度 |
| bUseGamepadAimAssist | 手柄辅助瞄准 |

### 💬 UI/HUD 类

| 参数 | 含义 |
|------|------|
| UIScaling | UI 缩放 |
| UIQuickbarScaling | 快捷栏缩放 |
| bShowFloatingNames | 显示浮动名字 |
| bHideFloatingPlayerNames | 隐藏玩家浮动名字 |
| bChatBubbles | 聊天气泡 |
| bTextChatBubbles | 文字聊天气泡 |
| bHideServerInfo | 隐藏服务器信息 |
| bJoinNotifications | 加入通知 |
| bShowStatusNotificationMessages | 状态通知消息 |
| bForceShowItemNames | 强制显示物品名 |
| HideItemTextOverlay | 隐藏物品文字覆盖 |
| bMinimalUI | 极简 UI 模式 |
| bShowChatBox | 显示聊天框 |
| bForceShowRadialWheelTexts | 强制显示径向菜单文字 |
| bHideStructurePlacementCrosshair | 隐藏结构放置准星 |
| bShowInfoButtons | 显示信息按钮 |
| bHideGamepadItemSelectionModifier | 隐藏手柄物品选择修饰 |
| bToggleExtendedHUDInfo | 切换扩展 HUD 信息 |
| bShowRTSKeyBinds | 显示 RTS 快捷键 |
| FloatingTooltipStructureMode | 建筑浮动提示模式 |
| FloatingTooltipDinoMode | 恐龙浮动提示模式 |
| FloatingTooltipDroppedItemsMode | 掉落物品浮动提示模式 |
| FloatingTooltipPlayerMode | 玩家浮动提示模式 |
| TopNotificationMode | 顶部通知模式 |
| ItemNotificationMode | 物品通知模式 |
| HideEnemyStructureCosmeticsMode | 隐藏敌方建筑装饰模式 |
| bMinimapOverlayUseLowOpacity | 小地图低透明度 |
| bChatShowSteamName | 聊天显示 Steam 名 |
| bChatShowTribeName | 聊天显示部落名 |
| bReverseTribeLogOrder | 反转部落日志顺序 |
| TextChatFilterType | 文字聊天过滤类型 |
| VoiceChatFilterType | 语音聊天过滤类型 |
| bSpectatorManualFloatingNames | 观察者手动浮动名字 |
| bSuppressAdminIcon | 隐藏管理员图标 |

### 🗺️ 地图相关

| 参数 | 含义 |
|------|------|
| bShowPingsOnMap | 地图显示标记 |
| bShowDinosOnMap | 地图显示恐龙 |
| bShowWaypointsOnMap | 地图显示路径点 |
| bShowPlayersOnMap | 地图显示玩家 |
| bShowBedsOnMap | 地图显示床 |
| bShowMissionsOnMap | 地图显示任务 |
| bAutomaticallyCreateWaypointOnTamingCreatures | 驯养中自动标记路径点 |
| bAutomaticallyCreatePOIOnDeath | 死亡自动标记兴趣点 |
| MaxLastDeathMark | 最多死亡标记数 |
| bSaveLastDeathMark | 保存死亡标记 |
| SavedMainMapZoom | 主地图缩放级别 |
| SavedOverlayMapZoom | 覆盖地图缩放级别 |

### 🎒 物品栏相关

| 参数 | 含义 |
|------|------|
| bCraftablesShowAllItems | 可制作显示全部物品 |
| bLocalInventoryItemsShowAllItems | 本地物品显示全部 |
| bLocalInventoryCraftingShowAllItems | 本地制作显示全部 |
| bRemoteInventoryItemsShowAllItems | 远程物品显示全部 |
| bRemoteInventoryCraftingShowAllItems | 远程制作显示全部 |
| bCustomCosmeticsShowAllItems | 自定义装饰显示全部 |
| bRemoteInventoryShowEngrams | 远程物品栏显示印痕 |
| bRemoteInventoryShowCraftables | 远程物品栏显示可制作 |
| bEnableInventoryItemTooltips | 物品提示框 |
| bNoTooltipDelay | 无提示延迟 |
| LocalItemSortType | 本地物品排序类型 |
| LocalCraftingSortType | 本地制作排序类型 |
| RemoteItemSortType | 远程物品排序类型 |
| RemoteCraftingSortType | 远程制作排序类型 |
| FilterTypeInventoryLocal | 本地物品栏过滤类型 |
| FilterTypeInventoryRemote | 远程物品栏过滤类型 |
| FilterTypeCustomCosmeticItems | 自定义装饰物品过滤 |
| FilterTypeCustomCosmeticSkins | 自定义装饰皮肤过滤 |

### 🔫 准星/战斗类

| 参数 | 含义 |
|------|------|
| ServerCrosshair | 服务器准星 |
| ShowFloatingDamageText | 浮动伤害数字 |
| AllowHitMarkers | 命中标记 |
| CrosshairScale | 准星大小 |
| CrosshairOpacity | 准星透明度 |
| CrosshairColor | 准星颜色 |
| CrosshairColorOverEnemy | 瞄准敌人时准星颜色 |
| CrosshairColorOverAlly | 瞄准友方时准星颜色 |
| CrosshairColorHitmark | 命中标记颜色 |
| bDisableMeleeCameraSwingAnims | 禁用近战镜头摆动动画 |
| AimAssistStrengthMultiplier | 辅助瞄准强度 |

### 🧬 DLSS/FSR/超分辨率

| 参数 | 含义 |
|------|------|
| EnableDLSS | DLSS（-1=禁用） |
| bEnableDLFG | DLSS 帧生成 |
| SuperResolutionQualityLevel | 超分辨率质量 |
| bEnableReflex | NVIDIA Reflex |
| bUseDynamicResolution | 动态分辨率 |

### 🌈 HDR/色彩

| 参数 | 含义 |
|------|------|
| bEnableHDROutput | HDR 输出 |
| HDRDisplayMinLuminance | HDR 最低亮度 |
| HDRDisplayMidLuminance | HDR 中间亮度 |
| HDRDisplayMaxLuminance | HDR 最高亮度 |
| bOCIOIsEnabled | OCIO 色彩管理 |
| OCIOAsset | OCIO 配置文件 |
| OCIOColorSpace | OCIO 色彩空间 |
| OCIODisplayView | OCIO 显示视图 |

### 🤖 同伴/助手反应

| 参数 | 含义 |
|------|------|
| CompanionReactionVerbosity | 同伴反应详细度（级别 0-3） |
| EnableEnvironmentalReactions | 环境反应 |
| EnableRespawnReactions | 重生反应 |
| EnableDeathReactions | 死亡反应 |
| EnableSayHelloReactions | 打招呼反应 |
| EnableEmoteReactions | 表情反应 |
| EnableMovementSounds | 移动音效 |
| CompanionSubtitleVerbosityLevel | 同伴字幕详细度 |
| CompanionIsHiddenState | 隐藏同伴 |
| DisableSubtitles | 禁用字幕 |
| ShowExplorerNoteSubtitles | 探索笔记字幕 |
| StopExplorerNoteAudioOnClose | 关闭时停止笔记音频 |

### 📷 照片模式

| 参数 | 含义 |
|------|------|
| PhotomodePresets_Camera | 相机预设 |
| PhotomodePresets_Movement | 移动预设 |
| PhotomodePresets_Splines | 样条预设 |
| PhotomodePresets_PPs | 后期处理预设 |
| PhotomodePresets_Targeting | 目标预设 |
| PhotomodeLastUsedSettings | 上次使用设置 |

### 🌐 网络/服务器浏览

| 参数 | 含义 |
|------|------|
| ClientNetQuality | 客户端网络质量 |
| LastServerSearchType | 上次服务器搜索类型 |
| LastServerSort | 上次服务器排序方式 |
| LastPVESearchType | 上次 PvE 搜索类型 |
| LastDLCTypeSearchType | 上次 DLC 类型搜索 |
| LastServerSortAsc | 上次排序升序 |
| LastAutoFavorite | 上次自动收藏 |
| ShowPlayerServers | 显示玩家服务器 |
| LastServerSearchHideFull | 隐藏满员服务器 |
| LastServerSearchProtected | 搜索密码保护服务器 |
| LastPlatformSpecificServerSearch | 平台特定服务器搜索 |
| LastJoinedSessionPerCategory | 各分类上次加入的会话 |
| LastSessionCategoryJoined | 上次加入的会话分类 |
| VersionMetaTag | 版本元标签 |

### ⚙️ 杂项

| 参数 | 含义 |
|------|------|
| bHasSavedGame | 有存档 |
| bHasStartedTheGameOnce | 已启动过游戏 |
| bHasSetupDifficultySP | 已设置单人难度 |
| bHasSetupVisualSettings | 已设置视觉选项 |
| bDisableMenuTransitions | 禁用菜单过渡动画 |
| bDisableVirtualKeyboard | 禁用虚拟键盘 |
| DynamicDownloadSpeed | 动态下载速度 |
| SelectedMainMenuIntro | 主菜单开场动画选择 |
| MaxAscensionLevel | 最高飞升等级 |
| bHostSessionHasBeenOpened | 主机会话已开启 |
| bDisableDefaultCharacterItems | 禁用默认角色物品 |
| bDisableCosmeticsDynamicDownloading | 禁用装饰动态下载 |
| bRequestDefaultCharacterItemsOnce | 仅请求一次默认角色物品 |
| bReceiveDiscordNotifications | 接收 Discord 通知 |
| bReceiveDiscordFriendRequests | 接收 Discord 好友请求 |
| EmoteKeyBind1 / EmoteKeyBind2 | 表情快捷键绑定 |
| bUseSimpleDistanceMovement | 使用简单距离移动 |
| ScreenPercentage | 屏幕百分比 |
| bUseGamepadSpeaker | 使用手柄扬声器 |
| FrameMultiplier | 帧倍数 |
| WindowPosX / WindowPosY | 窗口位置 |
| DesiredScreenWidth / DesiredScreenHeight | 期望的屏幕尺寸 |
| LastCPUBenchmarkResult | 上次 CPU 基准测试结果 |
| LastGPUBenchmarkResult | 上次 GPU 基准测试结果 |
| LastGPUBenchmarkMultiplier | 上次 GPU 基准测试倍率 |
| bHasRunAutoSettings | 已运行自动设置 |
| bHasInitializedScreenPercentage | 已初始化屏幕百分比 |
| PreventDetailGraphics | 阻止详细画质 |

---

## 3. `[/Script/Engine.GameUserSettings]` — 引擎级用户设置

| 参数 | 含义 |
|------|------|
| bUseDesiredScreenHeight | 是否使用"期望的屏幕高度"来覆盖分辨率（False=使用实际分辨率） |

---

## 4. `[Startup]` — 启动技术选项

控制启动时的升频和帧生成技术（DLSS / FSR / XeSS）。

| 参数 | 含义 |
|------|------|
| FrameGenerationMethod | 帧生成方式（-1=自动/禁用） |
| FrameGenerationMultiplier | 帧生成倍数 |
| SuperResolutionSystem | 超分辨率系统（-1=自动） |
| FSRQualityMode | FSR 质量模式 |
| DLSSQualityMode | DLSS 质量模式 |
| ReflexEnabled | NVIDIA Reflex（-1=自动） |

---

## 5. `[SessionSettings]` — 会话设置

| 参数 | 含义 |
|------|------|
| SessionName | 服务器/会话名称（含地图名，如"方舟吴彦祖-孤岛"表示地图为 The Island） |

---

## 6. `[/Script/Engine.GameSession]` — 游戏会话

| 参数 | 含义 |
|------|------|
| MaxPlayers | 最大玩家数（当前 70 人） |

---

## 7. `[AwesomeTeleporters]` — Awesome Teleporters 模组配置

传送器模组的配置节。

| 参数 | 含义 |
|------|------|
| AdminsSeeAllTeleporters | 管理员可见所有传送器 |
| AllowLastRemoteLocation | 允许回到上次远程位置 |
| AllowTeleportingToPlayers | 允许传送到玩家 |
| AllowTeleportingToObelisks | 允许传送到方尖碑 |
| AllowTeleportingWildDinos | 允许传送野生恐龙 |
| AllowTeleportersOnSaddles | 允许平台鞍上传送器 |
| TeleportersAreTransmitters | 传送器可作为上传终端 |
| AllowTeleportingVehicles | 允许传送载具 |
| TeleportersRequirePower | 传送器需要电力 |
| AllowTeleportingOutOfPreventionZones | 允许从禁传区传出 |
| AllowTeleportingIntoPreventionZones | 允许传入禁传区 |
| AllowCorpseFinder | 允许尸体查找器功能 |
| CorpseRequiresRemote | 尸体查找需要遥控器 |
| AllowFindDinos | 允许查找恐龙 |
| MeshDetection | 网格检测 |
| BubbleDuration | 传送气泡持续时间（秒） |

---

## 8. `[DerDinoFinder]` — Der Dino Finder 模组配置

恐龙查找模组的配置节。

| 参数 | 含义 |
|------|------|
| AllowClientLanguage | 允许客户端使用自己的语言显示 |

---

## 总览

| 配置节 | 类型 | 用途 |
|--------|------|------|
| `[ServerSettings]` | 服务器 | 服务器核心规则 |
| `[ScalabilityGroups]` | 客户端 | 画质分级预设 |
| `[ShooterGameUserSettings]` | 客户端 | 游戏个性化（音画/操作/UI/HUD/地图/同伴等） |
| `[Engine.GameUserSettings]` | 客户端 | 引擎级分辨率设置 |
| `[Startup]` | 客户端 | DLSS/FSR/超分辨率/帧生成 |
| `[SessionSettings]` | 服务器 | 会话名称 |
| `[GameSession]` | 服务器 | 最大玩家数 |
| `[AwesomeTeleporters]` | 模组 | Awesome Teleporters 传送器模组 |
| `[DerDinoFinder]` | 模组 | Der Dino Finder 恐龙查找模组 |

> **注意**：`[ScalabilityGroups]`、`[ShooterGameUserSettings]`、`[Engine.GameUserSettings]`、`[Startup]` 这 4 个节属于**客户端本地设置**。如果只配置服务器端，这些节可以忽略，不影响其他玩家的游戏体验。
