const params = require("../../../config/params");


class StaticPagesController {
  async getFaq(req, res) {
    const faqData = params.FAQ;

    res.render('faq', { 
      title: 'Frequently Asked Questions - Dropty',
      faq: faqData 
    });
  }

  async getTerms(req, res) {
    res.render('terms', { 
      title: 'Terms and Conditions - Dropty',
      terms: params.TERMS 
    });
  }

  async getPrivacy(req, res) {
    res.render('privacy', { 
      title: 'Privacy Policy - Dropty',
      privacy: params.PRIVACY 
    });
  }
}

module.exports = new StaticPagesController();
