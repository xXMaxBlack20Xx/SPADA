import About from "./pageComponents/About";
import Capabilities from "./pageComponents/Capabilities";
import Join from "./pageComponents/Join";
import Title from "./pageComponents/Title";

export default function SpadaMain() {
  return (
    <>
      <Title />
      <About imageSrc="src/assets/img/main/main_stats.png"/>
      <Capabilities />
      <Join imageSrc="src/assets/img/main/SPADA_Logo_Letras_B&W.png"/>
    </>
  );
}