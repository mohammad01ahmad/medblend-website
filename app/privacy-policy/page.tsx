import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
    return (
        <div className="pt-40 md:pt-50 max-w-4xl mx-auto px-6 py-12 bg-transparent text-[hsl(0,0%,80%)] font-sans leading-relaxed">
            {/* Header Section */}
            <header className="mb-12 border-b border-[hsl(0,0%,20%)] pb-8">
                <h1 className="text-4xl font-bold text-white mb-2">PRIVACY POLICY</h1>
                <p className="text-sm text-[hsl(0,0%,50%)]">Last updated February 16, 2026</p>
            </header>

            {/* Intro */}
            <section className="mb-10 text-lg">
                <p className="mb-4">
                    This Privacy Notice for <span className="text-white font-semibold">MedBlendApp</span> (&quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;), describes how and why we might access, collect, store, use, and/or share (&quot;<strong>process</strong>&quot;) your personal information when you use our services (&quot;<strong>Services</strong>&quot;), including when you:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-[hsl(0,0%,70%)]">
                    <li>
                        Visit our website at{" "}
                        <a href="https://medblend.vercel.app/" className="text-[hsl(245,72%,59%)] hover:underline">
                            https://medblend.vercel.app/
                        </a>
                    </li>
                    <li>Download and use our mobile application (MedBlendApp)</li>
                    <li>Engage with us in other related ways, including marketing or events.</li>
                </ul>
            </section>

            {/* Contact Note */}
            <div className="bg-[hsl(0,0%,10%)] p-6 rounded-2xl mb-12 border border-[hsl(0,0%,15%)]">
                <p className="text-sm italic">
                    <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies, please do not use our Services. Contact us at{" "}
                    <a href="mailto:medblendapp@gmail.com" className="text-[hsl(245,72%,59%)]">medblendapp@gmail.com</a>.
                </p>
            </div>

            {/* Summary Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">Summary of Key Points</h2>
                <div className="space-y-6">
                    <KeyPoint
                        title="What personal information do we process?"
                        desc="When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about personal information you disclose to us"
                    />
                    <KeyPoint
                        title="Do we process sensitive info?"
                        desc="Some of the information maybe considered 'special' and 'sensitive' in certain jurisdictions, for example your racial and ethnic, origins, sexual orientation, and religious beliefs. We may process sensitive personal information when necessary with your consent or as otherwise permitted by applicable law. Learn more about sensitive information we process"
                    />
                    <KeyPoint
                        title="How do we process your information?"
                        desc="We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about how we process your information."
                    />
                    <KeyPoint
                        title="In what situations and with which parties do we share personal information?"
                        desc="We may share information in specific situations and with specific third parties. Learn more about when and with whom we share your personal information."
                    />
                    <KeyPoint
                        title="How do we keep your information safe?"
                        desc="We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about how we keep your information safe."
                    />
                    <KeyPoint
                        title="What are your rights?"
                        desc="Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about your privacy rights."
                    />
                    <KeyPoint
                        title="How do you exercise your rights? "
                        desc="The easiest way to exercise your rights is by visiting https://medblend.vercel.app/contact-us, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws."
                    />
                    <p className="text-white">Want to learn more about what we do with any information we collect? Review the Privacy Notice in full.</p>
                </div>
            </section>

            {/* QUESTION 1. */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">1. WHAT INFORMATION DO WE COLLECT?</h2>
                <h3 className="text-xl font-bold text-white mb-3 ">Personal information you disclose to us</h3>
                <p className="mb-4"><em>In Short: We collect personal information that you provide to us.</em></p>
                <p className="mb-4">We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
                <p className="mb-4"><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
                {/* Dot style list */}
                <ul className="list-disc list-inside ml-6 mb-4 space-y-1">
                    <li>names</li>
                    <li>phone numbers</li>
                    <li>email addresses</li>
                    <li>job titles</li>
                    <li>usernames</li>
                    <li>passwords</li>
                    <li>debit/credit card numbers</li>
                    <li>billing addresses</li>
                </ul>
                <p className="mb-4"><strong>Sensitive Information.</strong> When necessary, with your consent or as otherwise permitted by applicable law, we process the following categories of sensitive information: </p>
                <ul className="list-disc list-inside ml-6 mb-4 space-y-1">
                    <li>student data</li>
                    <li>social security numbers or other government identifiers</li>
                </ul>
                <p className="mb-4"><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called &quot;HOW DO WE HANDLE YOUR SOCIAL LOGINS?&quot; below.</p>
                <p className="mb-4"><strong>Application Data.</strong> If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:</p>
                <ul className="list-disc list-inside ml-6 mb-4 space-y-2">
                    <li><strong>Geolocation Information.</strong> We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.</li>
                    <li><strong>Mobile Device Access.</strong> We may request access or permission to certain features from your mobile device, including your mobile device's calendar, microphone, camera, contacts, social media accounts, reminders, and other features. If you wish to change our access or permissions, you may do so in your device's settings.</li>
                    <li><strong>Mobile Device Data.</strong> We automatically collect device information (such as your mobile device ID, model, and manufacturer), operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol (IP) address (or proxy server). If you are using our application(s), we may also collect information about the phone network associated with your mobile device, your mobile device's operating system or platform, the type of mobile device you use, your mobile device's unique device ID, and information about the features of our application(s) you accessed.</li>
                    <li><strong>Push Notifications.</strong> We may request to send you push notifications regarding your account or certain promotions or updates. If you wish to opt-out from receiving these types of communications, you may turn them off in your device's settings.</li>
                </ul>
                <p className="mb-4">This information is primarily needed to maintain the security and operation of our Application(s), for trouble shooting, and for internal analytics and reporting purposes.</p>
                <p className="mb-4">All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
                <p className="mb-4">Our use of information recieved from Google API will adhere to the <span className="text-blue-500 hover:underline"><Link href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</Link></span>, including the <span className="text-blue-500 hover:underline"><Link href="https://developers.google.com/terms/api-services-user-data-policy#limited-use">Limited Use Restriction</Link></span>.</p>
            </section>

            {/* QUESTION 2 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
                <p className=""><strong>In Short:</strong> We process your personal information to provide, improve, and administer our Services, to communicate with you, for security and fraud prevention, and to comply with legal obligations.</p>
                <br />
                <p className="mb-4">We process your personal information for a variety of reasons, depending on how you interact with our Services. We process your personal information for the following purposes:</p>
                <ul className="list-disc list-inside ml-6 mb-4 space-y-2">
                    <li><strong>To Facilitate Account Creation and Onboarding.</strong> We may process your information to create and log in to your account, or otherwise enable you to use our Services.</li>
                    <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
                    <li><strong>To respond to user inquiries/offer support to users.</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
                    <li><strong>To enable user-to-user communications.</strong> We may process your information if you choose to use any of our offerings that allow for communication with another user.</li>
                    <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
                </ul>
            </section>

            {/* QUESTION 3 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h2>
                <p className=""><strong>In Short:</strong> We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>
                <br />
                <p>If you are located in the EU or UK, this section applies to you.</p>
                <br />
                <p className="mb-4">The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:</p>
                <ul className="list-disc list-inside ml-6 mb-4 space-y-2">
                    <li><strong>Consent.</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about withdrawing your consent.</li>
                    <li><strong>Performance of a Contract.</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you.</li>
                    <li><strong>Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
                    <li><strong>Vital Interests.</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
                </ul>
                <p className="mb-4"><strong>If you are located in Canada, this section applies to you.</strong></p>
                <p className="mb-4">We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time.</p>
                <p className="mb-4">In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</p>
                <ul className="list-disc list-inside ml-6 mb-4 space-y-2">
                    <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
                    <li>For investigations and fraud detection and prevention</li>
                    <li>For business transactions provided certain conditions are met</li>
                    <li>If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
                    <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
                    <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
                    <li>If it is reasonable to expect that the collection with consent would compromise the availability or accuracy of the information</li>
                    <li>If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
                    <li>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
                    <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
                    <li>If the information is publicly available and is specified by the regulations</li>
                    <li>We may disclose de-identified information for approved research or statistics projects, subject to ethics oversight and confidentiality commitments</li>

                </ul>
            </section>

            {/* QUESTION 4 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
                <p><strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following third parties. We may need to share your personal information in the following situations:</p>
                <br />
                <p className="mb-4">We may need to share your personal information in the following situations:</p>
                <ul className="list-disc list-inside ml-6 mb-4 space-y-2">
                    <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                    <li><strong>Other Users.</strong> When you share personal information (for example, by posting comments, contributions, or other content to the Services) or otherwise interact with public areas of the Services, such personal information may be viewed by all users and may be publicly made available outside the Services in perpetuity. If you interact with other users of our Services and register for our Services through a social network (such as Facebook), your contacts on the social network will see your name, profile photo, and descriptions of your activity. Similarly, other users will be able to view descriptions of your activity, communicate with you within our Services, and view your profile.</li>
                    <li><strong>Offer Wall.</strong> Our application(s) may display a third-party hosted "offer wall." Such an offer wall allows third-party advertisers to offer virtual currency, gifts, or other items to users in return for the acceptance and completion of an advertisement offer. Such an offer wall may appear in our application(s) and be displayed to you based on certain data, such as your geographic area or demographic information. When you click on an offer wall, you will be brought to an external website belonging to other persons and will leave our application(s). A unique identifier, such as your user ID, will be shared with the offer wall provider in order to prevent fraud and properly credit your account with the relevant reward.</li>
                </ul>
            </section>

            {/* QUESTION 5 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
                <p><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information. We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of Our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</p>
                <br />
                <p>We may use cookies and similar tracking technologies to provide and improve our Services. These technologies help us understand how you use our Services, personalize your experience, and improve our marketing efforts. We may also use cookies to prevent fraud and protect the security of our Services.</p>
                <br />
                <p>To the extent these online tracking technologies are deemed to be a "sale"/"sharing" (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section "DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"</p>
                <br />
                <p>Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>
                <br />
                <h3 className="mb-4 text-xl font-bold">Google Analytics</h3>
                <p className="mb-4">We may share your information with Google Analytics to track and analyze the use of the Services. The Google Analytics Advertising Features that we may use include: Remarketing with Google Analytics and Google Analytics Demographics and Interests Reporting. To opt out of being tracked by Google Analytics across the Services, visit <span className="text-blue-500 hover:underline"><Link href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout</Link></span>. You can opt out of Google Analytics Advertising Features through <span className="text-blue-500 hover:underline"><Link href="https://myadcenter.google.com/home?sasb=true&ref=ad-settings">Ads Settings</Link></span> and Ad Settings for mobile apps. Other opt out means include <span className="text-blue-500 hover:underline"><Link href="https://thenai.org/how-to-opt-out/">http://optout.networkadvertising.org/</Link></span> and <span className="text-blue-500 hover:underline"><Link href="https://thenai.org/how-to-opt-out/advertising-privacy-settings-on-mobile-devices/">http://www.networkadvertising.org/mobile-choice</Link></span>. For more information on the privacy practices of Google, please visit the <span className="text-blue-500 hover:underline"><Link href="https://policies.google.com/privacy">Google Privacy & Terms page</Link></span>.</p>
            </section>

            {/* QUESTION 6 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">6. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
                <p><strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</p>
                <br />
                <p>As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "Al Products"). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the Al Products within our Services.</p>
                <br />
                <p>To the extent these online tracking technologies are deemed to be a "sale"/"sharing" (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section "DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"</p>
                <br />
                <p><strong>Use of Al Technologies</strong></p>
                <br />
                <p>We provide the Al Products through third-party service providers ("Al Service Providers"), including Amazon Web Services (AWS) Al. As outlined in this Privacy Notice, your input, output, and personal information will be shared with and processed by these Al Service Providers to enable your use of our Al Products for purposes outlined in "WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?" You must not use the Al Products in any way that violates the terms or policies of any Al Service Provider.</p>
                <br />
                <p><strong>Our Al Products</strong></p>
                <br />
                <p>Our Al Products are designed for the following functions:</p>
                <br />
                <ul className="list-disc list-inside ml-6 mb-4 space-y-1">
                    <li>Al bots</li>
                    <li>Al applications</li>
                </ul>
                <br />
                <p><strong>How We Process Your Data Using Al</strong></p>
                <br />
                <p>All personal information processed using our Al Products is handled in line with our Privacy Notice and our agreement with third parties. This ensures high security and safeguards your personal information throughout the process, giving you peace of mind about your data's safety.</p>
                <br />

                <p><strong>How to Opt Out</strong></p>
                <br />
                <p>We believe in giving you the power to control your personal information. To opt out:</p>
                <br />
                <ul className="list-disc list-inside ml-6 mb-4 space-y-1">
                    <li>Log in to your account settings and update your user account</li>
                </ul>


            </section>

            {/* QUESTION 7 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
                <p><strong>In Short:</strong> If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</p>
                <br />
                <p>Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.</p>
                <br />
                <p>We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.</p>
            </section>

            {/* QUESTION 8 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">8. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
                <p><strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</p>
                <br />
                <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>
                <br />
                <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
            </section>

            {/* QUESTION 9 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">9. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
                <p><strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.</p>
                <br />
                <p>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</p>
            </section>

            {/* QUESTION 10 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">10. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
                <p><strong>In Short:</strong> Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</p>
                <br />
                <p>In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. If a decision that produces legal or similarly significant effects is made solely by automated means, we will inform you, explain the main factors, and offer a simple way to request human review. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.</p>
                <br />
                <p>We will consider and act upon any request in accordance with applicable data protection laws.</p>
                <br />
                <p>If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority.</p>
                <br />
                <p>If you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner.</p>
                <br />
                <p>Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below or updating your preferences.</p>
                <br />
                <p>However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</p>
                <br />
                <p>Opting out of marketing and promotional communications: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below. You will then be removed from the marketing lists. However, we may still communicate with you for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.</p>
                <br />
                <h3 className="text-xl font-bold">Account Information</h3>
                <br />
                <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
                <ul className="list-disc list-inside ml-6 mb-4 space-y-1">
                    <li>Log in to your account settings and update your user account.</li>
                </ul>
                <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>
                <br />
                <p><strong>Cookies and similar technologies:</strong> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.</p>
                <br />
                <p>If you have questions or comments about your privacy rights, you may email us at medblendapp@gmail.com.</p>
            </section>

            {/* QUESTION 11 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">11. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
                <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing or honoring DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.</p>
                <br />
                <p>California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.</p>
                <br />
                <p><strong>Global Privacy Control:</strong> We recognize and honor Global Privacy Control (GPC) signals. If you use a browser or extension that supports GPC, we will treat this as a valid request to opt out of the sale or sharing of your personal information for targeted advertising purposes under applicable state privacy laws, including the California Consumer Privacy Act (CCPA). When we detect a GPC signal from your browser, we will automatically apply your opt-out preference without requiring you to take any additional action. For more information about GPC and how to enable it, visit <Link href="https://globalprivacycontrol.org/" className="text-blue-500">globalprivacycontrol.org</Link>.</p>
            </section>

            {/* QUESTION 12 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
                <p>In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.</p>
                <br />
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wide">Categories of Personal Information We Collect</h3>
                <p>The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section "WHAT INFORMATION DO WE COLLECT?"</p>

                {/* table here */}
                <table className="w-full border border-gray-300 mt-5 text-white">
                    <thead>
                        <tr>
                            <th className="">Category</th>
                            <th className="">Examples</th>
                            <th className="">Collected</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="">A. Identifiers</td>
                            <td className="">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                            <td className="">YES</td>
                        </tr>
                        <tr>
                            <td className="">B. Personal information as defined in the California Customer Records statute</td>
                            <td>Name, contact information, education, employment, employment history, and financial information</td>
                            <td className="">YES</td>
                        </tr>
                        <tr>
                            <td className="">C. Protected classification characteristics under California or federal law</td>
                            <td>Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td className="">D. Commercial information</td>
                            <td>Transaction information, purchase history, financial details, and payment information</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td>E. Biometric information</td>
                            <td>Fingerprints and voiceprints</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td>F. Internet or other similar network activity</td>
                            <td>Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td>G. Geolocation data</td>
                            <td className="">Device location</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td>H. Audio, electronic, sensory, or similar information</td>
                            <td>Images and audio, video or call recordings created in connection with our business activities</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td>I. Professional or employment-related information</td>
                            <td>Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td className="">J. Education Information</td>
                            <td>Student records and directory information</td>
                            <td className="">NO</td>
                        </tr>
                        <tr>
                            <td className="">K. Inferences drawn from collected personal information</td>
                            <td>Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics</td>
                            <td className="">YES</td>
                        </tr>
                        <tr>
                            <td className="">L. Sensitive personal information</td>
                            <td>Account login information</td>
                            <td className="">YES</td>
                        </tr>
                    </tbody>
                </table>

                <br />
                <p>We only collect sensitive personal information, as defined by applicable privacy laws or the purposes allowed by law or with your consent. Sensitive personal information may be used, or disclosed to a service provider or contractor, for additional, specified purposes. You may have the right to limit the use or disclosure of your sensitive personal information. We do not collect or process sensitive personal information for the purpose of inferring characteristics about you.</p>
                <br />
                <p>We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
                <br />
                <ul className="list-disc list-inside ml-6 mb-6">
                    <li>Receiving help through our customer support channels;</li>
                    <li>Participation in customer surveys or contests; and</li>
                    <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
                </ul>
                <br />
                <p>We will use and retain the collected personal information as needed to provide the Services or for:</p>
                <br />
                <ul className="list-disc list-inside ml-6 mb-6">
                    <li>Category A - As long as the user has an account with us</li>
                    <li>Category B - As long as the user has an account with us</li>
                    <li>Category K - As long as the user has an account with us</li>
                    <li>Category L - As long as the user has an account with us</li>
                </ul>
                <br />
                <h3 className="font-bold text-xl text-white mb-6">Sources of Personal Information</h3>
                <br />
                <p>Learn more about the sources of personal information we collect in "WHAT INFORMATION DO WE COLLECT?"</p>
                <br />
                <h3 className="font-bold text-xl text-white mb-6">How We Use and Share Personal Information</h3>
                <br />
                <p>Learn more about how we use your personal information in the section, "HOW DO WE PROCESS YOUR INFORMATION?"</p>
                <br />
                <h3 className="font-bold text-xl text-white mb-6">Will your information be shared with anyone else?</h3>
                <br />
                <p>We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"</p>
                <br />
                <p>We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.</p>
                <br />
                <p>We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.</p>
                <br />
                <p>More specifically, we may disclose your personal information in the following situations:</p>
                <br />
                <h3 className="font-bold text-xl text-white mb-6">Your Rights</h3>
                <p>You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:</p>
                <br />
                <ul className="list-disc list-inside ml-6 mb-6">
                    <li>Right to know whether or not we are processing your personal data</li>
                    <li>Right to request access to your personal data</li>
                    <li>Right to correct inaccuracies in your personal data</li>
                    <li>Right to request the deletion of your personal data</li>
                    <li>Right to obtain a copy of the personal data you previously shared with us</li>
                    <li>Right to non-discrimination for exercising your rights</li>
                    <li>Right to opt out of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California's privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
                </ul>
                <br />
                <p>Depending upon the state where you live, you may also have the following rights:</p>
                <ul className="list-disc list-inside ml-6 mb-6">
                    <li>Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)</li>
                    <li>Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)</li>
                    <li>Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)</li>
                    <li>Right to obtain a list of third parties to which we have sold personal data (as permitted by applicable law, including the privacy law in Connecticut)</li>
                    <li>Right to review, understand, question, and depending on where you live, correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Connecticut and Minnesota)</li>
                    <li>Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</li>
                    <li>Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</li>
                </ul>
                <br />
                <h3 className="font-bold text-xl text-white">How to Exercise Your Rights</h3>
                <br />
                <p>To exercise these rights, you can contact us by visiting https://medblend.vercel.app/contact-us, by emailing us at med blendapp@gmail.com, or by referring to the contact details at the bottom of this document.</p>
                <br />
                <p>We will honor your opt-out preferences if you enact the Global Privacy Control (GPC) opt-out signal on your browser.</p>
                <br />
                <p>Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws.</p>
                <br />
                <h3 className="font-bold text-xl text-white">Request Verification</h3>
                <br />
                <p>Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.</p>
                <br />
                <p>If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.</p>
                <br />
                <h3 className="font-bold text-xl text-white">Appeals</h3>
                <br />
                <p>Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at medblendapp@gmail.com. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.</p>
                <br />
                <h3 className="font-bold text-xl text-white">California "Shine The Light" Law</h3>
                <br />
                <p>California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</p>

            </section>

            {/* QUESTION 13 */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">13. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
                <p><strong>In Short:</strong> You may have additional rights based on the country you reside in.</p>
                <br />
                <h3 className="font-bold text-xl text-white mb-6">Australia and New Zealand</h3>
                <p>We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act).</p>
                <br />
                <p>This Privacy Notice satisfies the notice requirements defined in both Privacy Acts, in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information.</p>
                <br />
                <p>If you do not wish to provide the personal information necessary to fulfill their applicable purpose, it may affect our ability to provide our services, in particular:</p>
                <br />
                <ul className="list-disc list-inside ml-6 mb-6">
                    <li>offer you the products or services that you want</li>
                    <li>respond to or help with your requests</li>
                    <li>manage your account with us</li>
                    <li>confirm your identity and protect your account</li>
                </ul>
                <p>At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?". If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the Office of the Australian Information Commissioner and a breach of New Zealand's Privacy Principles to the Office of New Zealand Privacy Commissioner.</p>
                <br />
                <p>If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the <Link href="https://www.oaic.gov.au/" className="text-blue-500">Office of the Australian Information Commissioner</Link> and a breach of New Zealand's Privacy Principles to the <Link href="https://www.privacy.org.nz/your-rights/making-a-complaint-to-the-privacy-commissioner/" className="text-blue-500">Office of New Zealand Privacy Commissioner</Link>.</p>
                <br />
                <h3 className="font-bold text-xl text-white">Republic of South Africa</h3>
                <br />
                <p>At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"</p>
                <br />
                <p>If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:</p>
                <br />
                <Link className="text-[hsl(245,72%,59%)] hover:underline" href="https://www.inforegulator.org.za/">The Information Regulator (South Africa)</Link>
                <p>General enquiries: enquiries@inforegulator.org.za</p>
                <p>Complaints (complete POPIA/PAIA form)</p>
                <p>PAIAComplaints@inforegulator.org.za & POPIAComplaints@inforegulator.org.za</p>
            </section>

            {/* QUESTION 14 */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">14. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
                <p><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
                <br />
                <p>We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.</p>
            </section>

            {/* QUESTION 15 */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
                <p>If you have questions or comments about this notice, you may email us at medblendapp@gmail.com or contact us by post at: MedBlendApp, United Arab Emirates</p>
                <br />
            </section>

            {/* QUESTION 16 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
                <p>Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please visit: https://medblend.vercel.app/contact-us.</p>
                <br />
            </section>


        </div>
    );
};

// Sub-component for clean organization
const KeyPoint = ({ title, desc }: { title: string; desc: string }) => (
    <div className="border-l-2 border-[hsl(245,72%,59%)] pl-4">
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <p className="text-[hsl(0,0%,60%)] text-sm">{desc}</p>
    </div>
);

export default PrivacyPolicy;