function TermsPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-6">
            Welcome to Sanskar Gurukul Ashram School. By enrolling your child or using our website, you agree to comply with the following terms and conditions.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Admissions & Enrollment</h2>
          <p className="mb-4">
            Admission is subject to seat availability and fulfillment of eligibility criteria. The school management reserves the right to accept or reject any application without assigning any reason.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Code of Conduct</h2>
          <p className="mb-4">
            Students are expected to maintain high standards of discipline, respect for teachers and peers, and adhere to the school uniform policy. Bullying or disruptive behavior will lead to strict disciplinary action.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Fee Payment</h2>
          <p className="mb-4">
            All tuition and transport fees must be paid by the specified due dates. Late payments may attract a penalty. Fees once paid are generally non-refundable, except as per specific school policies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Transport Facility</h2>
          <p className="mb-6">
            The school transport facility is a privilege, not a right. Students must follow bus safety rules. The school is not liable for delays caused by traffic or unforeseen circumstances.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Amendments</h2>
          <p className="mb-6">
            The school reserves the right to amend its rules, fees, and terms of service at any time. Notice of significant changes will be communicated to parents.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
