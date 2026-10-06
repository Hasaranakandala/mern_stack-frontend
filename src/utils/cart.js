export function getCart() {
  let cart = localStorage.getItem("cart");

  if (cart == null) {
    cart = [];

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  } else {
    cart = JSON.parse(cart);
  }

  return cart;
}




function notifyCartUpdate() {
  window.dispatchEvent(
    new Event("cartUpdated")
  );
}




export function removeFromCart(productId) {
  let cart = getCart();

  const newCart = cart.filter(
    (item) => {
      return (
        item.productId != productId
      );
    }
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(newCart)
  );

  notifyCartUpdate();
}


export function addToCart(
  product,
  quantity
) {
  let cart = getCart();

  let index = cart.findIndex(
    (item) => {
      return (
        item.productId ==
        product.productId
      );
    }
  );

  if (index == -1) {
    cart[cart.length] = {
      productId:
        product.productId,

      name:
        product.productName,

      image:
        product.images?.[0],

      price:
        product.price,

      labelPrice:
        product.labelPrice,

      quantity:
        quantity,
    };
  } else {
    const newQuantity =
      cart[index].quantity +
      quantity;

    if (newQuantity <= 0) {
      removeFromCart(
        product.productId
      );

      return;
    }

    cart[index].quantity =
      newQuantity;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  notifyCartUpdate();
}




export function clearCart() {
  localStorage.setItem(
    "cart",
    JSON.stringify([])
  );

  notifyCartUpdate();
}



export function getTotal() {
  let cart = getCart();

  let total = 0;

  for (
    let i = 0;
    i < cart.length;
    i++
  ) {
    total +=
      Number(cart[i].price) *
      Number(cart[i].quantity);
  }

  return total;
}




export function getCartCount() {
  const cart = getCart();

  return cart.reduce(
    (total, item) =>
      total +
      Number(
        item.quantity || 0
      ),
    0
  );
}