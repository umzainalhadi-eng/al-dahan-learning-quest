const ARABIC_GAME_DETAILS = {
    1: { skill: 'النحو والإعراب', objective: 'تمييز الفاعل وتحديد موقعه بعد الفعل المبني للمعلوم.', explanation: 'الطالبُ هو من قام بالكتابة، لذلك يعرب فاعلاً مرفوعاً.' },
    2: { skill: 'الإملاء', objective: 'مراجعة كتابة الكلمات التي يشيع الخطأ في رسم همزتها.', explanation: 'الصواب «قراءة» بالتاء المربوطة، أما «قرائة» فكتابة غير صحيحة.' },
    3: { skill: 'المفردات والصرف', objective: 'إثراء الرصيد اللغوي بالتعرف على المترادفات.', explanation: 'الصنديد هو الشجاع المقدام.' },
    4: { skill: 'المفردات والصرف', objective: 'التعرف على جموع التكسير وتغير بنية المفرد.', explanation: 'جمع «حيزوم» هو «حيازيم»، وهو جمع تكسير تغير فيه بناء المفرد.' },
    5: { skill: 'النحو والإعراب', objective: 'معرفة أثر كان وأخواتها في المبتدأ والخبر.', explanation: 'أصبحت من أخوات كان؛ ترفع اسمها «المدرسةُ» وتنصب خبرها «سعيدةً».' },
    6: { skill: 'النحو والإعراب', objective: 'تمييز معاني إن وأخواتها وأثرها في الجملة الاسمية.', explanation: 'إنّ حرف ناسخ يفيد التوكيد، وينصب المبتدأ ويسمى اسمها.' },
    7: { skill: 'البلاغة والأساليب', objective: 'تحليل أركان التشبيه في الجملة.', explanation: 'في «أنت كالبحر في العطاء» ذُكرت أداة التشبيه ووجه الشبه، فهو تشبيه تام.' },
    8: { skill: 'الإملاء', objective: 'تطبيق قاعدة أقوى الحركات عند كتابة الهمزة المتوسطة.', explanation: 'الكسرة أقوى الحركات، وتناسبها النبرة؛ لذلك تكتب الهمزة على نبرة إذا كسرت أو سبقها كسر.' },
    9: { skill: 'النحو والإعراب', objective: 'تحديد علامة رفع الأفعال الخمسة.', explanation: 'ترفع الأفعال الخمسة بثبوت النون، وتحذف النون في النصب والجزم.' },
    10: { skill: 'النحو والإعراب', objective: 'تمييز الفاعل الظاهر والضمير المتصل بالفعل.', explanation: 'التاء في «أكرمتُ» ضمير متصل في محل رفع فاعل، والضيفَ مفعول به.' },
    11: { skill: 'النحو والإعراب', objective: 'التفريق بين الحال والتمييز من خلال معنى الجملة.', explanation: '«كتاباً» تمييز منصوب يوضح المقصود من العدد عشرين.' },
    12: { skill: 'المفردات والصرف', objective: 'صياغة المثنى مع مراعاة أصل الألف في الاسم المقصور.', explanation: 'أصل ألف «عصا» واو، لذلك يقال في الرفع «عصوان».' },
    13: { skill: 'المفردات والصرف', objective: 'صياغة اسم الفاعل من الفعل غير الثلاثي.', explanation: 'من «استخرج» نصوغ اسم الفاعل على وزن مضارعه مع إبدال حرف المضارعة ميماً مضمومة وكسر ما قبل الآخر: مُستخرِج.' },
    14: { skill: 'النحو والإعراب', objective: 'فهم دلالات حروف الجر في السياق.', explanation: 'من أشهر معاني «عن» المجاوزة والابتعاد، مثل: ابتعدت عن الطريق.' },
    15: { skill: 'النحو والإعراب', objective: 'ملاحظة أوجه المطابقة بين النعت والمنعوت.', explanation: 'يتبع النعت منعوته في الإعراب والتعريف والتنكير والتذكير والتأنيث والعدد.' },
    16: { skill: 'النحو والإعراب', objective: 'تصنيف الفعل المعتل بحسب موضع حرف العلة.', explanation: 'الفعل «قال» أجوف؛ لأن حرف العلة يقع في وسطه.' },
    17: { skill: 'النحو والإعراب', objective: 'اختيار اسم الإشارة وفق العدد والنوع والقرب.', explanation: '«هاتان» اسم إشارة للمثنى المؤنث القريب في حالة الرفع.' },
    18: { skill: 'النحو والإعراب', objective: 'تمييز محل الضمير المتصل بالاسم.', explanation: 'إذا اتصل الضمير باسم دل غالباً على الملكية أو الاختصاص، فيعرب في محل جر مضاف إليه.' },
    19: { skill: 'البلاغة والأساليب', objective: 'تمييز الأساليب الإنشائية في الكلام.', explanation: 'الجملة تبدأ بنداء «يا طالب العلم» وتتضمن أمراً «اجتهد»، وكلاهما إنشاء.' },
    20: { skill: 'البلاغة والأساليب', objective: 'التعرف على المحسن البديعي الطباق.', explanation: 'الطباق هو الجمع بين لفظين متضادين في المعنى، مثل: الليل والنهار.' }
};

