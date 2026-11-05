# Strapi 内容字段说明（Global Product Blocks / 分类 / 产品）

> 更新时间：2026-11-05
> 对应前端实现：`composables/useProductDetail.ts`、`components/ProductSharedBlocks.vue`、`pages/products/[slug].vue`

这些字段全部服务**产品详情页**（`/products/xxx`），分「全站共用」「分类覆盖」「产品专属」三级。在 Strapi 后台对应三张表：

- **Global Product Blocks**（全站共用块，只有一条记录，改一次全站生效）
- **产品分类表**（每个运动类别一条）
- **产品表**（每个产品一条）

---

## 一、Global Product Blocks（全站共用块）

| 字段 | 作用 | 出现位置 | 可被覆盖？ |
|---|---|---|---|
| **specDefaults** (8) | 全站默认参数表 8 行（所有产品共有的规格）。优先级**最低**：产品/分类有同名行就不显示这条 | 详情页 Specifications 参数表 | ✅ 产品、分类 |
| **craftTitle** | 工艺/面料区标题（默认 "Craft & Fabric"） | Craft & Fabric 区块标题 | ✅ 分类 |
| **craftBody** | 工艺/面料区正文介绍 | Craft & Fabric 区块正文 | ✅ 分类 |
| **craftImages** | 工艺/面料配图。**只取全站这一份**，分类和产品都不能覆盖 | Craft & Fabric 区块配图 | ❌ 仅全站 |
| **certifications** | 认证资质（证书名 + 描述 + 扫描件图片，可多条） | Certifications & Compliance 区，图片可点击放大 | ❌ 仅全站 |
| **clients** | 客户品牌墙（logo + 名称） | Trusted by Global Brands 区 | ❌ 仅全站 |
| **factoryShots** | 工厂实拍图（图片 + caption）。**第 1 张兼作工厂视频封面** | Factory 图片墙 + 视频封面 | ❌ 仅全站 |
| **infoBlocks** | 付款/物流/包装说明（标题 + 正文 + 图片，渲染成折叠面板） | Payment, Shipping & Packaging 区 | ❌ 仅全站 |
| **tradeTerms** | 贸易条款正文（富文本） | Terms & FAQ 区上半部分 | ❌ 仅全站 |
| **detailFaqs** | 产品页常见问答（问题 + 答案，可多条） | Terms & FAQ 区下半部分；同时生成 **FAQPage 结构化数据**给 Google（有机会出富摘要） | ❌ 仅全站 |

## 二、产品分类表（每个运动类别一条）

| 字段 | 作用 | 出现位置 | 覆盖关系 |
|---|---|---|---|
| **specRows** (0) | 该分类的默认参数表。0 = 没填（当前状态） | Specifications 参数表 | 覆盖全站 specDefaults，被产品 specRows 覆盖 |
| **craftTitle** | 分类级工艺标题——篮球服和瑜伽服可写不同介绍 | Craft & Fabric 标题 | 覆盖全站 craftTitle |
| **craftBody** | 分类级工艺正文 | Craft & Fabric 正文 | 覆盖全站 craftBody |

## 三、产品表（每个产品一条）

| 字段 | 作用 | 出现位置 | 覆盖关系 |
|---|---|---|---|
| **specRows** (0) | 产品自己的参数表，优先级**最高**。填了会同时写入 Google 结构化数据（additionalProperty） | Specifications 参数表 + 搜索引擎富摘要 | 覆盖分类和全站的同名行 |

---

## 核心逻辑：参数表三级继承

```
Specifications 表格 = 产品 specRows（最优先）
                    ⊕ 分类 specRows（补产品没写的行）
                    ⊕ 全站 specDefaults（再补剩下的）
                    ⊕ Material（从产品自身字段自动推导，仅当有值）
```

- 规则：**同一行标签（label）只显示优先级最高的那条**，不会重复两行（label 大小写不敏感）
- 空标签或空值的行会被自动丢弃

### 推荐填法

| 层级 | 填什么 | 举例 |
|---|---|---|
| 全站 specDefaults | 所有产品通用的 8 条（已填） | Sample Time、Custom Process、Port 等 |
| 分类 specRows | 该类产品说法不同的项 | 瑜伽服的 Fabric 和篮球服不同时 |
| 产品 specRows | 个别产品的特殊参数 | 某款用了特殊涂层的面料 |

当前状态：只填了全站 8 条，分类和产品都是 0，所以每个产品页显示 = 全站 8 条 + 产品自身 Material 一行（有值时）。

---

## 注意事项

1. **craftImages / certifications / clients / factoryShots / infoBlocks / tradeTerms / detailFaqs 只有全站版**，想改内容直接改 Global Product Blocks 这一条记录。
2. 某个区块在后台**没填内容时页面自动隐藏**该区块（不会显示空标题），也不会报错。
3. detailFaqs 填了之后，Google Search Console 里可以用「网址检查 → 请求编入索引」加速富摘要生效。
4. 参数表 label 请保持简短统一（如 `Fabric`、`MOQ`），同名 label 在不同层级会被去重。
