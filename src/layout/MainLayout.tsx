import AnimatedGradientBackground from "../components/Background.tsx";
import { PropsWithChildren } from "react";


const MainLayout = ({ children }: PropsWithChildren<{}> ) => {
  return (
    <div className="flex flex-col min-h-screen py-0">
      <main className="container mx-auto max-w-xl pt-20 flex-1 mt-14">
        {children}
        <AnimatedGradientBackground />
      </main>
    </div>
  );
};

export default MainLayout;
