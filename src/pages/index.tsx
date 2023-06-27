import MainContent from "@/Components/MainContent";
import NavBar from "@/Components/NavBar";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

type Username = string | null;

export default function App() {
  const [username, setUsername] = useState<Username>(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUsername = Cookies.get("username");

    if (getUsername) {
      setUsername(String(Cookies.get("username")));
    } else {
      setUsername(null);
    }
  }, [loggedOut]);

  const handleLogout = () => {
    Cookies.remove("username");
    setLoggedOut(true);
  };

  return (
    <div className="bg-gray-50">
      {!username && (
        <div>
          <div className="w-[80%] h-screen mx-auto flex items-center mt-[-50px]">
            <div className="w-[400px] h-[400px] mx-auto flex flex-col justify-evenly items-center bg-white shadow-lg">
              <p className="">Welcome to BudgetWizz!</p>
              <img src="data:image/png;base64,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" />
              <button
                onClick={() => router.push("/signUp")}
                className="bg-[#ff0000] text-white w-[150px] py-2 rounded-xl font-semibold"
              >
                sign up
              </button>

              <button
                onClick={() => router.push("/login")}
                className="border-4 border-[#ff0000] text-[#ff0000] w-[150px] py-1 rounded-xl font-semibold"
              >
                log in
              </button>
            </div>
          </div>
        </div>
      )}

      {username != undefined && (
        <>
          <div className="flex justify-center items-center mx-4 border-b-4 border-[#272643] md:border-none">
            <NavBar />
            <button
              className="bg-red-300 text-red-700 px-2 py-1 rounded-md hover:shadow-lg"
              onClick={handleLogout}
            >
              log out
            </button>
          </div>
          <MainContent />
        </>
      )}
    </div>
  );
}
