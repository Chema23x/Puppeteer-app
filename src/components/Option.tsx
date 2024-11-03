import { AppProps } from "next/app";

type OptionProps = {
    title: string;
    setValue: (value: string) => void;
};

const openWebPage = async () => {
    try {
        const response = await fetch('/api/puppeteer');
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Failed to open web page', error);
    }
};

export const Option = ({ title, setValue }: OptionProps) => {

    return (
        <button onClick={() => { setValue(title), openWebPage() }}
            className="shadow-md rounded-md bg-emerald-600 text-white flex flex-col items-center justify-center gap-5 hover:scale-110 transition ease-in-ou duration-300">
            <h2 className="text-4xl font-bold">{title}</h2>
            <p className="text-xl">¡Encuentra el mejor precio para {title}!</p>
        </button>
    )
}