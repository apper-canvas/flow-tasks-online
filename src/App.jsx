import React from "react"
import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import { store } from "@/store"
import { router } from "@/router"

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: "8px",
          fontFamily: "Inter, sans-serif"
        }}
        style={{ zIndex: 9999 }}
      />
    </Provider>
  )
}

export default App