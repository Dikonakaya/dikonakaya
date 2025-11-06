export default function AboutMe() {

    return (
        <section className="bg-[#1E1E25] min-h-[35vw] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <h3 className="text-center text-3xl font-semibold text-white mt-6 mb-4">ABOUT ME</h3>
                <div className="h-[2px] bg-white w-full max-w-[600px] mx-auto mb-6" aria-hidden="true" />
                <div className="w-full max-w-3xl bg-[#0f1113]/30 backdrop-blur-sm] rounded-md p-8">
                    <p className="text-sm text-slate-300 text-center mt-2">
                        This is a placeholder About Me page. Replace this with your actual bio and content.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-white font-semibold">Quick facts</h4>
                            <p className="text-sm text-slate-300 mt-2">Add your bio here.</p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold">Contact</h4>
                            <p className="text-sm text-slate-300 mt-2">Use the contact page to receive messages.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
