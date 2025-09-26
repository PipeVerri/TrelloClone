import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {Setter} from "@/utils/types";

interface Props {
    createFunc: () => void;
    name: string;
    setter: Setter<string>
}

export default function BoardCreation({createFunc, name, setter}: Props) {
    return (
        <div className="bg-green-400 rounded-2xl items-center justify-center flex w-preview-w h-preview-h p-4">
            <div className="box-border flex items-center justify-center p-4 w-full bg-gray-200 rounded-xl">
                <input
                    type="text"
                    className="flex-1 min-w-0 bg-white rounded-xl text-center text-lg font-semibold h-10 px-4 border-w-0"
                    value={name}
                    onChange={(e) => setter(e.target.value)}
                />
                <button className="ml-3 flex-none h-10 w-10 flex items-center justify-center bg-blue-500 rounded-xl" onClick={createFunc}>
                    <FontAwesomeIcon icon={faCheck} size="lg" color="white" />
                </button>
            </div>
        </div>
    )
}