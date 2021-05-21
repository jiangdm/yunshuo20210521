//资产详情

//评估资产详情
const Assessment = r => require(["../views/blockchain/asset_details/assessment"], r);
//分红
// const AssetProfit = r => require(['../views/blockchain/asset_details/asset_profit'], r);
//全部类型
// const Categories = r => require(['../views/blockchain/asset_details/categories'], r);
//报告详情
const AssetNotices = r => require(["../views/blockchain/asset_details/asset_notices"], r);
//数字资产
// const DigitalAsset = r => require(['../views/blockchain/asset_details/digital_asset'], r);
//财务
// const Finance = r => require(['../views/blockchain/asset_details/finance'], r);
//简况
const AssetIntroduction = r => require(["../views/blockchain/asset_details/introduction"], r);
//报告和公告详情
const DetailReport = r => require(["../views/blockchain/asset_details/report"], r);
//我要销售
const AssetSale = r => require(["../views/blockchain/asset_details/sale"], r);

//我的资产

//认购记录、激活、奖励、买卖记录、转让记录、分红记录
const BuyingRecord = r => require(["../views/blockchain/my_asset/buying_record"], r);
//查看资产
const CheckAsset = r => require(["../views/blockchain/my_asset/check_asset"], r);
//进出记录
const IncomeRecord = r => require(["../views/blockchain/my_asset/income_record"], r);
//我的资产
const MyAsset = r => require(["../views/blockchain/my_asset/my_asset"], r);
//我的秘钥
const SecretKey = r => require(["../views/blockchain/my_asset/secret_key"], r);
//交易密码
const SetPassword = r => require(["../views/blockchain/my_asset/set_password"], r);
//转让
const AssetTrans = r => require(["../views/blockchain/my_asset/transfer"], r);
//交易详情（买入详情..）
const TransactionDetails = r => require(["../views/blockchain/my_asset/transaction_details"], r);

//交易大厅主页

//区块链-资产数字化
const TransHome = r => require(["../views/blockchain/transaction/home"], r);
//资产分类
const AssetClassify = r => require(["../views/blockchain/transaction/asset_classify"], r);
//认购买入
const Buying = r => require(["../views/blockchain/transaction/buying"], r);
//咨询公告
const TransNotice = r => require(["../views/blockchain/transaction/notice"], r);
//分类搜索列表
const ClassifiedSearch = r => require(["../views/blockchain/transaction/classified_search"], r);
//交易大厅
// const TradingHall = r => require(["../views/blockchain/transaction/trading_hall"], r);

//名片

//名片中心
const CardCenter = r => require(["../views/business_card/card_center"], r);
//名片角色
const BusinessCard = r => require(["../views/business_card/business_card"], r);
//名片动作
const Card_Action = r => require(["../views/business_card/card_action"], r);
//名片码
const CardCode = r => require(["../views/business_card/card_code"], r);
//名片收藏
const CardCollect = r => require(["../views/business_card/card_collect"], r);
//名片足迹
const CardFootprint = r => require(["../views/business_card/card_footprint"], r);
//名片选择商品
const CardGoods = r => require(["../views/business_card/card_goods"], r);
//名片排行
const CardRanking = r => require(["../views/business_card/card_ranking"], r);
//名片图片
const CardVisit = r => require(["../views/business_card/card_visit"], r);
//编辑名片
const EditCard = r => require(["../views/business_card/edit_card"], r);

// 渠道商
const distributorIndex = r => require(["../views/distributor/index"], r);
// 累计收入
const accumulatedIncome = r => require(["../views/distributor/accumulated_income"], r);
// 推荐升级
const recommendUp = r => require(["../views/distributor/recommendUp"], r);
// 提交推荐升级
const submitRecommend = r => require(["../views/distributor/submitRecommend"], r);
// 我的库存
const myRepertory = r => require(["../views/distributor/my_repertory"], r);
// 订货
const orderGoods = r => require(["../views/distributor/order_goods"], r);
// 发货
const deliverGoods = r => require(["../views/distributor/deliver_goods"], r);
// 发货下一步
const deliverGoodsNext = r => require(["../views/distributor/deliver_goods_next"], r);
// 下单
const placeOrder = r => require(["../views/distributor/place_order"], r);
// 换货
const exchangeGoods = r => require(["../views/distributor/exchange_goods"], r);
// 换货详情
const exchangeDetail = r => require(["../views/distributor/exchange_detail"], r);
// 兑换券
const exchangeTicket = r => require(["../views/distributor/exchange_ticket"], r);
// 我的下线客户
const myReferrals = r => require(["../views/distributor/my_referrals"], r);
// 我的换货
const myExchange = r => require(["../views/distributor/my_exchange"], r);
// 客户订单 我的发货  我的补货
const clientOrder = r => require(["../views/distributor/client_order"], r);
// 订单详情
const DisOrderDetail = r => require(["../views/distributor/order_detail"], r);
// 订货换货
const bookingChange = r => require(["../views/distributor/booking_change"], r);
//库存明细
const distributor_stock = r => require(["../views/distributor/distributor_stock"], r);
//客户订货详情
// const dis_order_datail = r => require(['../views/distributor/dis_order_datail'], r);
//购物车
const exchangeCart = r => require(["../views/distributor/cart"], r);
const distributorRank = r => require(["../views/distributor/distributor_rank"], r);
const estimatedIncome = r => require(["../views/distributor/estimated_income"], r);
const estimatedIncomeDetail = r => require(["../views/distributor/estimated_income_detail"], r);

