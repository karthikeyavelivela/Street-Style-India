import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-center mb-12">CONTACT US</h1>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="space-y-8">
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                        <Mail className="w-8 h-8" />
                        <div>
                            <h3 className="font-bold text-xl mb-2">Email</h3>
                            <p className="text-gray-600">for support: support@ssi.com</p>
                            <p className="text-gray-600">for business: business@ssi.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                        <Phone className="w-8 h-8" />
                        <div>
                            <h3 className="font-bold text-xl mb-2">Phone</h3>
                            <p className="text-gray-600">+91 98765 43210</p>
                            <p className="text-gray-500 text-sm">Mon-Fri 9am to 6pm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                        <MapPin className="w-8 h-8" />
                        <div>
                            <h3 className="font-bold text-xl mb-2">Studio</h3>
                            <p className="text-gray-600">123 Fashion Street, Urban District</p>
                            <p className="text-gray-600">Hyderabad, India 500001</p>
                        </div>
                    </div>
                </div>

                <form className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div>
                        <label className="font-bold text-sm mb-2 block">Name</label>
                        <input type="text" className="w-full border p-3 rounded bg-gray-50" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="font-bold text-sm mb-2 block">Email</label>
                        <input type="email" className="w-full border p-3 rounded bg-gray-50" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="font-bold text-sm mb-2 block">Message</label>
                        <textarea className="w-full border p-3 rounded bg-gray-50 h-32" placeholder="How can we help?"></textarea>
                    </div>
                    <button className="w-full bg-black text-white font-bold py-4 rounded hover:bg-gray-800 transition-colors">
                        SEND MESSAGE
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
