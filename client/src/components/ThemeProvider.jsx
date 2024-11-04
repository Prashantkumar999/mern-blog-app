import {useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
    const { theme } = useSelector((state) => state.theme);

    return (
        <div className={theme}>
            <div className="bg-white text-black dark:text-gray-400 dark:bg-black">
                {children}
            </div>
        </div>
    )
}