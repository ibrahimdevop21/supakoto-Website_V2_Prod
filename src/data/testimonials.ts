// src/data/testimonials.ts
export interface Testimonial {
    id: number;
    name: string;
    branch: string;
    content: string;
    rating: number;
  }
  
  export const TESTIMONIALS: Testimonial[] = [
    // --- New reviews (Dubai) ---
    {
      id: 1,
      name: 'Ebraheem A',
      branch: 'Dubai Al Quoz',
      content:
        'السلام عليكم انصح فيه بقوه من توصل لين تستلم سيارتك الشغل والمعامله ممتازه وأسعارهم بالمتناول شكرا أستاذ عمر و شريف ومش قصور بالباقي اخترت ٥٠٪؜ عزل الحراره ممتاز وواضح من الداخل',
      rating: 5,
    },
    {
      id: 2,
      name: 'nithin premnath',
      branch: 'Dubai Al Quoz',
      content:
        'I recently had a full PPF applied to my Mazda CX-60 by the Supakoto team in Dubai, and I’m thoroughly impressed with the entire experience. The quality of the work is flawless — the finish is seamless, and the attention to detail is clearly visible from every angle. Special credit to Sherif and Hisham, who were incredibly helpful throughout the process. I highly recommend Supakoto for anyone considering PPF in Dubai. Outstanding service from start to finish!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Mohamed Taha',
      branch: 'Dubai Al Quoz',
      content:
        'بعد دراسة ومقارنة لأغلب مراكز الـ PPF في السوق لمدة شهر تقريبًا، قررت التعامل مع SUPA KOTO بناءً على تواصل الأستاذ عمر المحترم الذي كان صبورًا وواضحًا وصادقًا في توضيح الفروقات وطمأنني بجودة الخدمة – وقد كان عند وعده. سلمت لهم سيارتي وسيارة أخي، ووجدت احترافية عالية، دقة في التفاصيل، ومعاملة راقية من كل الطاقم، وعلى رأسهم الأستاذ شريف مدير الفرع، والأستاذ هشام. المنتج المستخدم ياباني بجودة ممتازة والنتيجة النهائية رائعة، وأنصح بالتعامل معهم.',
      rating: 5,
    },
    {
      id: 4,
      name: 'Hany Fathy',
      branch: 'Dubai Al Quoz',
      content:
        'I had a great experience with Supa Koto, they made my Avatr look fantastic. Highly recommended. Special thanks to Mr. Sherif and all the staff.',
      rating: 5,
    },
    {
      id: 5,
      name: 'Hassan Adam',
      branch: 'Dubai Al Quoz',
      content:
        'Very professional and great work. Also good after sale follow up — highly recommend.',
      rating: 5,
    },
    {
      id: 6,
      name: 'Engy Ibrahim',
      branch: 'Dubai Al Quoz',
      content:
        'Original 100% and after sales service is perfect with annual check ups and maintenance 👌',
      rating: 5,
    },
    {
      id: 7,
      name: 'mohamed fishar',
      branch: 'Dubai Al Quoz',
      content:
        'شركة ممتازة والاسعار أقل بكتير من الشركات الأخرى وفريق العمل متمكن وأعلى كفاءة وجودة وسرعة. أنصح بالتعامل معهم.',
      rating: 5,
    },
    {
      id: 8,
      name: 'Ahmed El Hariry',
      branch: 'Dubai Al Quoz',
      content:
        'Had a great experience and a great service with the place and with Hesham. The details and the service are brilliant.',
      rating: 5,
    },
  
    // --- Existing reviews ---
    {
      id: 9,
      name: "Michaelangelo D'Sa",
      branch: 'Dubai Al Quoz',
      content:
        "I had done a month of research, which included reading about PPF and the options I had here in Dubai. I even visited the 3 companies shortlisted for the job. I decided to use Supakoto purely due to the fact that Japan quality goes without question, and moreover, I managed to get the Ramadan deal that was on offer. This also included complete window tinting. After meeting up with Mr Hisham, I was convinced that I would not be disappointed. On the day I received my 2025 Lexus nx350h from the showroom, I drove directly to Al quoz and handed my car to Mr Hisham. It took almost a week, but the final outcome was nice.",
      rating: 5,
    },
    {
      id: 10,
      name: 'Mahmoud Fathy',
      branch: 'Al Sheikh Zayed',
      content:
        'انا سعيد بتجربتي مع سوباكوتو … ان شاءالله تتكرر في السيارات القادمة … مستوى عالي من الاحترافية والمهنية في التعامل و الدقة في المواعيد والاسعار مناسبة جدا وكذلك المصداقية في المنتج من خلال التاكيد على انه اصلي بالسريال من الشركة المصنعة و كذلك المتابعة وخدمة ما بعد البيع …. كل شئ كان ممتازت',
      rating: 5,
    },
    {
      id: 11,
      name: 'Ahmed Ali',
      branch: 'Maadi, Inside Skoda Center',
      content:
        'I recently had a protection Film for 2 Cars in New Cairo Branch.They really have an excellent Professional Team and a very good customer service. A very good after sale follow up. I am very satisfied with their provided service. A big thank you to Mr Mohamed - The Branch Manager for handling all the issues.',
      rating: 5,
    },
    {
      id: 12,
      name: 'Alber Wadea',
      branch: 'Al Sheikh Zayed',
      content:
        "I recently had a PPF installed on my vehicle, and I couldn't be more impressed with the quality of service and the final result. From start to finish, the team demonstrated top-tier professionalism, attention to detail, and deep product knowledge. The consultation was clear and informative—they explained the different film options, coverage areas, and long-term benefits, helping me choose the best package for my needs. The installation itself was meticulous. The film was applied seamlessly, with no bubbles, visible edges, or imperfections. You can barely tell it's there, but the protection is immediately noticeable. What truly stood out was the pride the team took in their work. They treated my car with care as if it were their own. I was also impressed with the turnaround time and the follow-up instructions to ensure the film cures properly.",
      rating: 5,
    },
    {
      id: 13,
      name: 'Amel Fathy',
      branch: 'Maadi, Inside Skoda Center',
      content:
        'I had a protection film as well as internal protection 3 months ago. I was really impressed by the quality of the products and the professionality of the staff.The results were outstanding. And what is really special is their after sale follow up every now and then to check on the film and if I have any comments ❤️comments ❤️ To sum up, I am totally satisfied with the service and I highly recommend them to everyone.',
      rating: 5,
    },
    {
      id: 14,
      name: 'Mohamed Samy',
      branch: 'New Cairo, 5th Settlement',
      content:
        'من أحسن التجارب اللي مريت بيها بصراحة بعد مقارنة بين كذا شركة. اخترت شركة Supa Koto بناءً على ترشيحات كتير وفعلاً كانوا قد التوقعات. فريق العمل محترم جدًا وملتزم من أول ما تواصلت معاهم لحد ما استلمت العربية، كل حاجة كانت ماشية بسلاسة ومنظمة جدًا. خامات ممتازة حسيت إني واخد قيمة حقيقية مقابل اللي دفعتُه. الأستاذ محمد سويلم قمة في الذوق والرُقي وخلاني مرتاح جدًا في التعامل معاهم. استلمت العربية قبل الميعاد وده خلاني أحترمهم أكتر. تجربة محترمة وأنصح أي حد بيهم.',
      rating: 5,
    },
    // Add at the end of TESTIMONIALS

{
    id: 15,
    name: 'Amr Othman',
    branch: 'New Cairo, 5th Settlement',
    content:
      'I would like to thank Mr. Mohamed Swelam and Mr. Ramy for their incredible professionalism and friendly attitude. Professional Service: The team was highly professional, ensuring top-quality service and attention to detail. They offer a diverse range of protective and thermal insulation films, selecting the best option for my car. Expert Recommendations: Their knowledge and expertise helped me choose the most suitable film for my needs. Respectful & Courteous Staff: The customer service was exceptional, with respectful and polite interactions throughout the process. Great Hospitality: From the moment I arrived, they provided a warm welcome and made the experience enjoyable. Highly Recommended: I would definitely recommend them to anyone looking for car paint protection films.',
    rating: 5,
  },
  {
    id: 16,
    name: 'Ahmed Gaber',
    branch: 'New Cairo, 5th Settlement',
    content:
      'Great customer relation management & high quality products and service. Amazing heat isolation as well. Just recieved my car from them after film protection and heat isolation installation with them with 10 years warranty. Hope they continue to offer great quality along the coming years ISA.',
    rating: 5,
  },
  {
    id: 17,
    name: 'Ahmed Gado',
    branch: 'New Cairo, 5th Settlement',
    content:
      'Thank you Supa Koto for providing high-quality protection films for your car. It was a great experience with your products, and I am grateful for your excellent service. Supa Koto is my favorite company for protection films. Their products are of high quality and prove to be effective in protecting cars. Thank you for your great service. I highly recommend Supa Koto Protection Film Company. I used their products for my car and the results were great. Thank you for your excellent products.',
    rating: 5,
  },
  {
    id: 18,
    name: 'mohamed elseman',
    branch: 'New Cairo, 5th Settlement',
    content:
      "It's obvious that after several searches for finding the best protection of my car, I found and dealt with the best company in protection, such as SUPA KOTO. And after almost 1 year of experience with them, I got my annual maintenance, and the service after sale was great, and they were respected for the work and the client.",
    rating: 5,
  },
  {
    id: 19,
    name: 'Mohamed Elleithy',
    branch: 'New Cairo, 5th Settlement',
    content:
      "Outstanding Service and Top-Quality Product at Supakoto. I recently had my car protected with Takai Steel Plus film at Supakoto, and I couldn't be more impressed with the entire experience. From start to finish, the team demonstrated professionalism, patience, and genuine care. A special thanks to Mr. Mohamed Sweilm, who went above and beyond by patiently answering all my questions and even showing me the full installation process. His knowledge and friendly attitude made me feel confident and well-informed every step of the way. I also want to highlight Mr. Ramy, whose attention to detail and commitment to quality ensured that the car was delivered in perfect condition. He personally inspected the work more than once to make sure everything was flawless. The Takai Steel Plus film itself is of excellent quality — the finish looks incredible and gives me peace of mind knowing that my car is protected. Highly recommended for anyone who values premium service, high-quality products, and a truly professional team!",
    rating: 5,
  },
  {
    id: 20,
    name: 'Unis elassal',
    branch: 'New Cairo, 5th Settlement',
    content:
      'I would like to thank Supa Koto team, specially Mr Mohamed Swelam for warm hospitality and professionalism. I already made almost 7 cars until now since 2022 and they have super after sales service. Highly recommended.',
    rating: 5,
  },
  {
    id: 21,
    name: 'rami ashraf',
    branch: 'New Cairo, 5th Settlement',
    content:
      'Highly recommended place for film car protection — everything is perfect: the material, treatment, and the staff. I would like to thank Mr. Mohamed Swelam and Mr. Ramy for their incredible professionalism and friendly attitude. The car came out perfect and ahead of schedule and the service after sale is perfect.',
    rating: 5,
  },
  {
    id: 22,
    name: 'Amr Shawky',
    branch: 'New Cairo, 5th Settlement',
    content:
      'I’d like to extend my sincere thanks to the entire team at Supa Koto for their exceptional service and unwavering commitment to quality control. From the very beginning, the experience was smooth and professional—even during the initial sales process with Enjyu, who was incredibly helpful and knowledgeable. A very special thank you goes out to Swelam, the Operations Manager, whose attention to detail were clearly reflected in the outstanding execution and overall professionalism of the team. Everyone I interacted with was kind, decent, and conducted themselves with the highest level of professionalism. It was truly a pleasure working with Supa Koto, and I highly recommend them to anyone seeking quality and reliability.',
    rating: 5,
  },
  {
    id: 23,
    name: 'Mohamed Galaa',
    branch: 'New Cairo, 5th Settlement',
    content:
      'Honestly, Supa Koto has become my recommended provider for anyone who is interested in the PPF. The material exceeds expectations. They are taking care of every inch of the car. Thanks, Supa Koto.',
    rating: 5,
  },
  {
    id: 24,
    name: 'Mina Jack',
    branch: 'New Cairo, 5th Settlement',
    content:
      'More than excellent whether in car protection or after sale service. Had two major incidents and car is like brand new fully protected. Strongly recommend this place for even higher professionalism.',
    rating: 5,
  },
  {
    id: 25,
    name: 'Hazem Nagy',
    branch: 'Maadi, Inside Skoda Center',
    content:
      'I had PPF and various other services at this place. They are the real deal, perfect in every way. Special thanks to Mr Mohammed Sweilam and Ms Effat for the wonderful customer experience. The car was done earlier than expected and I have zero comments. Amazing experience.',
    rating: 5,
  },
  {
    id: 26,
    name: 'Mohamed Fadel',
    branch: 'Maadi, Inside Skoda Center',
    content:
      'It was such an amazing experience, the service was more than excellent starting from the customer service offering all the required details and clear explanation. When I visited the store (5th settlement) the team was very helpful and decent, they offered me the best for my car with a great discount. They have a very professional follow up and after sales. I highly recommend.',
    rating: 5,
  },
  {
    id: 27,
    name: 'Yousef Baghdady',
    branch: 'Maadi, Inside Skoda Center',
    content:
      'Had a great experience with Supakoto when I installed PPF film on my car. The team was very professional, explained everything clearly, and the quality of the work really shows. The film was applied perfectly — no bubbles, no edges showing, just a super clean finish.',
    rating: 5,
  },
  {
    id: 28,
    name: 'Mariam Saeid',
    branch: 'Maadi, Inside Skoda Center',
    content:
      'It was such an amazing experience, the service was excellent starting from the customer service offering me all the details needed. They also offered me lots of offers to choose from. When I visited the store Mr. Tarek was very helpful and decent; he offered me the best for my car with a great discount. They have high quality materials with expert finishing. I highly recommend.',
    rating: 5,
  },
  {
    id: 29,
    name: 'sh elfeki',
    branch: 'Maadi, Inside Skoda Center',
    content:
      'I was completely impressed with their professionalism and customer service. High quality films are consistently outstanding which clearly appear on my car, exceeding my expectations with their friendly respectable team and nice place easy to reach. All the thanks for the consistent follow up 🙏🏻🙏🏻🙏🏻.',
    rating: 5,
  },
  {
    id: 30,
    name: 'Esraa Ibrahim',
    branch: 'Maadi, Inside Skoda Center',
    content:
      'I make protection film at Maadi branch and it was a very wise decision. All the staff is very professional, respectful and helpful, specially Mr Tarek. I asked him millions of questions about protection and about my car and he responded gently and tried to help me in every situation when I scratched my car or had any incident. So thank you to all Maadi staff at Maadi branch, really appreciated.',
    rating: 5,
  },
  
  ];
  