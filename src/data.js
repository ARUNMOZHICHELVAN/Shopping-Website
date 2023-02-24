const productdata = [
    {
        id: 'price_1MToLgSDNaxfjt9C7lmRrQjc',
        product_name: "apple",
        product_price: 100,
        quantity: 0,
        url: 'https://static.libertyprim.com/files/familles/pomme-large.jpg?1569271834'
    },
    {
        id: 'price_1MToMHSDNaxfjt9C69PCMZb8',
        product_name: "orange",
        product_price: 50,
        quantity: 0,
        url: 'https://eangadi.in/image/cache/catalog/Seller_1/eangadi-Fresh-Fruits-Orange-Imported-350x350.jpg'
    },
    {
        id: 'price_1MToMiSDNaxfjt9CwFWIQjPk',
        product_name: "banana",
        product_price: 60,
        quantity: 0,
        url: 'https://cdn.shopify.com/s/files/1/0258/4307/3103/products/asset_2_800x.jpg?v=1571839043'
    },
    {
        id: 'price_1MToMxSDNaxfjt9CE5M12alt',
        product_name: "grapes",
        product_price: 200,
        quantity: 0,
        url: 'https://iranfreshfruit.net/wp-content/uploads/2020/01/green-grapes.jpg'
    },
    {
        id: 'price_1MToMxSDNaxfjt9CE5LJA899',
        product_name: "Guava",
        product_price: 120,
        quantity: 0,
        url: 'https://m.media-amazon.com/images/I/41dGoCDGXmL._SX466_.jpg'
    },
    {
        id: 'price_1MToMxSDNaxfjt9CE5Llasjf',
        product_name: "Pine Apple",
        product_price: 120,
        quantity: 0,
        url: 'https://5.imimg.com/data5/PW/ND/MY-46595757/fresh-pineapple-281kg-29-500x500.png'
    },
    {
        id: 'price_1MToMxSDNaxfjt9CE5Luuioo',
        product_name: "Pomegranate",
        product_price: 90,
        quantity: 0,
        url: 'https://thumbs.dreamstime.com/b/juicy-pomegranate-its-half-leaves-16537522.jpg'
    },
    {
        id: 'price_1MToMxSD898fjt9CE5Llasjf',
        product_name: "Strawberry",
        product_price: 210,
        quantity: 0,
        url: 'https://gofreshkart.com/wp-content/uploads/2022/12/fresh-red-strawberry.jpg'
    },
    {
        id: 'price_178jdjoMxSDNaxfjt9CE5Llasjf',
        product_name: "Jack Fruit",
        product_price: 120,
        quantity: 0,
        url: 'https://cdn.shopify.com/s/files/1/0018/4421/5860/products/jackfruit_1200x.jpg?v=1592313794'
    },
]

function getProductData(id) {
    let productdata = productdata.find((product) => {
        return product.id === id
    })
    if (productdata == undefined) {
        console.log("Product data does not exist")
        return undefined
    }
    return productdata
}
export { productdata, getProductData };