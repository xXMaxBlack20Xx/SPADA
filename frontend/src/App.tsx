import './App.css'
import { LanguageProvider } from "./context/LanguageContext";
import Footer from './components/main/Footer';
import Header from './components/main/Header';
import SpadaMain from "./components/main/mainPage";

function App() {
  return (
    <LanguageProvider>
      <Header />
      <SpadaMain />
      <Footer />
    </LanguageProvider>
  )
}

export default App