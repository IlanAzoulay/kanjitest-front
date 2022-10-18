import {IoIosArrowDown} from 'react-icons/io'
import {useState} from 'react'
import InfoCircle from '../components/InfoCircle'

export default function Dropdown(
    {labelName, options, info, attribute, required, sendData}:
    {labelName: string,
    options: string[],
    info:string | null,
    attribute: string,
    required: boolean,
    sendData: (source: string, value: string) => void}
) {

    const [choice, setChoice] = useState("-- Select --");
    const [open, setOpen] = useState(false);

    function newChoice(val: string) {
        setChoice(val);
        sendData(attribute, val);  // send data to parent
    }

    function dropdownList() {
        if (!open) {return ''}
        return (
            <div className='dropdown-pos'>
                <div className="dropdown-list">
                    {options.map((val, _) => {
                        return(
                            <div className="dropdown-option" 
                                key={val}
                                onClick={() => newChoice(val)}>
                                {val}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className='form-group'>

            {required? labelName + " *" : labelName}

            {info ? <InfoCircle text={info}/> : ''}
            <div className="field dropdown-container" onClick={() => setOpen(!open)}>
                {choice}
                <div className='dropdown-icon'>
                    <IoIosArrowDown/>
                </div>
                {dropdownList()}
            </div>
        </div>
    )
}