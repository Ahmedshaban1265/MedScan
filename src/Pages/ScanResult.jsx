import React from 'react'
import { useLocation } from 'react-router-dom'

const ScanResult = () => {
    const location = useLocation()
    const { selectedDisease, uploadedImage, scanResults } = location.state || {}

    // If no scanResults are passed, display an error or default to mock data
    if (!scanResults) {
        return (
            <section className='min-h-screen bg-gray-50 py-20'>
                <div className='max-w-6xl mx-auto px-6 text-center'>
                    <h1 className='text-4xl font-bold text-red-600 mb-12'>Error: No Scan Results Found</h1>
                    <p className='text-lg text-gray-700'>
                        It seems there was an issue getting the scan results. Please try scanning again.
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className='mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
                    >
                        Go Back to Scan
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className='min-h-screen bg-gray-50 py-20'>
            <div className='max-w-6xl mx-auto px-6'>
                <h1 className='text-4xl font-bold text-center text-gray-800 mb-12'>Scan Result</h1>
                
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                    {/* Image Section */}
                    <div className='bg-white rounded-2xl shadow-lg p-8'>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Uploaded Image</h2>
                        <div className='bg-black rounded-xl overflow-hidden'>
                            {uploadedImage ? (
                                <img 
                                    src={uploadedImage} 
                                    alt="Uploaded scan" 
                                    className='w-full h-80 object-cover'
                                />
                            ) : (
                                <div className='w-full h-80 bg-gray-900 flex items-center justify-center'>
                                    <div className='text-center text-gray-400'>
                                        <div className='w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center'>
                                            <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
                                            </svg>
                                        </div>
                                        <p>Medical Scan Image</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Segmentation Result Section (Conditional) */}
                    {selectedDisease === 'Brain Tumor' && scanResults.segmentation_image_base64 && (
                        <div className='bg-white rounded-2xl shadow-lg p-8'>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Segmentation Result</h2>
                            <div className='bg-black rounded-xl overflow-hidden'>
                                <img 
                                    src={`data:image/png;base64,${scanResults.segmentation_image_base64}`} 
                                    alt="Segmentation Mask" 
                                    className='w-full h-80 object-contain'
                                />
                            </div>
                            <p className='text-sm text-gray-500 mt-4'>{scanResults.segmentation_info}</p>
                        </div>
                    )}

                    {/* Results Section */}
                    <div className='space-y-6'>
                        {/* Disease Type */}
                        <div className='bg-white rounded-2xl shadow-lg p-8'>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Type of disease:</h2>
                            <p className='text-lg text-gray-600 font-medium'>{scanResults.diagnosis}</p>
                            <div className='mt-4 flex items-center'>
                                <span className='text-sm text-gray-500 mr-2'>Confidence:</span>
                                <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold'>
                                    {scanResults.confidence}
                                </span>
                            </div>
                        </div>

                        {/* About Disease */}
                        <div className='bg-white rounded-2xl shadow-lg p-8'>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>About this disease:</h2>
                            <p className='text-gray-600 leading-relaxed whitespace-pre-line'>
                                {scanResults.description}
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div className='bg-white rounded-2xl shadow-lg p-8'>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Recommendations:</h2>
                            <ul className='space-y-3'>
                                {scanResults.recommendations.map((recommendation, index) => (
                                    <li key={index} className='flex items-start'>
                                        <span className='bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5'>
                                            {index + 1}
                                        </span>
                                        <span className='text-gray-600'>{recommendation}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-4'>
                            <button 
                                onClick={() => window.history.back()}
                                className='flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
                            >
                                Scan Again                            </button>
                            <button 
                                onClick={() => window.print()}
                                className='flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
                            >
                                Download Report
                            </button>
                            <button 
                                onClick={() => window.location.href = '/booking'}
                                className='flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors'
                            >
                                Book Appointment
                            </button>                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className='mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6'>
                    <div className='flex items-start'>
                        <svg className='w-6 h-6 text-yellow-600 mr-3 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                        </svg>
                        <div>
                            <h3 className='text-yellow-800 font-semibold mb-2'>Medical Disclaimer</h3>
                            <p className='text-yellow-700 text-sm'>
                                This AI-powered analysis is for informational purposes only and should not replace professional medical advice. 
                                Please consult with a qualified healthcare provider for proper diagnosis and treatment recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ScanResult
