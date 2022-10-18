import InfoCircle from '../components/InfoCircle'
import {useState} from 'react'

function FieldComponent(
    {attribute, name, info, placeholder, required, max, sendData}:
    {attribute: string, 
    name: string, 
    info: string | null, 
    placeholder: string,
    required: boolean,
    max: number | null,
    sendData: (source: string, value: string | number) => void}
){
    const [numberValue, setNumberValue] = useState('');

    const numbersOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
        const result = event.target.value.replace(/\D/g, '');
        setNumberValue(result);
        sendData(attribute, result);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        sendData(attribute, event.target.value);
    };

    function getField() {
        if (!max){  // Text field
            return (
                <input className='field' type="text" 
                placeholder={placeholder}
                name={name}
                maxLength={50}
                onChange={(event) => handleChange(event)}/>
            )
        } else {  // number field
            return (
                <div className='flex flex-row w-full'>
                    <input className='field-number' type="text" 
                        placeholder={placeholder}
                        name={name}
                        value={numberValue}
                        maxLength={("" + max).length}
                        onChange={(event) => numbersOnly(event)}/>
                    <div className='field-number-max'>
                        {"Max: " + max}
                    </div>
                </div>
            )
        }
    }

    return (
        <div className='form-group' key={attribute}> 
            <label htmlFor={name} >
                {required? name + " *" : name}
            </label>

            {info ? <InfoCircle text={info}/> : ''}
            
            {getField()}
        </div>)
}

export default FieldComponent;