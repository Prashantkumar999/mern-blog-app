import {useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
    const { theme } = useSelector((state) => state.theme);

    return (
        <div className={theme}>
            <div className="bg-white text-gray-400 dark:text-white dark:bg-black h-[100vh]">
                {children}
            </div>
        </div>
    )
}