
import "./globals.css";
import Link from "next/link";
import getAuthUser from "@/lib/getAuthUser";
import {logout} from "@/actions/auth";

export default async function RootLayout({ children }) {

  const authUser = await getAuthUser();

  return (
    <html lang="en">
      <body>
        <header>
          <nav>Nav</nav>
          <Link href="/" className="nav-link">Home</Link>
          {
          authUser ? 
          
          (
          <div>
            <Link className="nav-link" href="/dashboard">Dashboard</Link>
            <form action={logout}>
              <button className="nav-link" >Logout</button>
            </form>
          </div>
          ) 
          :
          (
            <div>
              <Link className="nav-link" href="/login">Login</Link>
              <Link className="nav-link" href="/register">Register</Link>
            </div>
          )
          
          }
    
 
          
         
        </header>   

        <main>{children}</main>

        <footer>footer</footer>
      </body>
    </html>
  );
}