const ARABIC_EXTRA_QUESTIONS = {
    'النحو والإعراب': [
        { text: 'في جملة «قرأ خالدٌ القصةَ»، ما الفاعل؟', options: ['خالدٌ', 'القصةَ', 'قرأ', 'ضمير مستتر'], correct: 0, explanation: 'خالدٌ هو من قام بالقراءة، فهو الفاعل.' },
        { text: 'في جملة «إنّ الطالبَ مجتهدٌ»، ما اسم إنّ؟', options: ['الطالبَ', 'مجتهدٌ', 'إنّ', 'ضمير مستتر'], correct: 0, explanation: 'الطالبَ اسم إنّ منصوب، ومجتهدٌ خبرها مرفوع.' },
        { text: 'ما علامة نصب الفعل في «لن يهملَ الطالبُ واجبَه»؟', options: ['الفتحة', 'الضمة', 'السكون', 'حذف النون'], correct: 0, explanation: 'لن حرف نصب، وعلامة نصب الفعل المضارع الفتحة.' },
        { text: 'في «ذهبتُ إلى المدرسةِ»، إعراب المدرسةِ:', options: ['اسم مجرور', 'فاعل مرفوع', 'مفعول به', 'مبتدأ'], correct: 0, explanation: 'المدرسةِ اسم مجرور بحرف الجر إلى.' },
        { text: 'في «المعلمون مخلصون»، علامة رفع المعلمون:', options: ['الواو', 'الألف', 'الضمة', 'ثبوت النون'], correct: 0, explanation: 'جمع المذكر السالم يرفع بالواو.' },
        { text: 'في «الطالبان مجتهدان»، علامة رفع الطالبان:', options: ['الألف', 'الواو', 'الضمة', 'الياء'], correct: 0, explanation: 'المثنى يرفع بالألف.' },
        { text: 'في «كان الجو معتدلاً»، ما خبر كان؟', options: ['معتدلاً', 'كان', 'الجو', 'ضمير مستتر'], correct: 0, explanation: 'معتدلاً خبر كان منصوب.' },
        { text: 'في «لم يهملوا واجبهم»، علامة جزم يهملوا:', options: ['حذف النون', 'السكون', 'الفتحة', 'حذف حرف العلة'], correct: 0, explanation: 'يهملوا من الأفعال الخمسة، ويجزم بحذف النون.' },
        { text: 'في «كرّمت المدرسةُ الطالبين»، علامة نصب الطالبين:', options: ['الياء', 'الألف', 'الفتحة', 'الكسرة'], correct: 0, explanation: 'الطالبين مثنى منصوب بالياء.' },
        { text: 'في «شاهدتُ الطالباتِ»، علامة نصب الطالبات:', options: ['الكسرة', 'الفتحة', 'الياء', 'الألف'], correct: 0, explanation: 'جمع المؤنث السالم ينصب بالكسرة نيابة عن الفتحة.' },
        { text: 'في «المهندسان بارعان»، علامة رفع المهندسان:', options: ['الألف', 'الواو', 'الضمة', 'الياء'], correct: 0, explanation: 'المهندسان مثنى مرفوع بالألف.' },
        { text: 'في «لا تهملْ دروسك»، الفعل تهمل:', options: ['مضارع مجزوم', 'ماضٍ مبني', 'مضارع منصوب', 'فعل أمر'], correct: 0, explanation: 'لا الناهية تجزم الفعل المضارع بعدها، وعلامة جزمه السكون.' },
        { text: 'في «عاد المسافرُ متعباً»، كلمة متعباً:', options: ['حال منصوب', 'فاعل مرفوع', 'مضاف إليه', 'مبتدأ'], correct: 0, explanation: 'متعباً حال منصوب يبين هيئة المسافر عند عودته.' },
        { text: 'في «أصبح الجوُّ لطيفاً»، اسم أصبح هو:', options: ['الجوُّ', 'أصبح', 'لطيفاً', 'ضمير مستتر'], correct: 0, explanation: 'الجوُّ اسم أصبح مرفوع، ولطيفاً خبرها منصوب.' }
    ],
    'الإملاء': [
        { text: 'اختر الكلمة المكتوبة كتابة صحيحة:', options: ['مسؤول', 'مسوؤل', 'مسئولل', 'مسئؤل'], correct: 0, explanation: 'تكتب «مسؤول» بهمزة متوسطة على الواو.' },
        { text: 'الهمزة في آخر كلمة «سماء» تكتب:', options: ['على السطر', 'على ألف', 'على واو', 'على نبرة'], correct: 0, explanation: 'تكتب الهمزة المتطرفة على السطر إذا سبقها حرف مد، مثل الألف في «سماء».' },
        { text: 'أي الكلمات الآتية كتبت همزتها المتوسطة على نبرة؟', options: ['فئة', 'مؤمن', 'رأس', 'سؤال'], correct: 0, explanation: 'في «فئة» كتبت الهمزة على نبرة لمناسبة الكسرة.' },
        { text: 'اختر الكلمة المنتهية بتاء مربوطة:', options: ['شجرة', 'شجره', 'شجرت', 'شجرا'], correct: 0, explanation: 'تكتب «شجرة» بتاء مربوطة في آخر الاسم المفرد المؤنث.' },
        { text: 'أي الكلمات تبدأ بهمزة وصل؟', options: ['استمع', 'أحمد', 'إكرام', 'أخذ'], correct: 0, explanation: 'الفعل الماضي الخماسي «استمع» يبدأ بهمزة وصل.' },
        { text: 'اختر الرسم الإملائي الصحيح:', options: ['هؤلاء', 'هاؤلاء', 'هئولاء', 'هؤلا'], correct: 0, explanation: 'الرسم الصحيح لاسم الإشارة للجمع هو «هؤلاء».' },
        { text: 'أي الكلمات الآتية تنتهي بألف لينة كتبت على صورة الياء؟', options: ['هدى', 'عصا', 'دعا', 'سما'], correct: 0, explanation: 'كتبت الألف اللينة في «هدى» على صورة الياء لأنها ألف مقصورة.' },
        { text: 'أي الكلمات الآتية تبدأ بهمزة قطع؟', options: ['أكرم', 'استخرج', 'اجلس', 'ابن'], correct: 0, explanation: 'همزة «أكرم» همزة قطع تثبت في النطق والكتابة.' },
        { text: 'اختر كلمة تنتهي بتاء مفتوحة:', options: ['معلمات', 'شجرة', 'حديقة', 'قصة'], correct: 0, explanation: '«معلمات» جمع مؤنث سالم ينتهي بتاء مفتوحة.' },
        { text: 'أي الكلمات الآتية اسم مقصور؟', options: ['فتى', 'قاضي', 'سماء', 'كتاب'], correct: 0, explanation: 'الاسم المقصور ينتهي بألف لازمة، مثل «فتى».' },
        { text: 'تكتب الهمزة المتطرفة على نبرة في كلمة:', options: ['شاطئ', 'تباطؤ', 'سماء', 'بدأ'], correct: 0, explanation: 'كتبت الهمزة على نبرة في «شاطئ» لأن ما قبلها مكسور.' },
        { text: 'تكتب الهمزة المتطرفة على واو في كلمة:', options: ['تباطؤ', 'شاطئ', 'سماء', 'قارئ'], correct: 0, explanation: 'كتبت الهمزة على واو في «تباطؤ» لأن ما قبلها مضموم.' },
        { text: 'أي الكلمات الآتية كُتبت فيها همزة الوصل صحيحة؟', options: ['اجتمع', 'إجتمع', 'أجتمع', 'ءاجتمع'], correct: 0, explanation: 'همزة الفعل الخماسي «اجتمع» همزة وصل.' },
        { text: 'ما الرسم الصحيح لكلمة تدل على مكان الاستشفاء؟', options: ['مستشفى', 'مستشفا', 'مستشفاء', 'مستشفى'], correct: 0, explanation: 'تكتب «مستشفى» بألف مقصورة في آخرها.' },
        { text: 'أي الكلمات الآتية تبدأ بهمزة وصل؟', options: ['انطلق', 'إكرام', 'أحسن', 'أخذ'], correct: 0, explanation: 'همزة الفعل الماضي الخماسي «انطلق» همزة وصل.' },
        { text: 'اختر الكتابة الصحيحة لتنوين كلمة «كتاب» بالنصب:', options: ['كتاباً', 'كتابن', 'كتابٌ', 'كتابٍ'], correct: 0, explanation: 'تنوّن كلمة «كتاب» بالنصب بفتح التاء وإضافة ألف التنوين.' },
        { text: 'في أي كلمة كُتبت اللام قمرية؟', options: ['القمر', 'الشمس', 'النّور', 'الطّالب'], correct: 0, explanation: 'تظهر اللام في نطق «القمر»، فهي لام قمرية.' },
        { text: 'أي الكلمات الآتية كُتبت بتاء مربوطة؟', options: ['هدية', 'بيت', 'صوت', 'نبات'], correct: 0, explanation: '«هدية» اسم مؤنث مختوم بتاء مربوطة.' },
        { text: 'اختر كلمة تبدأ بهمزة وصل:', options: ['الابتكار', 'إبداع', 'أمانة', 'إجابة'], correct: 0, explanation: 'همزة «الابتكار» همزة وصل؛ لأنها في «الـ» التعريف.' },
        { text: 'أي الكلمات تنتهي بألف لينة على صورة الياء؟', options: ['استدعى', 'دعا', 'عصا', 'سما'], correct: 0, explanation: 'الفعل غير الثلاثي «استدعى» ختم بألف لينة مقصورة.' },
        { text: 'اختر الرسم الصحيح للكلمة:', options: ['سؤال', 'سئال', 'سؤآل', 'سءال'], correct: 0, explanation: 'تكتب الهمزة المتوسطة على واو في «سؤال».' },
        { text: 'أي الكلمات الآتية تنتهي بتاء مفتوحة؟', options: ['طالبات', 'ممرضة', 'حديقة', 'رحلة'], correct: 0, explanation: 'جمع المؤنث السالم «طالبات» ينتهي بتاء مفتوحة.' },
        { text: 'اختر الكلمة الصحيحة كتابةً:', options: ['ابن', 'إبن', 'أبن', 'إبنّ'], correct: 0, explanation: 'تكتب «ابن» بهمزة وصل، وتسقط ألفها في مواضع معروفة بين علمين.' }
    ],
    'المفردات والصرف': [
        { text: 'ما جمع كلمة «كتاب»؟', options: ['كتب', 'كاتبان', 'كتابة', 'كاتبون'], correct: 0, explanation: '«كتب» جمع تكسير لكلمة «كتاب».' },
        { text: 'ما مرادف كلمة «فسيح»؟', options: ['واسع', 'ضيق', 'قصير', 'بعيد'], correct: 0, explanation: 'فسيح تعني واسعاً ورحباً.' },
        { text: 'ما ضد كلمة «شجاع»؟', options: ['جبان', 'مقدام', 'قوي', 'جريء'], correct: 0, explanation: 'ضد شجاع هو جبان.' },
        { text: 'ما اسم الفاعل من الفعل «كتب»؟', options: ['كاتب', 'مكتوب', 'كتاب', 'كتابة'], correct: 0, explanation: 'اسم الفاعل من الفعل الثلاثي كتب هو كاتب.' },
        { text: 'ما مثنى كلمة «معلمة»؟', options: ['معلمتان', 'معلمات', 'معلمون', 'معالم'], correct: 0, explanation: 'مثنى معلمة في حالة الرفع «معلمتان».' },
        { text: 'ما مفرد كلمة «أقلام»؟', options: ['قلم', 'قلمة', 'قلامة', 'قلمان'], correct: 0, explanation: 'مفرد «أقلام» هو «قلم».' },
        { text: 'ما مرادف كلمة «ثابر»؟', options: ['واظب', 'توقف', 'تراجع', 'استراح'], correct: 0, explanation: 'ثابر تعني واظب واستمر في العمل.' },
        { text: 'ما جمع كلمة «مدينة»؟', options: ['مدن', 'مدينتان', 'مدائن', 'مدينيون'], correct: 0, explanation: 'جمع مدينة هو مدن، ويجوز مدائن.' },
        { text: 'ما ضد كلمة «الكرم»؟', options: ['البخل', 'الجود', 'العطاء', 'السخاء'], correct: 0, explanation: 'البخل ضد الكرم.' },
        { text: 'ما اسم المفعول من الفعل «كتب»؟', options: ['مكتوب', 'كاتب', 'كتاب', 'كتابة'], correct: 0, explanation: 'اسم المفعول من الفعل الثلاثي كتب هو مكتوب.' },
        { text: 'ما اسم الفاعل من الفعل «استخرج»؟', options: ['مستخرِج', 'مستخرَج', 'خارج', 'استخراج'], correct: 0, explanation: 'اسم الفاعل من استخرج هو مستخرِج بكسر الراء.' },
        { text: 'ما مصدر الفعل «انطلق»؟', options: ['انطلاق', 'منطلق', 'منطلِق', 'طلق'], correct: 0, explanation: 'مصدر الفعل انطلق هو انطلاق.' },
        { text: 'ما معنى «يشرق الصباح»؟', options: ['يضيء ويطلع', 'يغيب وينتهي', 'يمطر بغزارة', 'يشتد برده'], correct: 0, explanation: 'يشرق الصباح أي يطلع نوره ويضيء.' },
        { text: 'ما مفرد كلمة «قصص»؟', options: ['قصة', 'قصاص', 'قاص', 'قصاصة'], correct: 0, explanation: 'مفرد قصص هو قصة.' },
        { text: 'ما جمع كلمة «عصفور»؟', options: ['عصافير', 'عصفوران', 'عواصف', 'عصفورات'], correct: 0, explanation: 'عصافير جمع تكسير لكلمة عصفور.' },
        { text: 'ما معنى «عاد المسافر»؟', options: ['رجع', 'سافر', 'انتظر', 'استقر'], correct: 0, explanation: 'عاد تعني رجع.' },
        { text: 'ما مرادف كلمة «باهظة»؟', options: ['غالية', 'رخيصة', 'خفيفة', 'قديمة'], correct: 0, explanation: 'باهظة تعني مرتفعة الثمن أو غالية.' },
        { text: 'ما ضد كلمة «متواضع»؟', options: ['متكبر', 'بسيط', 'هادئ', 'لطيف'], correct: 0, explanation: 'المتكبر ضد المتواضع.' },
        { text: 'ما جمع كلمة «قاضٍ»؟', options: ['قضاة', 'قاضيان', 'قاضون', 'قضايا'], correct: 0, explanation: 'جمع قاضٍ هو قضاة.' },
        { text: 'ما مصدر الفعل «تعلّم»؟', options: ['تعلُّم', 'عالِم', 'معلوم', 'تعليمات'], correct: 0, explanation: 'مصدر الفعل تعلّم هو تعلُّم.' },
        { text: 'كلمة «مفهوم» على وزن:', options: ['مفعول', 'فاعل', 'فعيل', 'مفعال'], correct: 0, explanation: 'مفهوم اسم مفعول من الفعل فهم، ووزنه مفعول.' }
    ],
    'البلاغة والأساليب': [
        { text: 'في جملة «العلم نور»، ما نوع التشبيه؟', options: ['تشبيه بليغ', 'تشبيه مرسل', 'استعارة مكنية', 'كناية'], correct: 0, explanation: 'حذف وجه الشبه والأداة، فصار تشبيهاً بليغاً.' },
        { text: 'ما نوع الأسلوب في «لا تهمل واجبك»؟', options: ['نهي', 'أمر', 'استفهام', 'نداء'], correct: 0, explanation: 'دخلت «لا» الناهية على الفعل المضارع، فصار الأسلوب نهياً.' },
        { text: 'ما نوع الأسلوب في «ما أجمل السماء!»؟', options: ['تعجب', 'استفهام', 'نداء', 'نفي'], correct: 0, explanation: '«ما أجمل» صيغة قياسية للتعجب.' },
        { text: 'ما المحسن البديعي بين «الليل» و«النهار»؟', options: ['طباق', 'جناس', 'سجع', 'ترادف'], correct: 0, explanation: 'الليل والنهار لفظان متضادان، والجمع بينهما طباق.' },
        { text: 'ما نوع الأسلوب في «هل قرأت القصة؟»؟', options: ['استفهام', 'أمر', 'تعجب', 'نهي'], correct: 0, explanation: 'بدأت الجملة بأداة الاستفهام «هل».' },
        { text: 'في «الجندي كالأسد»، ما أداة التشبيه؟', options: ['الكاف', 'الجندي', 'الأسد', 'الشجاعة'], correct: 0, explanation: 'الكاف هي أداة التشبيه التي ربطت الجندي بالأسد.' },
        { text: 'ما نوع الأسلوب في «اكتبْ واجبك»؟', options: ['أمر', 'نهي', 'استفهام', 'تعجب'], correct: 0, explanation: 'الفعل اكتبْ فعل أمر يطلب القيام بالواجب.' },
        { text: 'ما نوع الأسلوب في «يا طالبَ العلم»؟', options: ['نداء', 'استفهام', 'نفي', 'تعجب'], correct: 0, explanation: 'بدأت الجملة بأداة النداء «يا».' },
        { text: 'ما أداة الاستفهام المناسبة للسؤال عن الزمان؟', options: ['متى', 'أين', 'كيف', 'كم'], correct: 0, explanation: 'تستخدم «متى» للسؤال عن الزمن.' },
        { text: 'ما نوع الأسلوب في «ليت الشباب يعود»؟', options: ['تمنٍّ', 'ترجٍّ', 'نهي', 'أمر'], correct: 0, explanation: 'ليت من أخوات إن وتفيد التمني.' },
        { text: 'ما نوع الأسلوب في «لعل المطر يهطل»؟', options: ['ترجٍّ', 'تمنٍّ', 'نداء', 'نفي'], correct: 0, explanation: 'لعل تفيد الترجي وتوقع أمر محبوب.' },
        { text: 'ما نوع الأسلوب في «أكرمْ بالعلم!»؟', options: ['تعجب', 'استفهام', 'نداء', 'نهي'], correct: 0, explanation: '«أكرمْ بالعلم» صيغة قياسية للتعجب.' },
        { text: 'في «ابتسم الصباح»، ما الصورة البلاغية؟', options: ['استعارة مكنية', 'طباق', 'جناس', 'تشبيه مرسل'], correct: 0, explanation: 'شُبّه الصباح بإنسان يبتسم، وحُذف المشبه به، فهي استعارة مكنية.' },
        { text: 'في «صلّيت المغرب في المغرب»، ما المحسن البديعي؟', options: ['جناس تام', 'طباق', 'سجع', 'ترادف'], correct: 0, explanation: 'تطابقت الكلمتان في اللفظ واختلف معناهما، فهذا جناس تام.' },
        { text: 'في «العلم نور والجهل غرور»، ما المحسن في نهاية العبارتين؟', options: ['سجع', 'طباق', 'تشبيه', 'كناية'], correct: 0, explanation: 'اتفاق نهايتي العبارتين في النغمة والحرف الأخير سجع.' },
        { text: 'قولنا «فلان كثير الرماد» كناية عن:', options: ['الكرم', 'الفقر', 'السرعة', 'الصمت'], correct: 0, explanation: 'كثرة الرماد تدل على كثرة الطبخ للضيوف، وهي كناية عن الكرم.' },
        { text: 'في «الصدق منجاة والكذب مهلكة»، ما العلاقة بين الصدق والكذب؟', options: ['طباق', 'جناس', 'سجع', 'ترادف'], correct: 0, explanation: 'الصدق والكذب متضادان، والجمع بينهما طباق.' },
        { text: 'في «وجه الطفل كالقمر»، نوع التشبيه:', options: ['تشبيه مرسل', 'تشبيه بليغ', 'استعارة', 'كناية'], correct: 0, explanation: 'ذُكرت أداة التشبيه الكاف، لذلك يسمى تشبيهاً مرسلاً.' },
        { text: 'ما نوع الأسلوب في «أين وضعت كتابك؟»؟', options: ['استفهام', 'نداء', 'أمر', 'تعجب'], correct: 0, explanation: 'أين أداة استفهام يُسأل بها عن المكان.' },
        { text: 'في «يضحك الصباح وتبكي السماء»، الصورة في إسناد الضحك للصباح:', options: ['استعارة مكنية', 'طباق', 'جناس', 'تشبيه مفصل'], correct: 0, explanation: 'شُبّه الصباح بإنسان يضحك، وحُذف المشبه به، فهي استعارة مكنية.' },
        { text: 'ما نوع الأسلوب في «لا تؤجل عمل اليوم»؟', options: ['نهي', 'أمر', 'استفهام', 'تمنٍّ'], correct: 0, explanation: 'لا الناهية مع الفعل المضارع تصوغ أسلوب النهي.' },
        { text: 'ما المحسن البديعي بين «يضحك» و«يبكي»؟', options: ['طباق', 'سجع', 'جناس', 'ترادف'], correct: 0, explanation: 'يضحك ويبكي معنيان متضادان، والجمع بينهما طباق.' }
    ]
};

