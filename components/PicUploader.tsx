import {AiOutlineCloudUpload} from 'react-icons/ai'
import {useState, useEffect} from 'react';

export default function PicUploader(
    {sendData}:
    {sendData: (value: File) => void}
    ) {

    const [img, setImg] = useState<File | null>();
    const [preview, setPreview] = useState<string | null>();

    function handlePicChange(event: any) {
        const file = event.target.files[0]
        if (!file) {
            console.log("ERROR: No file found");
            return;
        }
        if (file.size > 1000 * 1000 * 10){ 
            console.log("ERROR: Size too large (hehe)");
            return;
        }
        if (file.type.substring(0,5) != "image"){
            console.log("ERROR: not an image");
            return;
        }
        setImg(file);
        sendData(file);
    }

    useEffect(() => {
        if (img){
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                // sendData("image", reader.result as string);
            }
            reader.readAsDataURL(img);
        } else {
            setPreview(null);
        }
    }, [img]);

    function showImageOrIcon() {
        if (preview){
            return (
                <div>
                    <input type="file" id='collectionpictureicon' 
                        accept='image/*'
                        onChange={handlePicChange}/>
                    <label htmlFor="collectionpictureicon" className='cursor-pointer'>
                        <img src={preview} alt="image preview" style={{objectFit: 'cover'}}/>
                    </label>
                </div>
            )
        }
        return (
            <div className="upload-icon">
                <input type="file" id='collectionpictureicon' 
                    accept='image/*'
                    onChange={handlePicChange}/>
                <label htmlFor="collectionpictureicon" className='cursor-pointer'>
                    <AiOutlineCloudUpload name='upload'/>
                </label>
            </div>
        )
    }

    return (
        <div className="flex flex-row pb-2 gap-4 items-center">
            <div className="upload-icon-box">
                {showImageOrIcon()}
            </div>

            <div className="flex flex-col items-start gap-1">
                <p>
                    Collection picture *
                </p>
                <input type="file" id='collectionpicturebutton' 
                    accept='image/*'
                    onChange={handlePicChange}/>
                <label htmlFor="collectionpicturebutton" className='upload-button'>
                    Upload
                </label>
            </div>

        </div>
    )
}