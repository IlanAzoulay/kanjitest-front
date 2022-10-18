import {useState} from 'react'
import {BsInfoCircle} from 'react-icons/bs'

export default function InfoCircle(
    {text}: // props
    {text: string} 
) {
    const [showInfo, toggleInfo] = useState(false);

return (
    <div className='info-icon' onClick={() => toggleInfo(!showInfo)}>
        <BsInfoCircle />

        <div className='relative'>
            {showInfo ? <div className='info-box'>{text}</div> : ''}
        </div>
        
    </div>
)
}