const ARABIC_BONUS_QUESTIONS = {
    'النحو والإعراب': [
        { text: 'في «عاد المسافرون مسرورين»، كلمة مسرورين:', options: ['حال منصوب', 'مفعول به', 'فاعل', 'خبر مرفوع'], correct: 0, explanation: 'مسرورين حال منصوب يبين هيئة المسافرين عند عودتهم.' },
        { text: 'في «لم يسعَ المهملُ إلى النجاح»، علامة جزم يسعَ:', options: ['حذف حرف العلة', 'السكون', 'حذف النون', 'الفتحة'], correct: 0, explanation: 'يسعَ فعل مضارع معتل الآخر مجزوم بحذف حرف العلة.' },
        { text: 'في «المخلصون محبوبون»، علامة رفع المخلصون:', options: ['الواو', 'الألف', 'الضمة', 'الياء'], correct: 0, explanation: 'جمع المذكر السالم يرفع بالواو.' },
        { text: 'في «إن المعلماتِ مجتهداتٌ»، خبر إن هو:', options: ['مجتهداتٌ', 'إن', 'المعلماتِ', 'ضمير مستتر'], correct: 0, explanation: 'مجتهداتٌ خبر إن مرفوع بالضمة.' },
        { text: 'في «كرّم المديرُ المتفوقين»، علامة نصب المتفوقين:', options: ['الياء', 'الفتحة', 'الكسرة', 'الألف'], correct: 0, explanation: 'المتفوقين جمع مذكر سالم منصوب بالياء.' },
        { text: 'في «الحديقتان واسعتان»، علامة رفع واسعتان:', options: ['الألف', 'الواو', 'الضمة', 'الياء'], correct: 0, explanation: 'واسعتان خبر مرفوع بالألف لأنه مثنى.' },
        { text: 'أي الجمل الآتية تشتمل على مفعول به؟', options: ['حفظت نورة القصيدةَ', 'نام الطفلُ', 'أشرقت الشمسُ', 'وصل المسافرُ'], correct: 0, explanation: 'القصيدةَ مفعول به وقع عليه فعل الحفظ.' },
        { text: 'في «صار الماءُ بخاراً»، خبر صار هو:', options: ['بخاراً', 'صار', 'الماءُ', 'ضمير مستتر'], correct: 0, explanation: 'بخاراً خبر صار منصوب.' },
        { text: 'في «المهندسون يخططون»، الفاعل في يخططون:', options: ['واو الجماعة', 'المهندسون', 'نون الرفع', 'ضمير مستتر'], correct: 0, explanation: 'واو الجماعة ضمير متصل في محل رفع فاعل.' },
        { text: 'في «لن يتأخرَ المجتهد»، الفعل يتأخر:', options: ['مضارع منصوب', 'مضارع مجزوم', 'ماضٍ', 'أمر'], correct: 0, explanation: 'لن تنصب الفعل المضارع، وعلامة نصبه الفتحة.' }
    ],
    'الإملاء': [
        { text: 'اختر الكتابة الصحيحة:', options: ['قراءة', 'قرائة', 'قرأة', 'قراءه'], correct: 0, explanation: 'الصواب «قراءة» بهمزة متطرفة على السطر بعد الألف.' },
        { text: 'أي الكلمات الآتية همزتها متوسطة على واو؟', options: ['مؤمن', 'فئة', 'سائل', 'رأس'], correct: 0, explanation: 'في «مؤمن» كتبت الهمزة على واو لمناسبة الضمة.' },
        { text: 'أي الكلمات الآتية تنتهي بألف مقصورة؟', options: ['مصطفى', 'عصا', 'دعا', 'سما'], correct: 0, explanation: 'اسم «مصطفى» ينتهي بألف مقصورة على صورة الياء.' },
        { text: 'اختر الكلمة المكتوبة بهمزة قطع:', options: ['إحسان', 'استغفار', 'انتظار', 'استخدام'], correct: 0, explanation: 'همزة «إحسان» همزة قطع تثبت في النطق والكتابة.' },
        { text: 'في كلمة «مساء»، كتبت الهمزة على:', options: ['السطر', 'الألف', 'الواو', 'النبرة'], correct: 0, explanation: 'الهمزة المتطرفة بعد الألف تكتب على السطر.' },
        { text: 'أي الكلمات الآتية تنتهي بتاء مربوطة؟', options: ['مكتبة', 'صوت', 'نبات', 'بيت'], correct: 0, explanation: '«مكتبة» اسم مؤنث ينتهي بتاء مربوطة.' },
        { text: 'اختر الرسم الصحيح للفعل الماضي:', options: ['دعا', 'دعى', 'دعاء', 'دعئ'], correct: 0, explanation: 'أصل ألف الفعل الثلاثي دعا واو، لذلك تكتب ألفاً قائمة.' },
        { text: 'ما الكلمة التي كتبت همزتها المتطرفة على السطر؟', options: ['سماء', 'شاطئ', 'تباطؤ', 'قارئ'], correct: 0, explanation: 'كتبت الهمزة على السطر في «سماء» لأنها جاءت بعد ألف مد.' },
        { text: 'اختر الكتابة الصحيحة لتنوين «جزء» بالنصب:', options: ['جزءاً', 'جزءن', 'جزءٌ', 'جزءٍ'], correct: 0, explanation: 'ينون الاسم المنتهي بهمزة على السطر بإضافة ألف التنوين بعد الهمزة.' },
        { text: 'في كلمة «الشَّمس»، اللام:', options: ['شمسية', 'قمرية', 'زائدة في النطق', 'ساكنة ظاهرة'], correct: 0, explanation: 'لا تنطق اللام في الشمس، وتدغم في الحرف الشمسي بعدها.' }
    ],
    'المفردات والصرف': [
        { text: 'ما اسم الفاعل من «أبدع»؟', options: ['مبدع', 'مبدَع', 'إبداع', 'بديع'], correct: 0, explanation: 'اسم الفاعل من أبدع هو مبدع.' },
        { text: 'ما اسم المفعول من «استعمل»؟', options: ['مستعمَل', 'مستعمِل', 'استعمال', 'عامل'], correct: 0, explanation: 'اسم المفعول من استعمل هو مستعمَل بفتح ما قبل الآخر.' },
        { text: 'ما جمع كلمة «مصباح»؟', options: ['مصابيح', 'مصباحان', 'مصابيحون', 'مصابيحان'], correct: 0, explanation: 'مصابيح جمع تكسير لمصباح.' },
        { text: 'ما مفرد كلمة «أودية»؟', options: ['وادٍ', 'واديان', 'وديان', 'وادي'], correct: 0, explanation: 'مفرد أودية هو وادٍ.' },
        { text: 'ما ضد كلمة «نادر»؟', options: ['شائع', 'قليل', 'عزيز', 'نفيس'], correct: 0, explanation: 'شائع هو ضد نادر.' },
        { text: 'ما مرادف «تأمل»؟', options: ['تفكر', 'تسرع', 'توقف', 'تجاهل'], correct: 0, explanation: 'تأمل تعني تفكر وتدبر.' },
        { text: 'ما مصدر الفعل «شارك»؟', options: ['مشاركة', 'شريك', 'مشترك', 'شاركون'], correct: 0, explanation: 'مصدر الفعل شارك هو مشاركة.' },
        { text: 'كلمة «مفتاح» اسم آلة على وزن:', options: ['مفعال', 'فاعل', 'مفعول', 'فعيل'], correct: 0, explanation: 'مفتاح اسم آلة على وزن مفعال.' },
        { text: 'ما مثنى كلمة «فتى»؟', options: ['فتيان', 'فتاوات', 'فتيون', 'فتاتان'], correct: 0, explanation: 'مثنى فتى هو فتيان في حالة الرفع.' },
        { text: 'ما جمع كلمة «أديب»؟', options: ['أدباء', 'أدب', 'أديبان', 'مؤدبون'], correct: 0, explanation: 'أدباء جمع تكسير لكلمة أديب.' }
    ],
    'البلاغة والأساليب': [
        { text: 'في «العلم يرفع بيوتاً لا عماد لها»، الصورة في «يرفع العلم»:', options: ['استعارة مكنية', 'طباق', 'جناس', 'تشبيه مرسل'], correct: 0, explanation: 'صُوّر العلم ببنّاء يرفع البيوت، وهي استعارة مكنية.' },
        { text: 'ما نوع الأسلوب في «ما أروع الصدق!»؟', options: ['تعجب', 'نداء', 'استفهام', 'نهي'], correct: 0, explanation: 'ما أروع صيغة قياسية للتعجب.' },
        { text: 'في «العلم والجهل»، المحسن البديعي هو:', options: ['طباق', 'سجع', 'جناس', 'ترادف'], correct: 0, explanation: 'العلم والجهل لفظان متضادان، والجمع بينهما طباق.' },
        { text: 'ما نوع الأسلوب في «ألا تحب القراءة؟»؟', options: ['استفهام', 'أمر', 'تعجب', 'نهي'], correct: 0, explanation: 'بدأ الكلام بأداة الاستفهام ألا.' },
        { text: 'قولنا «فلان نظيف اليد» كناية عن:', options: ['الأمانة', 'سرعة الكتابة', 'القوة', 'الفقر'], correct: 0, explanation: 'نظافة اليد كناية عن الأمانة والنزاهة.' },
        { text: 'ما أداة التشبيه في «كأن القمر مصباح»؟', options: ['كأن', 'القمر', 'مصباح', 'لا توجد أداة'], correct: 0, explanation: 'كأن أداة تشبيه تدخل على الجملة الاسمية.' },
        { text: 'ما نوع الأسلوب في «لا تكذب»؟', options: ['نهي', 'أمر', 'تمنٍّ', 'نداء'], correct: 0, explanation: 'لا الناهية مع الفعل المضارع تصوغ أسلوب النهي.' },
        { text: 'في «يوم لك ويوم عليك»، العلاقة بين لك وعليك:', options: ['طباق', 'ترادف', 'جناس تام', 'سجع'], correct: 0, explanation: 'تقابل المعنيين في لك وعليك يحقق الطباق.' },
        { text: 'ما نوع الأسلوب في «ليت السلام يعم العالم»؟', options: ['تمنٍّ', 'ترجٍّ', 'استفهام', 'نفي'], correct: 0, explanation: 'ليت تفيد التمني، وهو طلب أمر محبوب بعيد أو متعذر.' },
        { text: 'في «العلم كالنور يهدي العقول»، المشبه به هو:', options: ['النور', 'العلم', 'العقول', 'الهداية'], correct: 0, explanation: 'النور هو المشبه به الذي قرّب معنى العلم.' }
    ]
};

