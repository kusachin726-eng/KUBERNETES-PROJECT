const params = {
    email_request: {
        PRODUCTION: {
            EMAIL: {
                FROM: '',
                SUPPORT: ''
            }
        },
        STAGING: {
            EMAIL: {
                FROM: '',
                SUPPORT: ''
            }
        }
    },
    alerts_request: {
        PRODUCTION: {
            EMAIL: {
                FROM: '',
                SUPPORT: ''
            }
        },
        STAGING: {
            EMAIL: {
                FROM: '',
                SUPPORT: ''
            }
        }
    },
    stateCodes: {
        "Jammu & Kashmir": "01",
        "Himachal Pradesh": "02",
        "Punjab": "03",
        "Chandigarh": "04",
        "Uttarakhand": "05",
        "Haryana": "06",
        "Delhi": "07",
        "Rajasthan": "08",
        "Uttar Pradesh": "09",
        "Bihar": "10",
        "Sikkim": "11",
        "Arunachal Pradesh": "12",
        "Nagaland": "13",
        "Manipur": "14",
        "Mizoram": "15",
        "Tripura": "16",
        "Meghalaya": "17",
        "Assam": "18",
        "West Bengal": "19",
        "Jharkhand": "20",
        "Odisha": "21",
        "Chhattisgarh": "22",
        "Madhya Pradesh": "23",
        "Gujarat": "24",
        "Daman & Diu": "25",
        "Dadra & Nagar Haveli": "26",
        "Maharashtra": "27",
        "Andhra Pradesh": "28",
        "Karnataka": "29",
        "Goa": "30",
        "Lakshadweep": "31",
        "Kerala": "32",
        "Tamil Nadu": "33",
        "Puducherry": "34",
        "Andaman & Nicobar Islands": "35",
        "Telangana": "36",
        "Andhra Pradesh": "37"
    },
    JOURNEY_TYPES: {
        ONE_WAY: 'ONE_WAY',
        ROUND_TRIP: 'ROUND_TRIP',
        MULTI_CITY: 'MULTI_CITY',
        OPEN_JAW: 'OPEN_JAW',
        CONNECTING: 'CONNECTING',
        DIRECT: 'DIRECT',
        MULTI_AIRLINE: 'MULTI_AIRLINE',
        DOMESTIC: 'DOMESTIC',
        INTERNATIONAL: 'INTERNATIONAL',
        CHARTER: 'CHARTER'
    },
    BOOKING_TIME_SLOTS_RULES: {
        companyOpen: "05:00",
        companyClose: "23:00",
        slotDurationHours: 2,
        slotStepHours: 1,
        hoursBeforePickupEnd: 6,
        hoursBeforePickupStart: 48
    },
    BOOKING_FARE: {
        baseFare: 499,
        platformFee: 0,
        gstPercentage: 18,
        convenienceFee: 0,
        freeDistanceKm: 20,
        extraPerBagFare: 100,
        perKmFareAfterFree: 25
    },
    BOOKING_CANCEL_OPTIONS: [
        "Flight Cancelled by Airline" ,
        "Schedule Change by Airline" ,
        "Personal Reasons" ,
        "Health Issues" ,
        "Other"
    ],
    PRIVACY: {
      lastUpdated: '2026-02-12',
      sections: [
        {
          title: 'Introduction',
          content: 'Dropty Airlines ("we", "us", or "our") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.'
        },
        {
          title: 'Information We Collect',
          subsections: [
            {
              subtitle: 'Personal Information',
              content: 'Name, email address, phone number, passport details, payment information'
            },
            {
              subtitle: 'Travel Information',
              content: 'Flight preferences, booking history, seat selections, special meal requests'
            },
            {
              subtitle: 'Device Information',
              content: 'IP address, browser type, device type, operating system'
            }
          ]
        },
        {
          title: 'How We Use Your Information',
          content: 'We use collected information to process bookings, improve customer service, send promotional emails, prevent fraud, and comply with legal obligations.'
        },
        {
          title: 'Data Security',
          content: 'We implement industry-standard encryption (SSL/TLS) and security measures. Your sensitive data is protected using AES-256 encryption and stored securely in our PostgreSQL database.'
        },
        {
          title: 'Third-Party Sharing',
          content: 'We share information only with payment processors (Razorpay), cloud storage providers (AWS S3, Azure Blob Storage), and when required by law.'
        },
        {
          title: 'Your Rights',
          content: 'You have the right to access, correct, or delete your personal data. Contact our privacy team at privacy@dropty.com to exercise these rights.'
        },
        {
          title: 'Cookies',
          content: 'We use cookies for session management and analytics. You can disable cookies in your browser settings, though some features may not work properly.'
        },
        {
          title: 'Contact Us',
          content: 'For privacy concerns, contact us at privacy@dropty.com or visit our office at 123 Aviation Street, Tech City, TC 12345.'
        }
      ],
      contact: {
        email: 'privacy@dropty.com',
        phone: '+1-800-DROPTY-1',
        address: '123 Aviation Street, Tech City, TC 12345'
      }
    },

    FAQ: {
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      categories: [
        {
          id: 'shipping',
          title: 'Shipping & Delivery',
          icon: '📦',
          faqs: [
            { 
              question: 'How do I track my shipment?', 
              answer: 'You can track your shipment using the tracking ID provided in your booking confirmation email or SMS. Visit our tracking page and enter your ID.' 
            },
            { 
              question: 'What are the delivery charges?', 
              answer: 'Delivery charges vary based on distance, weight, and delivery speed. You can get an estimate on our pricing page before booking.' 
            },
            {
              question: 'Do you offer international shipping?',
              answer: 'Yes, Dropty offers international shipping to over 200 countries. Customs duties may apply depending on the destination.'
            }
          ]
        },
        {
          id: 'billing',
          title: 'Billing & Payments',
          icon: '💳',
          faqs: [
            { 
              question: 'What payment methods do you accept?', 
              answer: 'We accept all major credit/debit cards, PayPal, and bank transfers.' 
            },
            { 
              question: 'How can I get an invoice?', 
              answer: 'Invoices are automatically emailed to you after payment. You can also download them from your account dashboard.' 
            }
          ]
        },
        {
          id: 'account',
          title: 'Account & Support',
          icon: '👤',
          faqs: [
            { 
              question: 'How do I reset my password?', 
              answer: 'Go to the login page and click "Forgot Password". Follow the instructions sent to your email to reset it.' 
            },
            { 
              question: 'How do I contact customer support?', 
              answer: 'You can reach our support team 24/7 via the "Contact Us" page or by emailing support@dropty.com.' 
            }
          ]
        },
        {
          id: 'special-needs',
          title: 'Special Requirements',
          icon: '♿',
          faqs: [
            {
              question: 'Do you accommodate passengers with disabilities?',
              answer: 'Yes, we provide wheelchair assistance, accessible seating, priority boarding, and other accommodations. Please inform us during booking.'
            },
            {
              question: 'Can I bring a service animal on board?',
              answer: 'Certified service animals are allowed in the cabin at no additional cost. Provide documentation during check-in.'
            },
            {
              question: 'Do you offer special meal requests?',
              answer: 'Yes, we offer vegetarian, vegan, gluten-free, and other dietary options. Request during booking or contact us 24 hours before flight.'
            },
            {
              question: 'Can pregnant women fly with Dropty?',
              answer: 'Yes, until 37 weeks gestation. Provide a medical certificate from your doctor for flights after 24 weeks.'
            }
          ]
        }
      ]
    },
    TERMS: {
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      sections: [
        {
          title: 'Introduction',
          content: 'Welcome to Dropty. By using our website and services, you agree to comply with and be bound by the following terms and conditions.'
        },
        {
          title: 'Services',
          content: 'Dropty provides logistics and delivery services. We reserve the right to modify or discontinue any service at any time without notice.'
        },
        {
          title: 'User Responsibilities',
          content: 'Users are responsible for providing accurate information for shipments and ensuring compliance with all applicable laws and regulations.'
        },
        {
          title: 'Liability',
          content: 'Dropty is not liable for any indirect, incidental, or consequential damages arising from the use of our services, except as required by law.'
        },
        {
          title: 'Contact Us',
          content: 'If you have any questions about these Terms, please contact us at support@dropty.com.'
        }
      ]
    }
}

module.exports = params;
