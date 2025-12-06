import React from "react";

interface SignupLayoutProps {
    children: React.ReactElement | React.ReactElement[];
    showLogo?: boolean;
    headerText?: string;
    showTermsInCard?: boolean;
    footerContent?: React.ReactNode;
    showWhiteAreas?: boolean;
}

export function SignupLayout({ children, showLogo = true, headerText, showTermsInCard = true, footerContent, showWhiteAreas = false }: SignupLayoutProps) {

    const childrenArr = React.Children.toArray(children)

    return (
        <div className="min-h-screen px-4 relative overflow-hidden" style={{ backgroundColor: '#824DFF' }}>
            {/* White decorative area at top */}
            {showWhiteAreas && (
                <div className="absolute top-0 left-4 right-4 bg-white h-48 rounded-b-[2rem]"></div>
            )}

            <div className={`w-full max-w-md mx-auto relative z-10 ${headerText ? 'min-h-screen flex flex-col justify-center' : ''}`}>
                {/* Header */}
                {showLogo && (
                    <div className="flex justify-center pt-24 mb-12">
                        <div className="header p-2 inline-block">
                            <img src="/black-logo.png" alt="WealthDost Logo" className="h-16 mx-auto" />
                        </div>
                    </div>
                )}

                {/* Header Text */}
                {headerText && (
                    <div className="text-center mb-8">
                        <p className="text-white text-lg">{headerText}</p>
                    </div>
                )}

                <div className="backdrop-blur-md rounded-2xl shadow-2xl p-8" style={{ backgroundColor: '#9466FF', marginTop: showLogo ? 'calc(50vh - 350px)' : '' }}>
                    {childrenArr}

                    {/* Links */}
                    {showTermsInCard && (
                        <div className="mt-6 text-center">
                            <p className="text-xs text-white/90">
                                By continuing, you agree to our{" "}
                                <a href="https://wealthdost.com/terms" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="https://wealthdost.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Content */}
                {footerContent && (
                    <div className="mt-6">
                        {footerContent}
                    </div>
                )}

                {/* Terms outside card */}
                {!showTermsInCard && (
                    <div className="mt-6 text-center">
                        <p className="text-xs text-white/90">
                            By continuing, you agree to our{" "}
                            <a href="https://wealthdost.com/terms" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="https://wealthdost.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                )}
            </div>

            {/* White decorative area at bottom */}
            {showWhiteAreas && (
                <div className="absolute bottom-0 left-4 right-4 bg-white rounded-t-[2rem]" style={{ height: '100px' }}></div>
            )}
        </div>
    )
}