const ARABIC_GAME_TEMPLATES = [
    { id: 'arabic-grammar', number: 1, set: 'core', title: 'تحدي النحو والإعراب', skill: 'النحو والإعراب', icon: '🧩', difficulty: 'متدرج', description: 'تدرّب على الجملة الاسمية والفعلية والعلامات الإعرابية والنواسخ.', objective: 'حلّل الجمل العربية وحدد مواقع الكلمات وعلامات إعرابها.', points: 200 },
    { id: 'arabic-grammar-2', number: 5, set: 'bonus', title: 'مختبر النحو التطبيقي', skill: 'النحو والإعراب', icon: '🧠', difficulty: 'متقدم', description: 'جولة جديدة في الحال والمثنى وجمع المؤنث السالم وأدوات الجزم.', objective: 'طبّق القواعد النحوية على جمل متنوعة.', points: 200 },
    { id: 'arabic-spelling', number: 2, set: 'core', title: 'ميدان الإملاء', skill: 'الإملاء', icon: '✍️', difficulty: 'متدرج', description: 'تدرّب على الهمزات والتاء والألف اللينة واللام الشمسية والقمرية.', objective: 'اختر الرسم الإملائي الصحيح وطبّق القواعد على الكلمات.', points: 200 },
    { id: 'arabic-spelling-2', number: 6, set: 'bonus', title: 'مصيدة الأخطاء الإملائية', skill: 'الإملاء', icon: '🔎', difficulty: 'متقدم', description: 'جولة جديدة في كتابة الهمزة والتنوين والألف اللينة والتاء.', objective: 'اكتشف الرسم الصحيح للكلمات في مواقف إملائية متنوعة.', points: 200 },
    { id: 'arabic-vocabulary', number: 3, set: 'core', title: 'كنز المفردات والصرف', skill: 'المفردات والصرف', icon: '📚', difficulty: 'متدرج', description: 'تدرّب على المعاني والأضداد والجمع والمثنى والمشتقات.', objective: 'نمِّ حصيلتك اللغوية وتعرّف أبنية الكلمات وتحولاتها.', points: 200 },
    { id: 'arabic-vocabulary-2', number: 7, set: 'bonus', title: 'سباق عائلات الكلمات', skill: 'المفردات والصرف', icon: '🌱', difficulty: 'متقدم', description: 'جولة جديدة في الجذور والمصادر والمشتقات والمعاني الدقيقة.', objective: 'اكتشف صلات الكلمات ومعانيها من جذورها وأوزانها.', points: 200 },
    { id: 'arabic-rhetoric', number: 4, set: 'core', title: 'رحلة البلاغة والأساليب', skill: 'البلاغة والأساليب', icon: '🎨', difficulty: 'متدرج', description: 'تدرّب على التشبيه والاستعارة والمحسنات والأساليب الإنشائية.', objective: 'اكتشف جمال التعبير وميّز الصور البلاغية والأساليب.', points: 200 },
    { id: 'arabic-rhetoric-2', number: 8, set: 'bonus', title: 'مسرح البيان', skill: 'البلاغة والأساليب', icon: '🎭', difficulty: 'متقدم', description: 'جولة جديدة في التشبيه والكناية والطباق والسجع والأساليب.', objective: 'حلّل التعبير البلاغي واكتشف أثره في المعنى.', points: 200 }
];

