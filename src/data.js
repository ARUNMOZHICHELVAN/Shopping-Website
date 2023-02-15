const productdata = [
    {
        id: 'price_1MToLgSDNaxfjt9C7lmRrQjc',
        product_name: "apple",
        product_price: 100,
        quantity: 0,
        url: 'https://5.imimg.com/data5/NL/FU/MY-48841722/apple-fruit-1000x1000.jpeg'
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
        url: 'https://www.shutterstock.com/image-photo/one-banana-isolated-on-white-260nw-1514344964.jpg'
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