//直播Live
//直播助手
const helperLiveList = r => require(["../views/live/helper_liveList"], r);
//直播助手直播间
const helperLiveRoom = r => require(["../views/live/helper_liveRoom"], r);
//主播申请
const anchorApply = r => require(["../views/live/anchorApply"], r);
//主播个人中心
const anchorDetail = r => require(["../views/live/anchorDetail"], r);
//直播列表
const liveList = r => require(["../views/live/liveList"], r);
//直播页
const livePage = r => require(["../views/live/livePage"], r);
//直播预告
const foreshow = r => require(["../views/live/foreshow"], r);
//直播主播分红
const liveDividend = r => require(["../views/live/liveDividend"], r);
//粉丝列表
const liveFanList = r => require(["../views/live/liveFanList"], r);

//精英奖
const eliteAwardHome = r => require(["../views/member/eliteAward/eliteAward_home"], r);
const eliteAwardRecord = r => require(["../views/member/eliteAward/eliteAward_record"], r);
const eliteAwardRank = r => require(["../views/member/eliteAward/eliteAward_rank"], r);

//安装服务（绿象）
const workerApply = r => require(["../views/member/install_service/worker_apply"], r);
const workerOrderlist = r => require(["../views/member/install_service/worker_orderlist"], r);
const workerOrderDetail = r => require(["../views/member/install_service/worker_orderDetail"], r);
const userOrderlist = r => require(["../views/member/install_service/user_orderlist"], r);
const userOrderDetail = r => require(["../views/member/install_service/user_orderDetail"], r);
const installIncome = r => require(["../views/member/install_service/install_income"], r);

//抢团
const grab_group_home = r => require(["../views/goods/grab_group/grab_group_home"], r);
const grab_group_my = r => require(["../views/goods/grab_group/grab_group_my"], r);
const grab_group_my_record = r => require(["../views/goods/grab_group/grab_group_my_record"], r);
const grab_group_reward = r => require(["../views/goods/grab_group/grab_group_reward"], r);
const grab_group = r => require(["../views/goods/grab_group/grab_group"], r);
const grabGroup_detail = r => require(["../views/goods/grab_group/grab_group_detail"], r);

//推荐官
const referral_officer = r => require(["../views/extension/other/referral_officer"], r);
const referral_officerDetail = r => require(["../views/extension/other/referral_officerDetail"], r);

// 安装服务
const installationSeverApply = r => require(["../views/extension/other/installationSever/worker_apply"], r);
const installationSeverExtension = r => require(["../views/extension/other/installationSeverExtension"], r);
const installationSeverDividends = r => require(["../views/extension/other/installationSever/installationSeverDividends"], r);
const installationSeverHome = r => require(["../views/extension/other/installationSever/home"], r);
// 师傅端详情
const installationSeverDetail = r => require(["../views/extension/other/installationSever/detail"], r);
// 会员端详情
const installationSeverRefund = r => require(["../views/extension/other/installationSever/refund"], r);
// 售后原因
const installationSeverAftersale = r => require(["../views/extension/other/installationSever/afterSaleList"], r);
// 售后申请
const installationSeverAfterApply = r => require(["../views/extension/other/installationSever/afterApply"], r);
// 商家核销
const installationSeverWrite = r => require(["../views/extension/other/installationSever/installationSeverWrite"], r);
//群活码
const groupCodeIndex = r => require(["../views/member/group_code/group_code_index"], r);
const groupCodeCreate = r => require(["../views/member/group_code/group_code_create"], r);
const groupCodeData = r => require(["../views/member/group_code/group_code_data"], r);
const groupCodeEdit = r => require(["../views/member/group_code/group_code_edit"], r);
const groupCodeRanking = r => require(["../views/member/group_code/group_code_ranking"], r);
const groupCodeRecord = r => require(["../views/member/group_code/group_code_record"], r);
const groupCodeShow = r => require(["../views/member/group_code/group_code_show"], r);
const groupCodeLabel = r => require(["../views/member/group_code/group_code_label"], r);
const groupCodeSearch = r => require(["../views/member/group_code/group_code_search"], r);

// 测肤
const skinHome = r => require(["../views/others/skin/home"], r);
const skinResult = r => require(["../views/others/skin/result"], r);
const skinShare = r => require(["../views/others/skin/share"], r);
const skinLog = r => require(["../views/others/skin/log"], r);
const skinRank = r => require(["../views/others/skin/rank"], r);
const AllResult = r => require(["../views/others/skin/all_result"], r);

//社区团购B
const communityBuyIndex = r => require(["../views/community_buying/index"], r);
const communityBuyEdit_info = r => require(["../views/community_buying/edit_info"], r);
const communityBuyGroup = r => require(["../views/community_buying/group_buying"], r);
const communityBuyDetails = r => require(["../views/community_buying/buying_details"], r);
const communityBuyData = r => require(["../views/community_buying/buying_data"], r);
const communityBuyOrder = r => require(["../views/community_buying/buying_order"], r);
const communityBuyPersonal = r => require(["../views/community_buying/buying_personal"], r);