const ARABIC_GAME_SKILL_META = {
    'النحو والإعراب': {
        icon: '🧩',
        titlePrefix: 'مختبر النحو',
        objective: 'حلّل الجمل وحدد مواقع الكلمات وعلامات إعرابها.',
        themes: ['الجملة الاسمية', 'الجملة الفعلية', 'كان وأخواتها', 'إن وأخواتها', 'المثنى والجمع', 'الأفعال الخمسة', 'الحال والتمييز', 'الفاعل والمفعول']
    },
    'الإملاء': {
        icon: '✍️',
        titlePrefix: 'تحدي الإملاء',
        objective: 'اكتشف الرسم الصحيح وطبّق القواعد الإملائية في سياقها.',
        themes: ['الهمزة المتوسطة', 'الهمزة المتطرفة', 'همزتا الوصل والقطع', 'التاء المربوطة والمفتوحة', 'الألف اللينة', 'التنوين', 'اللام الشمسية والقمرية', 'التدقيق الإملائي']
    },
    'المفردات والصرف': {
        icon: '📚',
        titlePrefix: 'رحلة المفردات',
        objective: 'استكشف الجذور والأوزان والمعاني والمشتقات العربية.',
        themes: ['الجذور اللغوية', 'المترادفات والأضداد', 'المثنى والجمع', 'اسم الفاعل والمفعول', 'المصادر', 'أسماء الآلة', 'المفرد والجمع', 'المعنى في السياق']
    },
    'البلاغة والأساليب': {
        icon: '🎨',
        titlePrefix: 'مسرح البلاغة',
        objective: 'حلّل الصور البلاغية والأساليب وتعرّف أثرها في المعنى.',
        themes: ['التشبيه', 'الاستعارة', 'الطباق والمقابلة', 'الكناية', 'الجناس والسجع', 'الاستفهام والنداء', 'الأمر والنهي', 'التعجب والتمني']
    }
};

