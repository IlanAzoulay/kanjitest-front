import data from '../data/data.json'
import Dropdown from '../components/Dropdown'
import {useState} from 'react'
import FieldComponent from '../components/FieldComponent'
import PicUploader from '../components/PicUploader'
import Web3 from 'web3'
import axios from 'axios'
import {storage} from '../classes/firebase'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

import {Form} from '../classes/form';

type Field = {
    attribute: string,
    name: string,
    required: boolean,
    type: string,
    options?: string[],
    info?: string,
    max?: number,
    placeholder?: string
}

function Info(){

    const fields: Field[] = data as Field[];

    const [image, setImage] = useState<File | null>(null);
    // const [imagePreview, setImagePreview] = useState<string>("");

    const [blockchain, setBlockchain] = useState<string>("");
    const [platform, setPlatform] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [owner, setOwner] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>("");

    function isNumber(str: string): boolean {
        if (typeof str !== 'string') {
          return false;
        }
        if (str.trim() === '') {
          return false;
        }
        return !Number.isNaN(Number(str));
    }

    const setImageFrom = (value: File) => {
        setImage(value);
    }

    const setDataFrom = (source: string, value: string | number) => {
        switch(source){
            case("blockchain"):{
                setBlockchain("" + value);
                break;}
            case("platform"):{
                setPlatform("" + value);
                break;}
            case("name"):{
                setName("" + value);
                break;}
            case("symbol"):{
                setSymbol("" + value);
                break;}
            case("amount"):{
                if (isNumber(value + "")){
                    setAmount(+value);
                }
                break;}
            case("owner"):{
                setOwner("" + value);
                break;}
        }
    }
    const changeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
    }

    function isRequired(attribute: string): boolean {
        let index: keyof typeof fields;
        for (index in fields){
            if (fields[index].attribute === attribute){
                return fields[index].required;
            }
        }
        return false;
    }
    function getMaxAmount(attribute: string): number{
        let index: keyof typeof fields;
        for (index in fields){
            if (fields[index].attribute === attribute){
                return (fields[index].max? fields[index].max as number : 0);
            }
        }
        return 0;
    }
    function getAttributeType(attribute: string): string{
        let index: keyof typeof fields;
        for (index in fields){
            if (fields[index].attribute === attribute){
                return fields[index].type;
            }
        }
        return "other";
    }

    async function uploadImage(img: File): Promise<string> {
        let randomID = (Math.random() + 1).toString(36).substring(2);
        const imgref = ref(storage, ('images/' + img.name + randomID));
        await uploadBytes(imgref, image as File)
        let url = getDownloadURL(imgref)
        console.log("Image uploaded: ", url);

        return url;
    }

    async function submitData() {
        // let state = {image, blockchain, platform, name, symbol, amount, owner, description};
        let state = new Form("", blockchain, platform, name, symbol, amount, owner, description)

        // Check image
        if (!image){
            setErrorMessage("ERROR: missing image");
            return;
        }

        // Check if required* string attributes have all been filled, and if number attributes are within range
        let key: keyof typeof state;
        for (key in state) {
            if (getAttributeType(key) === "text" || getAttributeType(key) === "scroll"){
                if ((state[key] as string).length <= 0){
                    if (isRequired(key)){
                        setErrorMessage("ERROR: Missing " + key);
                        return;
                    }
                }
            }
            else if (getAttributeType(key) === "number"){
                let max = getMaxAmount(key);
                if (state[key] > max!){
                    setErrorMessage("ERROR: " + key + " is above limit (" + max + ")");
                    return;
                }
            }
        }
        // Check owner ETH address
        if (!Web3.utils.isAddress(owner)){
            setErrorMessage("ERROR: Address is not valid");
            return;
        }

        // TODO: upload image, and get URL
        let url = await uploadImage(image);
        state.image = url;

        console.log("State: ", state);
        setErrorMessage("");  // No error message

        // Send to back-end
        axios
            .post("https://kanjiback.herokuapp.com/forms", state)
            .then(response => {
                console.log(response);
                setErrorMessage("Response from back: " + response.statusText);
            })
            .catch(error => {
                console.log(error);
                setErrorMessage("Response from back: " + error.statusText);
            })
    }
    
    return (
    <div className='page'>
        <h1>
            Complete informations
        </h1>
        <p className='pb-6'>
            Description. Ok, hear me out. So it's about this guy named Rick. He's a scientist that turns himself into a pickle. 
            Funniest thing I've seen. In the episode Rick's grandson Morty flips over a talking pickle... And its Rick! It's the funniest thing.
        </p>

        <PicUploader sendData={setImageFrom}/>

        <form className='fields-grid'>
            {
                fields.map((val, index) =>
                {
                    if (val.type === "scroll"){
                        return <Dropdown
                            attribute={val.attribute}
                            key={val.attribute}
                            labelName={val.name}
                            options={val.options!}
                            info={val.info? val.info! : null}
                            required={val.required}
                            sendData={setDataFrom}
                            />

                    } else if (val.type === "text" || val.type === "number"){
                        return (
                            <FieldComponent key={val.attribute}
                            attribute={val.attribute}
                            name={val.name}
                            info={val.info? val.info! : null}
                            placeholder={val.placeholder? val.placeholder : ""}
                            required={val.required}
                            max={val.max? val.max : null}
                            sendData={setDataFrom} 
                            />
                        )
                    }
                })
            }
        </form>

        <button className='more-options'>
            More options
        </button>

        <div className="form-group pt-2">
            <label htmlFor="Description">Description</label>
            <textarea className='field w-full h-24'
                value={description}
                onChange={(event) => changeDescription(event)}
                placeholder="Enter a description"
                name="Description"/>
        </div>

        <button className='submit-button' onClick={() => submitData()}>
            Continue
        </button>

        {errorMessage.length > 0 ? <div className='error-message'>{errorMessage}</div> : ""}

    </div>)
}

export default Info;