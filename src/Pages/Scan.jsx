import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import scan from '../assets/icons/scan.png'
import browser from '../assets/icons/browser.png'

const Scan = () => {
    const [fileName, setFileName] = useState('');
    const [selectedDisease, setSelectedDisease] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setUploadedImage(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleDiseaseSelect = (disease) => {
        setSelectedDisease(disease);
    };

    const handleScanNow = async () => {
        if (!selectedDisease) {
            alert('Please select a disease type first');
            return;
        }
        if (!uploadedImage) {
            alert('Please upload an image first');
            return;
        }

        const formData = new FormData();
        formData.append("image", uploadedImage);
        formData.append("diseaseType", selectedDisease);

        try {

            const apiResponse = await fetch("https://5000-iapst6l0no28alu0u25js-b78f53d0.manus.computer/scan", {
                method: "POST",
                body: formData,
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || "Failed to get scan results");
            }

            const aiResults = await apiResponse.json();

            navigate("/scan-result", {
                state: {
                    selectedDisease,
                    uploadedImage: URL.createObjectURL(uploadedImage),
                    scanResults: aiResults
                }
            });
        } catch (error) {
            console.error("Error during AI scan:", error);
            alert(`An error occurred during scanning: ${error.message}`);
        }
    };

    return (
        <section className='bg-radial-gradient min-h-screen flex justify-center items-center py-10'>
            <div className='text-center  text-white border-2 rounded-3xl p-20 '>
                <h2 className='text-4xl font-[700] pb-14'>Scan Now</h2>
                <p className='text-[14] font-semibold'>Choose the type of disease</p>

                <div className='flex justify-center items-center gap-5 py-5'>
                    <button
                        onClick={() => handleDiseaseSelect('Brain Tumor')}
                        className={`border-2 rounded-full py-2 px-6 text-[13px] font-bold transition-colors ${selectedDisease === 'Brain Tumor'
                                ? 'bg-Primary text-white border-Primary'
                                : 'text-slate-300 border-slate-300 hover:border-Primary hover:text-Primary'
                            }`}
                    >
                        Brain Tumor
                    </button>
                    <button
                        onClick={() => handleDiseaseSelect('Skin Cancer')}
                        className={`border-2 rounded-full py-2 px-6 text-[13px] font-bold transition-colors ${selectedDisease === 'Skin Cancer'
                                ? 'bg-Primary text-white border-Primary'
                                : 'text-slate-300 border-slate-300 hover:border-Primary hover:text-Primary'
                            }`}
                    >
                        Skin Cancer
                    </button>
                </div>

                <div className='py-5'>
                    <div className='flex items-center justify-between gap-5'>
                        <label className='font-semibold'>Upload Photo</label>
                        <button className="flex items-center bg-white text-slate-500 rounded-md px-6 font-semibold py-2 text-[12px] " onClick={handleClick}>
                            Browse..
                            <img className='w-4' src={browser} />
                        </button>
                    </div>

                    <input id="actual-btn"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        className=''
                        type='file'
                        accept="image/*"
                    />
                    {/* <p className='text-sm py-2'>{fileName}</p> */}
                </div>
                {uploadedImage && (
                    <div className="mt-4">
                        <img
                            src={URL.createObjectURL(uploadedImage)}
                            alt="Preview"
                            className="max-w-[200px] m-auto rounded-md shadow-md"
                        />
                    </div>
                )}
                <button
                    onClick={handleScanNow}
                    className='flex items-center shadow-lg m-auto mt-5 bg-Primary px-20 py-2 rounded-md text-sm gap-3 font-semibold hover:bg-opacity-90 transition-all'
                >
                    Scan Now <img className='w-6 h-6' src={scan} />
                </button>
            </div>
        </section>
    )
}

export default Scan
