
import Login from "./auth/Login"
import MainLayout from "./Layout/MainLayout"
import { createBrowserRouter ,RouterProvider} from "react-router-dom"
import Signup from "./auth/Signup"
import ForgotPassword from "./auth/ForgotPassword"
import ResetPassword from "./auth/ResetPassword"
import VerifyEmail from "./auth/VerifyEmail"
import HeroSection from "./components/HeroSection"
import Profile from "./components/Profile"
import SearchPage from "./components/SearchPage"
import RestaurentDetail from "./components/RestaurentDetail"
import Cart from "./components/Cart"
import Restaurant from "./admin/Restaurent"
import Orders from "./admin/Orders"
import AddMenu from "./admin/AddMenu"
import Success from "./components/Success"

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:<HeroSection/>
      },
      {
        path:"/profile",
        element:<Profile/>
      },

      {
        path:"/search/:id",
        element:<SearchPage/>
      },
      {
        path:"/restaurent/:id",
        element:<RestaurentDetail/>
      },
      {
        path:"/cart",
        element:<Cart/>
      },
      {
        path:"/admin/restaurent",
        element:<Restaurant/>
      },
      {
        path:"/admin/orders",
        element:<Orders/>
      },
      {
        path:"/admin/Menu",
        element:<AddMenu/>
      },
      {
        path: "/order/status",
        element: <Success />,
      },
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/forgot-password",
    element:<ForgotPassword/>
  },
  {
    path:"/reset-password",
    element: <ResetPassword/>
  },
  {
    path:"/verify-email",
    element:<VerifyEmail/>
  }
])
const App = () => {
  return (
    <RouterProvider router = {appRouter}>
    </RouterProvider>
  )
}

export default App
