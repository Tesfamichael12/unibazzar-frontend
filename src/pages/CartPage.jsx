import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  decreaseQuantity,
  addToCart,
} from "../redux/slices/cartSlice";
import { FiTrash2 } from "react-icons/fi";

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  
  // Calculate total from cart items to avoid NaN
  const computedTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

  if (cartItems.length === 0) {
    return (
      <div className="p-6 pt-20 text-center text-gray-800 dark:text-white">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 max-w-3xl mx-auto dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-16">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white text-center tracking-tight">Your Cart</h1>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center border border-blue-100 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-xl transition-all p-4 group"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-24 h-24 object-cover rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-md mr-6"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{item.title}</h2>
              <p className="text-blue-600 font-bold dark:text-blue-400 text-lg">{item.price} ETB</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-gray-600 dark:text-gray-400">Qty:</span>
                <button
                  onClick={() => dispatch(decreaseQuantity(item.id))}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold text-lg"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="font-semibold text-lg">{item.quantity}</span>
                <button
                  onClick={() => dispatch(addToCart({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    imageUrl: item.imageUrl,
                  }))}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="ml-6 p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/60 hover:scale-110 cursor-pointer group/remove"
              aria-label="Remove from cart"
              style={{ outline: 'none', border: 'none' }}
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        <div className="text-right font-extrabold text-2xl text-blue-700 dark:text-blue-300 mt-8">
          Total: {computedTotal.toFixed(2)} ETB
        </div>
      </div>
    </div>
  );
}

export default CartPage;
