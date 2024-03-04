import MainFramework from "./MainFramework";
import Navbar from "./navbar/Navbar";

export default function FullFramework({ children }) {
    return(
        <MainFramework>
            <Navbar />
            {children}
        </MainFramework>
    )
}