//站内消息通知
const stationNoticeIndex = r => require(["../views/member/station_notice/station_notice_index"], r);
const stationNoticeSetting = r => require(["../views/member/station_notice/station_notice_setting"], r);
const stationNoticeExtract = r => require(["../views/member/station_notice/station_notice_extract"], r);
const stationNoticeExamine = r => require(["../views/member/station_notice/station_notice_examine"], r);
const stationNoticeLogistics = r => require(["../views/member/station_notice/station_notice_logistics"], r);
const stationNoticeAnchor = r => require(["../views/member/station_notice/station_notice_anchor"], r);
const stationNoticeCustomer = r => require(["../views/member/station_notice/station_notice_customer"], r);
const stationNoticeProperty = r => require(["../views/member/station_notice/station_notice_property"], r);
const stationNoticeOrder = r => require(["../views/member/station_notice/station_notice_order"], r);
const stationNoticeActivity = r => require(["../views/member/station_notice/station_notice_activity"], r);
const stationNoticeActivityDetail = r => require(["../views/member/station_notice/station_notice_activity_detail"], r);
//爱心值排行榜
const loveRanking = r => require(["../views/member/love_ranking/love_ranking"], r);

//拼单
const collageIndex = r => require(["../views/member/collage/collage_index"], r); //首页
const collageReportform = r => require(["../views/member/collage/collage_reportform"], r); //报表
const collageRegionBonus = r => require(["../views/member/collage/collage_region_bonus"], r); // 拼单分红

/***************非会员******************/

const tacitApply = r => require(["../views/member/collage/tacit/tacit_apply"], r); //会员申请
const tacitAddproject = r => require(["../views/member/collage/tacit/tacit_addproject"], r); //添加项目
const tacitDetproject = r => require(["../views/member/collage/tacit/tacit_detproject"], r); //项目详情
const tacitEditproject = r => require(["../views/member/collage/tacit/tacit_editproject"], r); //修改项目

/***************等级创始人******************/
const founderCollage = r => require(["../views/member/collage/founder/founder_collage"], r); //拼单
const founderEchievement = r => require(["../views/member/collage/founder/founder_echievement"], r); //业绩榜单
const founderTeam = r => require(["../views/member/collage/founder/founder_team"], r); //我的团队
const founderSinglepool = r => require(["../views/member/collage/founder/founder_singlepool"], r); //拼单池
const founderBicycle = r => require(["../views/member/collage/founder/founder_bicycle"], r); //拼单车

//区域代理
const regionalAgent = r => require(["../views/member/regional_agent/regional_agent_index"], r);
const regionalAgentResult = r => require(["../views/member/regional_agent/regional_agent_result"], r);
const regionalAgentSearch = r => require(["../views/member/regional_agent/regional_agent_search"], r);

//看视频答题
const videoAnswer = r => require(["../views/video_goods/little_video/video_answer"], r);

//社群接龙
const community_solitaire = r => require(["../views/others/community_solitaire/index"], r);
//新抽奖
const newDrawIndex = r => require(["../views/others/new_draw/index"], r);
const lottery_complaint = r => require(["../views/others/new_draw/lottery_complaint"], r);
const winners_list = r => require(["../views/others/new_draw/winners_list"], r);
const mydraw = r => require(["../views/others/new_draw/mydraw"], r);
const lucky_draw = r => require(["../views/others/new_draw/lucky_draw"], r);
const newDrawMyPrize = r => require(["../views/others/new_draw/my_prize"], r);
const newDrawRecommentReward = r => require(["../views/others/new_draw/recomment_reward"], r);
const newDrawPayment = r => require(["../views/others/new_draw/payment"], r);

//业绩区域奖励
const regionalAwards = r => require(["../views/member/regional_awards/regional_awards_index"], r);
const regionalAwardsRecord = r => require(["../views/member/regional_awards/regional_awards_record"], r);

//新团队分红
const newTeamBonus = r => require(["../views/member/income/teamAgentCenter/new_team_bonus"], r);
//蓝积分
const integralBlueCattle = r => require(["../views/member/integral_v2/member_integral_blueCattle"], r);
//蓝积分登陆
const lanLogin = r => require(["../views/member/integral_v2/lan_login"], r);

//我的市场
const myMarket = r => require(["../views/member/tool/my_market"], r);

//星拼乐
const starMusicIndex = r => require(["../views/member/star_music/star_music_index"], r); //聚合页
const starMusicOpenGroup = r => require(["../views/member/star_music/star_music_open_group"], r); //开团
const starMusicMy = r => require(["../views/member/star_music/star_music_my"], r); //我的
const starMusicRewardsRecord = r => require(["../views/member/star_music/star_music_rewards_record"], r); //奖励记录
//const starMusicEspNumber = r => require(["../views/member/star_music/star_music_esp_number"], r);//资格次数
const starMusicPersonalGroup = r => require(["../views/member/star_music/star_music_personal_group"], r); //我的团（开团和参团）
const starMusicListGroup = r => require(["../views/member/star_music/star_music_list_group"], r); //团列表
const starMusicGoodsDetails = r => require(["../views/member/star_music/star_music_goods_details"], r); //商品详情
const starMusicGroupDetails = r => require(["../views/member/star_music/star_music_group_details"], r); //拼团详情

// 商品分红
const commodityDividends = r => require(["../views/extension/commodityDividends"], r);

//盲盒
const blindBoxIndex = r => require(["../views/member/blindBox/blindBoxIndex"], r);
const blindBoxDetail = r => require(["../views/member/blindBox/blindBoxDetail"], r);
const blindBoxHelping = r => require(["../views/member/blindBox/blindBoxHelping"], r);

// 社区门店
const communityStore = r => require(["../views/o2o/community_stores/community_stores"], r);
const communityStoreDetails = r => require(["../views/o2o/community_stores/community_stores_details"], r);

