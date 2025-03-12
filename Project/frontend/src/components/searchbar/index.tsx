import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Searchbar = (
    { placeholder }:{ placeholder: string }
) => {
    return (
        <form onSubmit={(e) => e.preventDefault()} className='w-full'>
            <div className='relative max-w-lg w-full'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FontAwesomeIcon icon={faSearch} className='text-gray-400'/>
                </div>
                <input
                    type="search"
                    name="search"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder={placeholder}
                />
                <button type='submit' className='sr-only'>Submit</button>
            </div>
        </form>
    )
};

export default Searchbar;