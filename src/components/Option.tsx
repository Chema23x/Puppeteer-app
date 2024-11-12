
type OptionProps = {
    title: string;
    setValue: (value: string) => void;
    start: (value: string) => Promise<void>;
    cleanState: () => void;
};


export const Option = ({ title, setValue, start, cleanState}: OptionProps) => {

    return (
        <button onClick={() => { setValue(title), start(title), cleanState() }}
            className="shadow-md rounded-md bg-emerald-600 text-white flex flex-col items-center justify-center gap-5 hover:scale-110 transition ease-in-ou duration-300">
            <h2 className="text-4xl font-bold">{title}</h2>
            <p className="text-xl">¡Encuentra el mejor precio para {title}!</p>
        </button>
    )
}