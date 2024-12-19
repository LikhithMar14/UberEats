import Footer from "@/components/Footer"
import NavBar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen m-2 md:0">
      <header>
        <NavBar/>
      </header>
      <div className=" flex-1">
        <Outlet/>
      </div>
      <footer>
        <Footer/>
      </footer>
      
    </div>
  )
}

export default MainLayout
