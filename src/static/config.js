export default {
    name: import.meta.env.VITE_APP_NAME,
    baseUrl: import.meta.env.VITE_API_URL,
    interface: {
        getUserVip: "/api/shop/login/get-user-vip",
        performLogin: "/api/shop/login/perform-login",
        getGoods: "/api/shop/shop/get-goods",
        getGoodsV2: "/api/shop/shop/get-goods-v2",
        getMy: '/api/shop/login/get-my',
        logout: '/api/shop/login/logout',
        getThemeColor: '/api/shop/login/get-theme-color',
        getLoginConfig: '/api/shop/login/get-config',
        getGoodsDetails: '/api/shop/shop/get-goods-details',
        getConfirm: '/api/shop/shop/get-confirm',
        getProtocolCredit: '/api/shop/user/get-protocol-credit',
        uploadSigning: '/api/shop/user/upload-signing',
        getAddressList: '/api/shop/user/get-address-list',
        getAddressDetails: '/api/shop/user/get-address-details',
        setAddressList: '/api/shop/user/set-address-list',
        setAddressSelected: '/api/shop/user/set-address-selected',
        confirmProduct: '/api/shop/shop/confirm-product',
        getTransactionsSuccess: '/api/shop/shop/get-transactions-success',
        getRedeeming: '/api/shop/user/get-redeeming',
        getConsumers: '/api/shop/user/get-consumers',
        setComplaint: '/api/shop/user/set-complaint',
        getUserBackgroundImage: '/api/shop/user/get-background'
    }
}
