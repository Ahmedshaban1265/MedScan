import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import scan from '../assets/icons/scan.png'
import browser from '../assets/icons/browser.png'

const Scan = () => {
    const [fileName, setFileName] = useState('');
    const [selectedDisease, setSelectedDisease] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null); // سيتم تخزين كائن File هنا
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        console.log(event.target.files)
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setUploadedImage(file); // تخزين كائن File الفعلي
        } else {
            setFileName('');
            setUploadedImage(null);
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
        formData.append("image", uploadedImage); // إرسال كائن File
        formData.append("diseaseType", selectedDisease);

        try {
            // هذا هو المسار الذي سيتصل بالواجهة الخلفية التي أنشأتها
            const apiResponse = await fetch("https://web-production-9bb3.up.railway.app/scan", {
                method: "POST",
                body: formData,
            } );

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || "Failed to get scan results");
            }

            const aiResults = await apiResponse.json();

            // التنقل إلى صفحة النتائج مع النتائج الحقيقية من الـ AI
            navigate("/scan-result", {
                state: {
                    selectedDisease,
                    uploadedImage: URL.createObjectURL(uploadedImage), // نمرر URL لعرض الصورة في صفحة النتائج
                    scanResults: aiResults // النتائج الحقيقية من الـ AI
                }
            });
        } catch (error) {
            console.error("Error during AI scan:", error);
            alert(`An error occurred during scanning: ${error.message}`);
        }
    };

    return (
        <section className='bg-radial-gradient h-screen flex justify-center items-center'>
            <div className='text-center  text-white border-2 rounded-3xl p-20 '>
                <h2 className='text-4xl font-[700] pb-14'>Scan Input</h2>
                <p className='text-[14] font-semibold'>Choose the type of disease</p>

                <div className='flex justify-center items-center gap-5 py-5'>
                    <button 
                        onClick={() => handleDiseaseSelect('Brain Tumor')}
                        className={`border-2 rounded-full py-2 px-6 text-[13px] font-bold transition-colors ${
                            selectedDisease === 'Brain Tumor' 
                                ? 'bg-Primary text-white border-Primary' 
                                : 'text-slate-300 border-slate-300 hover:border-Primary hover:text-Primary'
                        }`}
                    >
                        Brain Tumor
                    </button>
                    <button 
                        onClick={() => handleDiseaseSelect('Skin Cancer')}
                        className={`border-2 rounded-full py-2 px-6 text-[13px] font-bold transition-colors ${
                            selectedDisease === 'Skin Cancer' 
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
                    <p className='text-sm py-2'>{fileName}</p>
                </div>

                <button 
                    onClick={handleScanNow}
                    className='flex items-center shadow-lg m-auto bg-Primary px-20 py-2 rounded-md text-sm gap-3 font-semibold hover:bg-opacity-90 transition-all'
                >
                    Scan Now <img className='w-6 h-6' src={scan} />
                </button>
            </div>
        </section>
    )
}

export default Scan
