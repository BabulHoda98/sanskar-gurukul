function PrivacyPolicyPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-6">
            At Sanskar Gurukul Ashram School, we are committed to protecting the privacy of our students, parents, and staff. This Privacy Policy outlines how we collect, use, and safeguard your personal information.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information Collection</h2>
          <p className="mb-4">
            We collect personal information necessary for educational and administrative purposes. This includes, but is not limited to:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Student details (name, date of birth, previous academic records)</li>
            <li>Parent/Guardian contact information</li>
            <li>Medical information pertinent to the student's safety</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use of Information</h2>
          <p className="mb-4">
            The information collected is used solely for school-related activities, such as:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Processing admissions and maintaining academic records</li>
            <li>Communicating with parents regarding school events and student progress</li>
            <li>Ensuring the health and safety of students on campus</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Protection</h2>
          <p className="mb-6">
            We implement strict security measures to prevent unauthorized access, alteration, or disclosure of personal data. Only authorized personnel have access to sensitive information.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Contact Us</h2>
          <p className="mb-6">
            If you have any questions or concerns regarding our privacy practices, please contact the school administration at info@sanskargurukul.com.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