const ARABIC_GAME_TYPES = Object.entries(ARABIC_GAME_SKILL_META).flatMap(([skill, meta], skillIndex) => {
    const templates = ARABIC_GAME_TEMPLATES.filter(game => game.skill === skill);
    return Array.from({ length: 25 }, (_, gameIndex) => {
        const template = templates[gameIndex];
        const number = skillIndex * 25 + gameIndex + 1;
        const themeIndex = (gameIndex - templates.length) % meta.themes.length;
        const cycle = Math.floor((gameIndex - templates.length) / meta.themes.length) + 1;
        const theme = meta.themes[themeIndex];

        if (template) {
            return { ...template, number, poolStart: gameIndex };
        }

        return {
            id: `arabic-game-${number}`,
            number,
            skill,
            set: 'generated',
            poolStart: gameIndex,
            title: `${meta.titlePrefix}: ${theme} ${cycle > 1 ? `(${cycle})` : ''}`.trim(),
            icon: meta.icon,
            difficulty: gameIndex < 12 ? 'متدرج' : 'متقدم',
            description: `جولة من 20 سؤالاً متنوعاً في ${theme}.`,
            objective: meta.objective,
            points: 200
        };
    });
});

// Interactive Arabic-language games center
class GamesManager {
    constructor() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.activeGame = null;
        this.gameTimer = null;
        this.timeLeft = 25;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.answerLocked = false;
        this.wheelSpinning = false;

