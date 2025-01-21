import MainForm from "./components/MainForm";
import SearchResults from "./components/SearchResults";

function App() {
 return (
  <div className="container mx-auto w-full flex flex-col lg:flex-row gradient-borders p-6 gap-4">      
   <MainForm/>
   <SearchResults/>
  </div>

 );
}

export default App
