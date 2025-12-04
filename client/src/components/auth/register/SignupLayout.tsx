import React from "react";
import { Link } from "wouter";

interface SignupLayoutProps {
    children: React.ReactElement | React.ReactElement[];
    showLogo?: boolean;
    headerText?: string;
    showTermsInCard?: boolean;
    footerContent?: React.ReactNode;
}

export function SignupLayout({ children, showLogo = true, headerText, showTermsInCard = true, footerContent }: SignupLayoutProps) {

    const childrenArr = React.Children.toArray(children)

    return (
        <div className="min-h-screen px-4 relative overflow-hidden" style={{ backgroundColor: '#824DFF' }}>
            <div className={`w-full max-w-md mx-auto ${headerText ? 'min-h-screen flex flex-col justify-center' : ''}`}>
                {/* Header */}
                {showLogo && (
                    <div className="flex justify-center pt-12 mb-12">
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
                                <Link href="/terms" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                    Privacy Policy
                                </Link>
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
                            <Link href="/terms" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-white hover:text-white/80 underline transition-colors duration-300">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}