        // Memory game
        this.memoryCards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.memoryMoves = 0;
        this.memoryLocked = false;
        this.memoryTimer = null;
        this.memorySeconds = 0;
    }

    init() {
        this.renderGamesGrid();
        this.setupFiltersAndSearch();
        this.setupWheel();
    }

    renderGamesGrid() {
        const grid = document.getElementById('games-catalog-grid');
        if (!grid) return;

        const completedGames = new Set(window.appStorage.getCompletedGames());
        let games = window.appStorage.getGames().map(game => ({
            ...game,
            questions: this.getGameQuestions(game),
            completed: completedGames.has(game.id)
        }));

        // Apply category filter
        if (this.currentFilter !== 'all') {
            games = games.filter(g => g.book === this.currentFilter);
        }

        // Apply search query
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            games = games.filter(g => 
                g.title.toLowerCase().includes(q) || 
                g.description.toLowerCase().includes(q) ||
                g.skill.toLowerCase().includes(q) ||
                g.objective.toLowerCase().includes(q) ||
                g.questions.some(question => question.text.toLowerCase().includes(q))
            );
        }

        const countEl = document.getElementById('games-count-badge');
        if (countEl) countEl.textContent = `${games.length} لعبة من دروس الكتابين`;

        if (games.length === 0) {
            grid.innerHTML = `<div class="p-8 text-center text-muted" style="grid-column: 1/-1;">لا توجد ألعاب مطابقة لبحثك، جرب كلمة أخرى!</div>`;
            return;
        }

        grid.innerHTML = games.map(g => `
            <div class="portal-card game-item-card" onclick="${g.completed ? '' : `window.gamesManager.launchGame('${g.id}')`}" style="cursor: ${g.completed ? 'default' : 'pointer'}; border-radius: 16px; transition: all 0.25s; opacity: ${g.completed ? '0.72' : '1'};">
                <div class="flex justify-between items-start mb-3">
                    <span style="font-size: 2.2rem;">${g.icon}</span>
                    <span class="badge" style="background: ${g.completed ? '#e2e8f0' : (g.difficulty === 'مبتدئ' ? '#d1fae5' : (g.difficulty === 'متوسط' ? '#fef3c7' : '#fee2e2'))}; color: ${g.completed ? '#475569' : (g.difficulty === 'مبتدئ' ? '#065f46' : (g.difficulty === 'متوسط' ? '#b45309' : '#991b1b'))}; padding: 0.25rem 0.7rem; border-radius: 99px; font-weight: 800; font-size: 0.75rem;">
                        ${g.completed ? 'اكتملت ✓' : g.difficulty}
                    </span>
                </div>
                <div class="text-xs text-muted mb-1">اللعبة ${g.number} | ${g.skill}</div>
                <h4 class="font-extrabold text-lg mb-2">${g.title}</h4>
                <p class="text-sm text-muted mb-4" style="line-height: 1.5;">${g.description}</p>
                <p class="text-sm mb-4" style="line-height: 1.6;"><strong>هدف التعلّم:</strong> ${g.objective}</p>
                <div class="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                    <span class="font-bold text-accent" style="font-size: 0.9rem;">+${g.points} نقطة</span>
                    <button class="btn ${g.completed ? 'btn-outline' : 'btn-primary'} btn-sm" ${g.completed ? 'disabled' : ''} style="padding: 0.35rem 0.9rem;">
                        ${g.completed ? 'اكتملت' : '🎮 ابدأ الجولة'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupFiltersAndSearch() {
        const filterContainer = document.getElementById('game-filter-buttons');
        if (filterContainer) {
            filterContainer.innerHTML = `
                <button class="game-filter-pill active" data-filter="all" style="padding: 0.4rem 1rem; border-radius: 99px; border: 1px solid var(--border); font-weight: 700; cursor: pointer; background: var(--surface-elevated);">📚 كل دروس الكتابين</button>
                ${[...new Set(window.appStorage.getGames().map(game => game.book))].map(book =>
                    `<button class="game-filter-pill" data-filter="${book}" style="padding: 0.4rem 1rem; border-radius: 99px; border: 1px solid var(--border); font-weight: 700; cursor: pointer; background: var(--surface-elevated);">${book}</button>`
                ).join('')}
            `;
        }
        const filterBtns = document.querySelectorAll('.game-filter-pill');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderGamesGrid();
                if (window.soundEngine) window.soundEngine.click();
            });
        });

        const searchInput = document.getElementById('search-games-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                this.renderGamesGrid();
            });
        }
    }

    launchGame(gameId) {
        const gameType = window.appStorage.getGames().find(item => item.id === gameId);
        if (!gameType) return;
        if (window.appStorage.getCompletedGames().includes(gameId)) return;

        this.activeGame = { ...gameType, questions: this.prepareGameQuestions(gameType) };
        const g = this.activeGame;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.answerLocked = false;
        clearInterval(this.gameTimer);

        let modal = document.getElementById('game-play-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'game-play-modal';
            modal.className = 'modal-backdrop';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-dialog" style="max-width: 650px; background: var(--surface); border: 2px solid var(--primary); border-radius: 20px; padding: 2rem;">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <span style="font-size: 2rem;">${g.icon}</span>
                        <div>
                            <span class="badge" style="background: #e0e7ff; color: #4338ca; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 99px;">
                                ${this.activeGame.questions.length} سؤالاً في هذا النوع
                            </span>
                            <h3 class="font-bold text-xl">${g.title}</h3>
                        </div>
                    </div>
                    <button class="modal-close-btn" onclick="window.gamesManager.closeGameModal()">&times;</button>
                </div>

                <div class="flex justify-between items-center my-3 p-2 bg-surface-elevated rounded-lg border border-[var(--border)]" style="background: var(--surface-elevated);">
                    <span class="text-sm font-bold text-muted">${g.skill}</span>
                    <span class="font-bold" id="game-modal-progress-text"></span>
                    <span class="font-bold text-danger" id="game-modal-timer">⏱️ 25 ثانية</span>
                </div>

                <div class="p-3 rounded-lg border border-[var(--border)]" style="background: var(--surface-elevated);">
                    <strong>هدف التعلّم:</strong> ${g.objective}
                </div>

                <div class="my-4" role="progressbar" aria-label="تقدم الجولة" aria-valuemin="0" aria-valuemax="${this.activeGame.questions.length}" aria-valuenow="0" style="height: 8px; background: var(--border); border-radius: 99px; overflow: hidden;">
                    <div id="game-modal-progress-fill" style="height: 100%; width: 0; background: var(--success); transition: width 0.2s ease;"></div>
                </div>

                <div class="my-4" id="game-modal-question"></div>
                <div id="game-modal-result" class="hidden mt-4 p-4 rounded-lg"></div>
            </div>
        `;

        modal.classList.remove('hidden');
        if (window.soundEngine) window.soundEngine.coin();
        this.renderCurrentQuestion();
    }

    getGameQuestions(game) {
        return [...(game.bookQuestions || [])];
    }

    prepareGameQuestions(game) {
        const questions = this.getGameQuestions(game);
        for (let index = questions.length - 1; index > 0; index--) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
        }
        return questions.map(question => {
            const options = [...question.options];
            for (let index = options.length - 1; index > 0; index--) {
                const swapIndex = Math.floor(Math.random() * (index + 1));
                [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
            }
            return { ...question, options, correct: options.indexOf(question.options[question.correct]) };
        });
    }

    renderCurrentQuestion() {
        const game = this.activeGame;
        if (!game) return;
        const question = game.questions[this.currentQuestionIndex];
        const questionPanel = document.getElementById('game-modal-question');
        const progressText = document.getElementById('game-modal-progress-text');
        const progressBar = document.getElementById('game-modal-progress-fill');
        const progressContainer = progressBar?.parentElement;
        const resultBox = document.getElementById('game-modal-result');
        if (!questionPanel) return;

        this.answerLocked = false;
        if (resultBox) {
            resultBox.className = 'hidden mt-4 p-4 rounded-lg';
            resultBox.innerHTML = '';
        }
        if (progressText) progressText.textContent = `السؤال ${this.currentQuestionIndex + 1} من ${game.questions.length}`;
        if (progressBar) progressBar.style.width = `${(this.currentQuestionIndex / game.questions.length) * 100}%`;
        if (progressContainer) progressContainer.setAttribute('aria-valuenow', String(this.currentQuestionIndex));

        questionPanel.innerHTML = `
            <h4 class="font-extrabold text-lg mb-4 text-center" style="line-height: 1.6;">${question.text}</h4>
            <div class="grid gap-3" id="game-modal-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option-btn" onclick="window.gamesManager.handleAnswer(${index})" style="width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 2px solid var(--border); border-radius: 12px; font-size: 1.05rem; font-weight: 700; cursor: pointer; background: var(--surface);">
                        <span class="opt-badge">${['أ', 'ب', 'ج', 'د'][index]}</span>
                        <span>${option}</span>
                    </button>
                `).join('')}
            </div>
        `;

        this.timeLeft = 25;
        const timerEl = document.getElementById('game-modal-timer');
        if (timerEl) timerEl.textContent = `⏱️ ${this.timeLeft} ثانية`;
        clearInterval(this.gameTimer);
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            if (timerEl) timerEl.textContent = `⏱️ ${this.timeLeft} ثانية`;
            if (this.timeLeft <= 0) {
                clearInterval(this.gameTimer);
                this.handleAnswer(-1);
            }
        }, 1000);
    }

    handleAnswer(selectedIdx) {
        if (this.answerLocked) return;
        clearInterval(this.gameTimer);
        const g = this.activeGame;
        if (!g) return;
        this.answerLocked = true;

        const question = g.questions[this.currentQuestionIndex];
        const resultBox = document.getElementById('game-modal-result');
        const btns = document.querySelectorAll('#game-modal-options button');
        btns.forEach(b => b.disabled = true);

        const isCorrect = selectedIdx === question.correct;
        if (isCorrect) {
            this.correctAnswers++;
            if (window.soundEngine) window.soundEngine.success();
            if (window.confettiManager) window.confettiManager.burst(window.innerWidth / 2, window.innerHeight / 2, 70);
            if (btns[selectedIdx]) btns[selectedIdx].style.background = '#d1fae5';
            if (btns[selectedIdx]) btns[selectedIdx].style.borderColor = '#10b981';
        } else {
            if (window.soundEngine) window.soundEngine.wrong();
            if (selectedIdx !== -1 && btns[selectedIdx]) {
                btns[selectedIdx].style.background = '#fee2e2';
                btns[selectedIdx].style.borderColor = '#ef4444';
            }
            if (btns[question.correct]) {
                btns[question.correct].style.background = '#d1fae5';
                btns[question.correct].style.borderColor = '#10b981';
            }
        }

        if (!resultBox) return;
        const isLastQuestion = this.currentQuestionIndex === g.questions.length - 1;
        resultBox.className = `mt-4 p-4 rounded-lg text-center ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`;
        resultBox.style.background = isCorrect ? '#ecfdf5' : '#fef2f2';
        resultBox.style.border = `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`;

        if (isLastQuestion) {
            window.appStorage.completeGame(g.id);
            const earnedPoints = Math.round(g.points * this.correctAnswers / g.questions.length);
            if (earnedPoints > 0) window.appStorage.addPoints(earnedPoints, `إكمال لعبة: ${g.title}`);
            if (window.app) window.app.updateHeaderStats();
            resultBox.innerHTML = `
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${this.correctAnswers === g.questions.length ? '🏆' : '📚'}</div>
                <h4 class="font-extrabold text-lg">انتهت الجولة! ${isCorrect ? 'إجابة أخيرة صحيحة.' : 'راجع الإجابة الصحيحة أدناه.'}</h4>
                <p class="text-sm mt-1">${question.explanation}</p>
                <p class="text-sm mt-2">نتيجتك: ${this.correctAnswers} من ${g.questions.length} أسئلة، وربحت ${earnedPoints} نقطة.</p>
                <button class="btn btn-primary mt-3" onclick="window.gamesManager.returnToGamesList()">العودة إلى قائمة الألعاب كاملة</button>
            `;
        } else {
            resultBox.innerHTML = `
                <h4 class="font-extrabold text-lg">${isCorrect ? 'إجابة صحيحة!' : 'إجابة غير صحيحة'}</h4>
                <p class="text-sm mt-1">${isCorrect ? question.explanation : `الإجابة الصحيحة مظللة بالأخضر. ${question.explanation}`}</p>
                <button class="btn btn-primary mt-3" onclick="window.gamesManager.nextQuestion()">السؤال التالي</button>
            `;
        }
        resultBox.classList.remove('hidden');
    }

    nextQuestion() {
        if (!this.activeGame || this.currentQuestionIndex >= this.activeGame.questions.length - 1) return;
        this.currentQuestionIndex++;
        this.renderCurrentQuestion();
    }

    returnToGamesList() {
        this.closeGameModal();
        this.currentFilter = 'all';
        this.searchQuery = '';
        const searchInput = document.getElementById('search-games-input');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.game-filter-pill').forEach(button => {
            button.classList.toggle('active', button.dataset.filter === 'all');
        });
        this.renderGamesGrid();
        document.getElementById('games-catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    closeGameModal() {
        clearInterval(this.gameTimer);
        document.getElementById('game-play-modal')?.classList.add('hidden');
    }

    // Wheel of Fortune
    setupWheel() {
        const canvas = document.getElementById('wheel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const items = [
            { text: "+50 نقطة شرف 🌟", color: "#FF6B6B" },
            { text: "حكمة أ. علي دحان 📜", color: "#6C5CE7" },
            { text: "+100 نقطة ذهبية 💰", color: "#FFD93D" },
            { text: "وسام الحظ السعيد 🍀", color: "#FD79A8" },
            { text: "+30 نقطة تفوق 🎯", color: "#00B894" },
            { text: "تحية المشرف أ. مؤمن 👔", color: "#0984E3" }
        ];

        const numSegments = items.length;
        const radius = canvas.width / 2;
        const arc = (2 * Math.PI) / numSegments;

        items.forEach((item, i) => {
            const angle = i * arc;
            ctx.beginPath();
            ctx.fillStyle = item.color;
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius - 8, angle, angle + arc);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Cairo, sans-serif';
            ctx.fillText(item.text, radius - 20, 6);
            ctx.restore();
        });

        // Center hub
        ctx.beginPath();
        ctx.arc(radius, radius, 26, 0, 2 * Math.PI);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('منارات', radius, radius + 4);
    }

    spinWheel() {
        if (this.wheelSpinning) return;
        this.wheelSpinning = true;
        const spinBtn = document.getElementById('spin-wheel-btn');
        if (spinBtn) spinBtn.disabled = true;

        const canvas = document.getElementById('wheel-canvas');
        if (!canvas) return;

        const randomSpins = 5 + Math.floor(Math.random() * 5);
        const randomItemIndex = Math.floor(Math.random() * 6);
        const segmentAngle = 360 / 6;
        const targetAngle = (randomSpins * 360) + (360 - (randomItemIndex * segmentAngle) - (segmentAngle / 2) + 270);

        canvas.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        canvas.style.transform = `rotate(${targetAngle}deg)`;

        setTimeout(() => {
            this.wheelSpinning = false;
            if (spinBtn) spinBtn.disabled = false;
            if (window.soundEngine) window.soundEngine.applause();
            if (window.confettiManager) window.confettiManager.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
            window.appStorage.addPoints(50, 'عجلة الحظ الذهبية');
            alert('🎉 مبروك! ربحت 50 نقطة ذهبية من عجلة الحظ في رياض اللغة العربية!');
            if (window.app) window.app.updateHeaderStats();
        }, 4100);
    }
}

window.gamesManager = new GamesManager();