const Test = r => require(["../views/business_card/test"], r);

//评估资产详情
const version = r => require(["../views/version"], r);

export default [
  //资产详情
  { path: "/assessment/:asset_id", component: Assessment, name: "Assessment", meta: { title: "资产详情", foot: false } },
  // {path: '/asset_profit', component: AssetProfit, name: 'AssetProfit', meta: {title: '分红', foot: true}},
  // {path: '/categories', component: Categories, name: 'Categories', meta: {title: '全部类型', foot: true}},
  {
    path: "/asset_notices/:notice_id",
    component: AssetNotices,
    name: "AssetNotices",
    meta: { title: "财务报告", foot: true }
  },
  // {path: '/digital_asset', component: DigitalAsset, name: 'DigitalAsset', meta: {title: '数字资产', foot: true}},
  // {path: '/finance', component: Finance, name: 'Finance', meta: {title: '财务', foot: true}},
  {
    path: "/asset_introduction/:asset_id",
    component: AssetIntroduction,
    name: "AssetIntroduction",
    meta: { title: "简况", foot: true }
  },
  {
    path: "/detail_report/:finance_id",
    component: DetailReport,
    name: "DetailReport",
    meta: { title: "财务报告", foot: true }
  },
  { path: "/asset_sale/:asset_id", component: AssetSale, name: "AssetSale", meta: { title: "我要销售", foot: true } },

  //我的资产
  { path: "/buying_record/:asset_id", component: BuyingRecord, name: "BuyingRecord", meta: { title: "", foot: true } },
  { path: "/check_asset/:asset_id", component: CheckAsset, name: "CheckAsset", meta: { title: "", foot: true } },
  {
    path: "/income_record/:asset_id",
    component: IncomeRecord,
    name: "IncomeRecord",
    meta: { title: "进出记录", foot: true }
  },
  { path: "/my_asset", component: MyAsset, name: "MyAsset", meta: { title: "", foot: true } },
  { path: "/secret_key/:name", component: SecretKey, name: "SecretKey", meta: { title: "", foot: true } },
  { path: "/set_password", component: SetPassword, name: "SetPassword", meta: { title: "交易密码", foot: true } },
  { path: "/transfer/:asset_id", component: AssetTrans, name: "AssetTrans", meta: { title: "转让", foot: true } },
  {
    path: "/transaction_details/:id",
    component: TransactionDetails,
    name: "TransactionDetails",
    meta: { title: "详情", foot: true }
  },

  //交易大厅主页
  { path: "/trans_home", component: TransHome, name: "TransHome", meta: { title: " ", foot: true } },
  { path: "/asset_classify", component: AssetClassify, name: "AssetClassify", meta: { title: "交易大厅", foot: true } },
  { path: "/buying/:asset_id", component: Buying, name: "Buying", meta: { title: "认购", foot: true } },
  { path: "/trans_notice", component: TransNotice, name: "TransNotice", meta: { title: "公告", foot: true } },
  {
    path: "/classified_search",
    component: ClassifiedSearch,
    name: "ClassifiedSearch",
    meta: { title: "分类搜索列表", foot: true }
  },
  // { path: "/trading_hall", component: TradingHall, name: "TradingHall", meta: { title: "交易大厅", foot: true } },

  //名片
  {
    path: "/business_card/card_center",
    component: CardCenter,
    name: "CardCenter",
    meta: { title: "名片中心", foot: true }
  },
  {
    path: "/business_card/business_card",
    component: BusinessCard,
    name: "BusinessCard",
    meta: { title: "名片", foot: true }
  },
  {
    path: "/business_card/card_action/:card_id",
    component: Card_Action,
    name: "Card_Action",
    meta: { title: "数据统计", foot: true }
  },
  {
    path: "/business_card/card_code/:card_id",
    component: CardCode,
    name: "CardCode",
    meta: { title: "名片码", foot: true }
  },
  {
    path: "/business_card/card_collect/:card_id",
    component: CardCollect,
    name: "CardCollect",
    meta: { title: "名片收藏", foot: true }
  },
  {
    path: "/business_card/card_footprint/:card_id",
    component: CardFootprint,
    name: "CardFootprint",
    meta: { title: "名片足迹", foot: true }
  },
  {
    path: "/business_card/card_goods/:id",
    component: CardGoods,
    name: "CardGoods",
    meta: { title: "名片选择商品", foot: true }
  },
  {
    path: "/business_card/card_ranking",
    component: CardRanking,
    name: "CardRanking",
    meta: { title: "名片排行", foot: true }
  },
  {
    path: "/business_card/card_visit/:card_id",
    component: CardVisit,
    name: "CardVisit",
    meta: { title: "名片图片", foot: true }
  },
  {
    path: "/business_card/edit_card/:card_id",
    component: EditCard,
    name: "EditCard",
    meta: { title: "编辑名片", foot: true }
  },

  // 渠道商
  { path: "/distributor_index", component: distributorIndex, name: "distributorIndex", meta: { title: "", foot: true } },
  { path: "/accumulated_income", component: accumulatedIncome, name: "accumulatedIncome", meta: { title: "累计收入", foot: true } },
  { path: "/recommendUp", component: recommendUp, name: "recommendUp", meta: { title: "推荐升级", foot: true } },
  { path: "/submitRecommend", component: submitRecommend, name: "submitRecommend", meta: { title: "提交推荐", foot: true } },
  { path: "/my_repertory", component: myRepertory, name: "myRepertory", meta: { title: "我的库存", foot: true } },
  { path: "/order_goods", component: orderGoods, name: "orderGoods", meta: { title: "订货", foot: true } },
  { path: "/deliver_goods", component: deliverGoods, name: "deliverGoods", meta: { title: "发货", foot: true } },
  { path: "/deliverGoodsNext", component: deliverGoodsNext, name: "deliverGoodsNext", meta: { title: "发货", foot: true } },
  { path: "/place_order", component: placeOrder, name: "placeOrder", meta: { title: "下单", foot: true } },
  { path: "/exchange_goods", component: exchangeGoods, name: "exchangeGoods", meta: { title: "换货", foot: true } },
  { path: "/exchange_detail/:id", component: exchangeDetail, name: "exchangeDetail", meta: { title: "换货", foot: true } },
  { path: "/exchange_ticket", component: exchangeTicket, name: "exchangeTicket", meta: { title: "兑换券", foot: true } },
  { path: "/my_referrals", component: myReferrals, name: "myReferrals", meta: { title: "我的下线客户", foot: true } },
  { path: "/my_exchange", component: myExchange, name: "myExchange", meta: { title: "我的换货", foot: true } },
  { path: "/client_order/:status", component: clientOrder, name: "clientOrder", meta: { title: "客户订单", foot: true } },
  { path: "/client_order/:status/:orderType", component: clientOrder, name: "myDeliver", meta: { title: "我的发货", foot: true } },
  { path: "/client_order/:status/:orderType", component: clientOrder, name: "dismyReplenishment", meta: { title: "我的补货", foot: true } },
  { path: "/dis_order_detail/:order_id/:orderType", component: DisOrderDetail, name: "DisOrderDetail", meta: { title: "订单详情", foot: true } },
  { path: "/booking_change/:order_id", component: bookingChange, name: "bookingChange", meta: { title: "补货", foot: true } },
  { path: "/exchangeCart/:type/:order_id?", component: exchangeCart, name: "exchangeCart", meta: { title: "购物车", foot: true } },
  { path: "/distributor_stock/:goods_id/:option_id", component: distributor_stock, name: "distributor_stock", meta: { title: "库存明细", foot: true } },
  { path: "/distributor/rank", component: distributorRank, name: "distributorRank", meta: { title: "排行榜", foot: true } },
  { path: "/distributor/estimatedIncome", component: estimatedIncome, name: "estimatedIncome", meta: { title: "预估收益", foot: true } },
  { path: "/distributor/estimatedIncomeDetail/:id", component: estimatedIncomeDetail, name: "estimatedIncomeDetail", meta: { title: "预估收益详情", foot: true } },

  // {path: '/dis_order_datail', component: dis_order_datail, name: 'dis_order_datail', meta: {title: '客户订货详情', foot: true}},
  //直播
  { path: "/helperLiveList", component: helperLiveList, name: "helperLiveList", meta: { title: "主播助手", foot: true } },
  {
    path: "/helperLiveRoom/:id",
    component: helperLiveRoom,
    name: "helperLiveRoom",
    meta: { title: "直播间", foot: true }
  },
  { path: "/anchorApply", component: anchorApply, name: "anchorApply", meta: { title: "主播申请", foot: true } },
  { path: "/anchorDetail/:id", component: anchorDetail, name: "anchorDetail", meta: { title: "主播页面", foot: true } },
  { path: "/liveList", component: liveList, name: "liveList", meta: { title: "直播列表", foot: true } },
  { path: "/liveCategory/:cate_id", component: liveList, name: "liveCategory", meta: { title: "分类列表", foot: true } },
  { path: "/livePage", component: livePage, name: "livePage", meta: { title: "直播间", foot: true, is_single_share: true } },
  { path: "/foreshow/:id", component: foreshow, name: "foreshow", meta: { title: "直播预告", foot: true } },
  { path: "/liveDividend", component: liveDividend, name: "liveDividend", meta: { title: "主播分红", foot: true } },
  { path: "/liveFanList", component: liveFanList, name: "liveFanList", meta: { title: "粉丝列表", foot: true } },

  //精英奖
  { path: "/eliteAwardHome", component: eliteAwardHome, name: "eliteAwardHome", meta: { title: "精英奖", foot: true } },
  {
    path: "/eliteAwardRecord",
    component: eliteAwardRecord,
    name: "eliteAwardRecord",
    meta: { title: "精英奖记录", foot: true }
  },
  { path: "/eliteAwardRank", component: eliteAwardRank, name: "eliteAwardRank", meta: { title: "排行榜记录", foot: true } },

  { path: "/business_card/Test", component: Test, name: "Test", meta: { title: "Test", foot: true } },
  { path: "/version", component: version, name: "version", meta: { title: "version", foot: true } },

  //群活码
  { path: "/member/groupCode", component: groupCodeIndex, name: "groupCode", meta: { title: "群活码", foot: false } },
  {
    path: "/member/groupCodeCreate",
    component: groupCodeCreate,
    name: "groupCodeCreate",
    meta: { title: "活码创建", foot: true }
  },
  {
    path: "/member/groupCodeData",
    component: groupCodeData,
    name: "groupCodeData",
    meta: { title: "群活码数据", foot: false }
  },
  {
    path: "/member/groupCodeEdit",
    component: groupCodeEdit,
    name: "groupCodeEdit",
    meta: { title: "群活码编辑", foot: true }
  },
  {
    path: "/member/groupCodeRanking",
    component: groupCodeRanking,
    name: "groupCodeRanking",
    meta: { title: "群活码排行榜", foot: false }
  },
  {
    path: "/member/groupCodeRecord",
    component: groupCodeRecord,
    name: "groupCodeRecord",
    meta: { title: "群活码记录", foot: false }
  },
  {
    path: "/member/groupCodeShow",
    component: groupCodeShow,
    name: "groupCodeShow",
    meta: { title: "群活码展示", foot: false }
  },
  {
    path: "/member/groupCodeLabel",
    component: groupCodeLabel,
    name: "groupCodeLabel",
    meta: { title: "标签进群", foot: false }
  },
  {
    path: "/member/groupCodeSearch",
    component: groupCodeSearch,
    name: "groupCodeSearch",
    meta: { title: "搜索", foot: true }
  },

  //测肤
  { path: "/skin/Home", component: skinHome, name: "skinHome", meta: { title: "测肤", foot: false, notKeepAlive: true } },
  { path: "/skin/Result/:id", component: skinResult, name: "skinResult", meta: { title: "测肤结果", foot: false } },
  { path: "/skin/Share/:id", component: skinShare, name: "skinShare", meta: { title: "测肤结果", foot: false } },
  { path: "/skin/Log", component: skinLog, name: "skinLog", meta: { title: "测肤记录", foot: false, notKeepAlive: true } },
  {
    path: "/skin/Rank",
    component: skinRank,
    name: "skinRank",
    meta: { title: "测肤结果", foot: false, notKeepAlive: true }
  },
  { path: "/skin/AllResult/:id", component: AllResult, name: "AllResult", meta: { title: "测肤结果", foot: false } },

  //社区团购
  {
    path: "/community_buying/index",
    component: communityBuyIndex,
    name: "communityBuyIndex",
    meta: { title: "自提点", foot: true }
  },
  {
    path: "/community_buying/edit_info",
    component: communityBuyEdit_info,
    name: "communityBuyEdit_info",
    meta: { title: "自提点", foot: true }
  },
  {
    path: "/community_buying/group_buying",
    component: communityBuyGroup,
    name: "communityBuyGroup",
    meta: { title: "社区团购", foot: true }
  },
  {
    path: "/community_buying/buying_details/:id",
    component: communityBuyDetails,
    name: "communityBuyDetails",
    meta: { title: "团购商品", foot: true }
  },
  {
    path: "/community_buying/buying_data/:id",
    component: communityBuyData,
    name: "communityBuyData",
    meta: { title: "团购商品", foot: true }
  },
  {
    path: "/community_buying/buying_order",
    component: communityBuyOrder,
    name: "communityBuyOrder",
    meta: { title: "社区团购", foot: true }
  },
  {
    path: "/community_buying/buying_personal/:id/:deliver_id",
    component: communityBuyPersonal,
    name: "communityBuyPersonal",
    meta: { title: "社区团购", foot: true }
  },
  //站内通知
  {
    path: "/member/stationNotice",
    component: stationNoticeIndex,
    name: "stationNotice",
    meta: { title: "信息", foot: false }
  },
  {
    path: "/member/stationNoticeSetting",
    component: stationNoticeSetting,
    name: "stationNoticeSetting",
    meta: { title: "信息", foot: false }
  },
  {
    path: "/member/stationNoticeExtract",
    component: stationNoticeExtract,
    name: "stationNoticeExtract",
    meta: { title: "提现", foot: false }
  },
  {
    path: "/member/stationNoticeExamine",
    component: stationNoticeExamine,
    name: "stationNoticeExamine",
    meta: { title: "申请", foot: false }
  },
  {
    path: "/member/stationNoticeLogistics",
    component: stationNoticeLogistics,
    name: "stationNoticeLogistics",
    meta: { title: "交易物流", foot: false }
  },
  {
    path: "/member/stationNoticeAnchor",
    component: stationNoticeAnchor,
    name: "stationNoticeAnchor",
    meta: { title: "直播提醒", foot: false }
  },
  {
    path: "/member/stationNoticeCustomer",
    component: stationNoticeCustomer,
    name: "stationNoticeCustomer",
    meta: { title: "客户通知", foot: false }
  },
  {
    path: "/member/stationNoticeProperty",
    component: stationNoticeProperty,
    name: "stationNoticeProperty",
    meta: { title: "资产通知", foot: false }
  },
  {
    path: "/member/stationNoticeOrder",
    component: stationNoticeOrder,
    name: "stationNoticeOrder",
    meta: { title: "订单提醒", foot: false }
  },
  {
    path: "/member/stationNoticeActivity",
    component: stationNoticeActivity,
    name: "stationNoticeActivity",
    meta: { title: "活动优惠", foot: false }
  },
  {
    path: "/member/stationNoticeActivityDetail",
    component: stationNoticeActivityDetail,
    name: "stationNoticeActivityDetail",
    meta: { title: "活动优惠", foot: false }
  },

  //安装服务
  { path: "/member/workerApply", component: workerApply, name: "workerApply", meta: { title: "申请", foot: true } },
  {
    path: "/member/workerOrderlist",
    component: workerOrderlist,
    name: "workerOrderlist",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/workerOrderDetail/:id",
    component: workerOrderDetail,
    name: "workerOrderDetail",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/userOrderlist",
    component: userOrderlist,
    name: "userOrderlist",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/userOrderDetail/:id",
    component: userOrderDetail,
    name: "userOrderDetail",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/installIncome",
    component: installIncome,
    name: "installIncome",
    meta: { title: "安装服务", foot: true }
  },

  //推荐人
  {
    path: "/extension/referral_officer",
    component: referral_officer,
    name: "referral_officer",
    meta: { title: "推荐官", foot: true }
  },
  {
    path: "/extension/referral_officerDetail/:id",
    component: referral_officerDetail,
    name: "referral_officerDetail",
    meta: { title: "查看详情", foot: true }
  },
  //抢团
  { path: "/grabGroupHome", component: grab_group_home, name: "grab_group_home", meta: { title: "抢团", foot: false } },
  { path: "/grabGroupMy", component: grab_group_my, name: "grab_group_my", meta: { title: "我的抢团", foot: true } },
  {
    path: "/grabGroup_myRecord",
    component: grab_group_my_record,
    name: "grab_group_my_record",
    meta: { title: "我的抢团", foot: true }
  },
  {
    path: "/grabGroupReward",
    component: grab_group_reward,
    name: "grab_group_reward",
    meta: { title: "我的抢团", foot: true }
  },
  ///grabGroup/:id(id为商品id)
  { path: "/grabGroup/:id", component: grab_group, name: "grab_group", meta: { title: "抢团活动详情", foot: true } },
  // /grabGroup_detail/:id (id为团长id)
  {
    path: "/grabGroup_detail/:id",
    component: grabGroup_detail,
    name: "grabGroup_detail",
    meta: { title: "抢团详情", foot: true }
  },

  //爱心值排行榜
  { path: "/member/loveRanking", component: loveRanking, name: "loveRanking", meta: { title: "爱心值排行榜", foot: true } },

  //拼单
  {
    path: "/member/collage/collageReportform",
    component: collageReportform,
    name: "collageReportform",
    meta: { title: "收入报表", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/collage/collageIndex",
    component: collageIndex,
    name: "collageIndex",
    meta: { title: "拼单", foot: true }
  },
  {
    path: "/member/collage/collageRegionBonus",
    component: collageRegionBonus,
    name: "collageRegionBonus",
    meta: { title: "拼单", foot: true }
  },

  //拼单——非会员
  {
    path: "/member/collage/tacitApply",
    component: tacitApply,
    name: "tacitApply",
    meta: { title: "会员申请", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/collage/tacitAddproject",
    component: tacitAddproject,
    name: "tacitAddproject",
    meta: { title: "添加项目", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/collage/tacitDetproject",
    component: tacitDetproject,
    name: "tacitDetproject",
    meta: { title: "项目详情", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/collage/tacitEditproject",
    component: tacitEditproject,
    name: "tacitEditproject",
    meta: { title: "修改项目", foot: true, notKeepAlive: true }
  },

  //拼单——等级创始人
  {
    path: "/member/collage/founderCollage",
    component: founderCollage,
    name: "founderCollage",
    meta: { title: "拼单", foot: true }
  },
  {
    path: "/member/collage/founderEchievement",
    component: founderEchievement,
    name: "founderEchievement",
    meta: { title: "业绩榜单", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/collage/founderTeam",
    component: founderTeam,
    name: "founderTeam",
    meta: { title: "我的团队", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/collage/founderSinglepool",
    component: founderSinglepool,
    name: "founderSinglepool",
    meta: { title: "拼单池", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/collage/founderBicycle",
    component: founderBicycle,
    name: "founderBicycle",
    meta: { title: "拼单车", foot: true, notKeepAlive: true }
  },

  //区域代理
  {
    path: "/member/regionalAgent",
    component: regionalAgent,
    name: "regionalAgent",
    meta: { title: "区域代理", foot: true }
  },
  {
    path: "/member/regionalAgentResult",
    component: regionalAgentResult,
    name: "regionalAgentResult",
    meta: { title: "查询结果", foot: true }
  },
  {
    path: "/member/regionalAgentSearch",
    component: regionalAgentSearch,
    name: "regionalAgentSearch",
    meta: { title: "搜索区域", foot: true }
  },

  {
    path: "/community_solitaire/:id",
    component: community_solitaire,
    name: "community_solitaire",
    meta: { title: "社群接龙", foot: true }
  },
  {
    path: "/newDrawIndex/:id",
    component: newDrawIndex,
    name: "newDrawIndex",
    meta: { title: "抽奖活动", foot: true }
  },
  {
    path: "/lottery_complaint/:id",
    component: lottery_complaint,
    name: "lotteryComplaint",
    meta: { title: "抽奖投诉", foot: true }
  },
  {
    path: "/winners_list/:id/:num",
    component: winners_list,
    name: "winnersList",
    meta: { title: "中奖名单", foot: true }
  },
  {
    path: "/mydraw",
    component: mydraw,
    name: "mydraw",
    meta: { title: "我的抽奖", foot: false }
  },
  {
    path: "/lucky_draw/:tag?/:index?",
    component: lucky_draw,
    name: "luckyDraw",
    meta: { title: "抽奖活动", foot: false }
  },
  {
    path: "/newDrawMyPrize",
    component: newDrawMyPrize,
    name: "newDrawMyPrize",
    meta: { title: "我的奖品", foot: true }
  },
  {
    path: "/newDrawRecommentReward",
    component: newDrawRecommentReward,
    name: "newDrawRecommentReward",
    meta: { title: "中奖推荐奖励", foot: true }
  },
  {
    path: "/newDrawPayment",
    component: newDrawPayment,
    name: "newDrawPayment",
    meta: { title: "支付", foot: true }
  },

  //业绩区域奖励
  {
    path: "/member/regionalAwards",
    component: regionalAwards,
    name: "regionalAwards",
    meta: { title: "业绩区域奖励", foot: true }
  },
  {
    path: "/member/regionalAwardsRecord",
    component: regionalAwardsRecord,
    name: "regionalAwardsRecord",
    meta: { title: "奖励记录", foot: true }
  },

  //新团队分红
  { path: "/newTeamBonus", component: newTeamBonus, name: "newTeamBonus", meta: { title: "新团队分红", foot: true } },

  //看视频答题
  {
    path: "/videoAnswer",
    component: videoAnswer,
    name: "videoAnswer",
    meta: { title: "答题", foot: true, notKeepAlive: true }
  },
  //蓝积分
  {
    path: "/member/integralBlueCattle",
    component: integralBlueCattle,
    name: "integralBlueCattle",
    meta: { title: "蓝积分", foot: true, notKeepAlive: true }
  },

  { path: "/lanLogin", component: lanLogin, name: "lanLogin", meta: { title: "跳转中", foot: true, notKeepAlive: true } },

  {
    path: "/videoAnswer",
    component: videoAnswer,
    name: "videoAnswer",
    meta: { title: "答题", foot: true, notKeepAlive: true }
  },

  //我的市场
  {
    path: "/member/myMarket",
    component: myMarket,
    name: "myMarket",
    meta: { title: "我的市场", foot: true, notKeepAlive: true }
  },

  //星拼乐
  {
    path: "/member/starMusicIndex",
    component: starMusicIndex,
    name: "starMusicIndex",
    meta: { title: "星拼乐", foot: true }
  },
  {
    path: "/member/starMusicOpenGroup",
    component: starMusicOpenGroup,
    name: "starMusicOpenGroup",
    meta: { title: "开团", foot: true }
  },
  { path: "/member/starMusicMy", component: starMusicMy, name: "starMusicMy", meta: { title: "我的", foot: true } },
  {
    path: "/member/starMusicRewardsRecord",
    component: starMusicRewardsRecord,
    name: "starMusicRewardsRecord",
    meta: { title: "奖励记录", foot: true, notKeepAlive: true }
  },
  //   {
  //     path: "/member/starMusicEspNumber",
  //     component: starMusicEspNumber,
  //     name: "starMusicEspNumber",
  //     meta: { title: "星拼资格次数", foot: true, notKeepAlive: true }
  //   },
  {
    path: "/member/starMusicPersonalGroup",
    component: starMusicPersonalGroup,
    name: "starMusicPersonalGroup",
    meta: { title: "我的开团", foot: true }
  },
  {
    path: "/member/starMusicListGroup",
    component: starMusicListGroup,
    name: "starMusicListGroup",
    meta: { title: "开团列表", foot: true }
  },
  {
    path: "/member/starMusicGoodsDetails/:id",
    component: starMusicGoodsDetails,
    name: "starMusicGoodsDetails",
    meta: { title: "星拼团详情", foot: true }
  },
  {
    path: "/member/starMusicGroupDetails/:id",
    component: starMusicGroupDetails,
    name: "starMusicGroupDetails",
    meta: { title: "星拼团详情", foot: true }
  },

  //盲盒
  {
    path: "/member/blindBoxIndex",
    component: blindBoxIndex,
    name: "blindBoxIndex",
    meta: { title: "首页", foot: true }
  },
  {
    path: "/member/blindBoxDetail",
    component: blindBoxDetail,
    name: "blindBoxDetail",
    meta: { title: "抽奖", foot: true, notKeepAlive: true }
  },
  {
    path: "/member/blindBoxHelping",
    component: blindBoxHelping,
    name: "blindBoxHelping",
    meta: { title: "助力", foot: true }
  },

  //商品分红
  {
    path: "/commodityDividends",
    component: commodityDividends,
    name: "commodityDividends",
    meta: { title: "商品分红", foot: true, notKeepAlive: true }
  },
  //安装服务 插件名：live-install
  {
    path: "/installationSeverApply",
    component: installationSeverApply,
    name: "installationSeverApply",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverExtension",
    component: installationSeverExtension,
    name: "installationSeverExtension",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverDividends/:active",
    component: installationSeverDividends,
    name: "installationSeverDividends",
    meta: { title: "分红记录", foot: true }
  },
  {
    path: "/installationSeverHome",
    component: installationSeverHome,
    name: "installationSeverHome",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverMemberHome",
    component: installationSeverHome,
    name: "installationSeverMemberHome",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverDetail/:id",
    component: installationSeverDetail,
    name: "installationSeverDetail",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverRefund/:id",
    component: installationSeverRefund,
    name: "installationSeverRefund",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverAftersale/:oid",
    component: installationSeverAftersale,
    name: "installationSeverAftersale",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverAfterApply/:id",
    component: installationSeverAfterApply,
    name: "installationSeverAfterApply",
    meta: { title: "售后申请", foot: true }
  },
  {
    path: "/installationSeverWrite/:take_sn",
    component: installationSeverWrite,
    name: "installationSeverWrite",
    meta: { title: "商家核销", foot: true }
  },
  // 社区门店
  {
    path: "/communityStore",
    component: communityStore,
    name: "communityStore",
    meta: { title: "", foot: false }
  },
  {
    path: "/communityStoreDetails",
    component: communityStoreDetails,
    name: "communityStoreDetails",
    meta: { title: "", foot: false }
  }
];
