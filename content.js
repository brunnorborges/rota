'use strict';
/* ============================================================
   THE LONDON REVIEW · content library v3
   30 Morning Pages · 90 band-7+ terms · 40 essay prompts
   ============================================================ */

function U(id){return 'https://images.unsplash.com/'+id+'?w=1400&q=65&auto=format&fit=crop';}
const IMG_FALLBACK=U('photo-1513635269975-59663e0ac1ad'); /* Tower Bridge — verified */

const PHASES=[
{lim:.2,name:'Chapter I · The Departure',mantra:'Every great crossing begins the morning you decide to leave the harbour.',
 caps:['Westminster at first light','The city wakes before you do','A desk, a lamp, a decision'],
 imgs:[U('photo-1529655683826-aba9b3e77383'),U('photo-1533929736458-ca588d08c8be'),U('photo-1470252649378-9c29740c9fa8'),U('photo-1455390582262-044cdead277a')]},
{lim:.4,name:'Chapter II · The Crossing',mantra:'The distance between you and London is measured in mornings, not miles.',
 caps:['Underground, moving anyway','The long road rewards the patient','Red buses, grey skies, forward motion'],
 imgs:[U('photo-1526129318478-62ed807ebdf9'),U('photo-1486299267070-83823f5448dd'),U('photo-1461896836934-ffe607ba8211'),U('photo-1469854523086-cc02fe5d8800')]},
{lim:.6,name:'Chapter III · The Long Middle',mantra:'Libraries are built one shelf at a time. So is a band seven.',
 caps:['Reading rooms and quiet ambition','Old books, new words','Where scholars are made'],
 imgs:[U('photo-1521587760476-6c12a4b040da'),U('photo-1481627834876-b7833e8f5570'),U('photo-1507842217343-583bb7270b66'),U('photo-1464822759023-fed622ff2c3b')]},
{lim:.8,name:'Chapter IV · The Refinement',mantra:'Precision now. The examiner will notice what you polished in the dark.',
 caps:['Spires and standards','Light kept burning late','The city of domes and discipline'],
 imgs:[U('photo-1541339907198-e08756dedf3f'),U('photo-1519682337058-a94d519337bc'),U('photo-1505761671935-60b3a7427bad'),U('photo-1519681393784-d120267933ba')]},
{lim:1.01,name:'Chapter V · The Arrival',mantra:'Walk in like you were always meant to study here.',
 caps:['The bridge you were building all along','Dusk over the Thames, degree in sight','Cap, gown, and a kept promise'],
 imgs:[U('photo-1523050854058-8df90110c9f1'),U('photo-1543832923-44667a44c804'),U('photo-1513635269975-59663e0ac1ad'),U('photo-1529655683826-aba9b3e77383')]}
];

/* Each edition: t=title, s=deck, x=[paragraphs], w=[{w:term,k:kind,d:explanation,e:example}]
   Every term appears verbatim in the text and is auto-highlighted. */
const EDITIONS=[
{t:'The Harbour and the Horizon',s:'On deciding to leave, properly',
x:["Most people never fail at their dream; they simply never formalise the departure. They keep the harbour in sight, telling themselves that one day the weather will be perfect. It never is. What separates the traveller from the dreamer is a compelling reason written down, a date on a calendar, and the willingness to look slightly foolish while the boat is still small.",
"You have your date. London is not a fantasy; it is a logistics problem. Consequently, every block you complete today is not preparation for the journey — it is the journey. The horizon does not come to the harbour."],
w:[{w:'compelling',k:'vocabulary · adjective',d:'So strong it demands attention or belief. Pairs beautifully with “reason”, “argument”, “evidence” — a favourite in Task 2 introductions.',e:'There is a compelling argument for investing in public transport.'},
{w:'formalise',k:'vocabulary · verb',d:'To make something official or give it structure. Less common lexis that lifts your Lexical Resource score.',e:'The two countries formalised the agreement in 2019.'},
{w:'Consequently',k:'linking · result',d:'Formal connector of consequence — stronger than “so”, fresher than “therefore”. Excellent to open a result sentence.',e:'Fees rose sharply; consequently, applications fell.'}]},

{t:'Deep Work, Shallow World',s:'Attention is the tuition you pay yourself',
x:["The modern world is engineered to fragment your attention into pieces too small to build anything with. Cal Newport calls the antidote deep work: long, undistracted stretches in which the brain is allowed to finish a thought. It is increasingly rare, and precisely for that reason increasingly valuable.",
"Whereas a distracted hour evaporates, a deep hour compounds. One focused block of IELTS reading beats three hours of glancing between a passage and a phone. Guard the block, therefore, as if your visa depended on it — in a sense, it does."],
w:[{w:'fragment',k:'vocabulary · verb',d:'To break into small, disconnected pieces. Strong academic verb for describing effects of technology or urbanisation.',e:'Social media has fragmented public debate.'},
{w:'Whereas',k:'linking · contrast',d:'Connects two clauses that contrast directly. More precise than “but” and shows complex sentence control — a band 7 grammar signal.',e:'Whereas cities offer opportunity, rural areas offer calm.'},
{w:'compounds',k:'vocabulary · verb',d:'To grow by building on itself, like interest. A sophisticated way to describe accumulating benefits or problems.',e:'Neglecting sleep compounds the effects of stress.'}]},

{t:'If, Then, London',s:'The science of deciding in advance',
x:["Willpower is a poor guard; it falls asleep on duty. Psychologist Peter Gollwitzer found something sturdier: the implementation intention, a plan in the form “if X happens, then I will do Y”. People who state exactly when, where and how they will act are two to three times more likely to follow through.",
"Do not merely intend to study tonight. Decide now: if it is 20:45, then I sit at the desk and open the timed section. If my phone appears, then it goes to the kitchen. Moreover, write the plan down — the sentence itself is the mechanism."],
w:[{w:'sturdier',k:'vocabulary · adjective',d:'Comparative of sturdy — strong, reliable, well-built. Useful for comparing systems, structures or arguments.',e:'A sturdier policy framework is needed to protect renters.'},
{w:'follow through',k:'vocabulary · phrasal verb',d:'To actually complete what was promised or planned. Natural, idiomatic — examiners reward well-used phrasal verbs.',e:'Governments announce targets but rarely follow through.'},
{w:'Moreover',k:'linking · addition',d:'Formal “and also, importantly”. Perfect to stack a second supporting point in Task 2 body paragraphs.',e:'Cycling is cheap; moreover, it improves public health.'}]},

{t:'The Obstacle Is Information',s:'WOOP: wishing like a scientist',
x:["Positive thinking alone is a sedative. Psychologist Gabriele Oettingen showed that people who only visualise success actually achieve less; the fantasy relaxes the body before the work is done. Her alternative, WOOP — Wish, Outcome, Obstacle, Plan — asks you to name the dream and then interrogate the obstacle standing in front of it.",
"Notwithstanding its simplicity, the method is among the best-evidenced in behavioural science. Your obstacle today has a name: tiredness, the phone, a difficult unit. Name it in the morning, attach a plan to it, and it shrinks from a wall to a hurdle."],
w:[{w:'interrogate',k:'vocabulary · verb',d:'To examine something rigorously and critically — not just people. Elegant academic verb for essays about ideas.',e:'The study interrogates the assumption that growth equals progress.'},
{w:'Notwithstanding',k:'linking · concession',d:'Very formal “despite”. Rare enough to impress, but must be used precisely — followed by a noun phrase.',e:'Notwithstanding the cost, the scheme proved popular.'},
{w:'hurdle',k:'vocabulary · noun',d:'An obstacle you can jump over — smaller than a barrier. Great for problem-solution essays.',e:'Funding remains the main hurdle to expanding the programme.'}]},

{t:'Pair the Bitter with the Sweet',s:'Temptation bundling, the honest bribe',
x:["Katherine Milkman of Wharton discovered that people exercise more when their favourite audiobooks are only available at the gym. She calls it temptation bundling: chaining a pleasure you crave to a task you avoid. It works because it stops the war between present you and future you, and simply pays both.",
"Apply it shamelessly. The special coffee exists only during the listening block. The playlist plays only while flashcards are open. In stark contrast to punishment-based discipline, this approach makes the desk a place your brain wants to return to — and returning is everything."],
w:[{w:'crave',k:'vocabulary · verb',d:'To want intensely, almost physically. Stronger and more precise than “really want”.',e:'After a week of noise, city dwellers crave silence.'},
{w:'shamelessly',k:'vocabulary · adverb',d:'Without embarrassment. Adds a confident, human tone — useful in speaking to show range.',e:'The industry shamelessly targets young consumers.'},
{w:'In stark contrast',k:'linking · contrast',d:'Signals a sharp, dramatic difference — a high-value alternative to “on the other hand”.',e:'In stark contrast to the 1990s, most homes now have internet access.'}]},

{t:'Vote for the Person You Are Becoming',s:'Identity is a ballot box, not a birthplace',
x:["James Clear writes that every action is a vote for the type of person you wish to become. You are not trying to pass an exam; you are becoming the kind of person who studies in London, reads criticism in a second language, and writes with precision. Seen this way, a single completed block is trivial and yet profoundly significant.",
"Hence the question each morning is not “do I feel motivated?” but “what would that person do before eight o'clock?” Cast the vote. The election is daily, and turnout, it turns out, is everything."],
w:[{w:'profoundly',k:'vocabulary · adverb',d:'Deeply, fundamentally. An intensifier with academic weight — far above “very”.',e:'Remote work has profoundly altered city centres.'},
{w:'Hence',k:'linking · result',d:'Compact, formal “for this reason”. Excellent variety when you have already used “therefore”.',e:'The data was incomplete; hence the cautious conclusion.'},
{w:'trivial',k:'vocabulary · adjective',d:'Small, unimportant — often used to dismiss, or to contrast with significance.',e:'The fee seems trivial compared with the long-term benefit.'}]},

{t:'The Architecture of Not Getting Distracted',s:'Design beats discipline',
x:["Behavioural scientists agree on an uncomfortable truth: the people who seem the most disciplined are usually the ones who need discipline least, because they arrange their environment so temptation rarely enters the room. The phone in another room removes the decision entirely; a hundred small decisions never have to be won.",
"Treat your desk as architecture, not scenery. One book, one lamp, one open notebook. Likewise, treat your phone as what it is — a slot machine with a lens — and give it a home far from the work. Environment is the silent syllabus."],
w:[{w:'arrange',k:'vocabulary · verb',d:'To organise deliberately. Simple but precise; collocates with “environment”, “affairs”, “meeting”.',e:'Schools should arrange timetables around adolescent sleep patterns.'},
{w:'temptation',k:'vocabulary · noun',d:'Something that pulls you toward a worse choice. Core vocabulary for essays on technology and habits.',e:'Advertising multiplies temptation without adding satisfaction.'},
{w:'Likewise',k:'linking · addition',d:'“In the same way” — connects parallel ideas elegantly, and works beautifully at sentence start.',e:'Cars should be taxed by emissions; likewise, flights.'}]},

{t:'Boredom Is a Skill',s:'Reclaiming the wandering mind',
x:["The ability to be bored without reaching for a screen is quietly becoming a superpower. Every time you tolerate the itch of an unstimulated minute, you strengthen the same circuitry that holds a paragraph together in the reading test. Every time you scratch it, you teach your brain that attention is negotiable.",
"Practise deliberately: queue without the phone, walk without the podcast, let the kettle boil unaccompanied. Admittedly, it feels absurd at first. But the student who can sit calmly with one difficult page owns the exam room."],
w:[{w:'tolerate',k:'vocabulary · verb',d:'To endure something unpleasant without reacting. Key verb for health, society and behaviour topics.',e:'Modern audiences struggle to tolerate silence.'},
{w:'negotiable',k:'vocabulary · adjective',d:'Open to discussion or change. Saying attention is “negotiable” is a vivid metaphor — examiners love controlled figurative use.',e:'Safety standards should never be negotiable.'},
{w:'Admittedly',k:'linking · concession',d:'Concedes a point before you counter it — the heart of band 7 argumentation.',e:'Admittedly, the scheme is expensive; the returns, however, justify it.'}]},

{t:'The Plateau Is Where the Path Continues',s:'On the days when nothing seems to improve',
x:["Progress in a language is a staircase disguised as a plateau. For weeks the needle appears motionless, and then, abruptly, a listening passage you once found impenetrable sounds slow. The improvement was happening all along, underground, in the roots.",
"George Leonard, in his book Mastery, argues that loving the plateau is the single trait shared by lifelong learners. To persevere when feedback is silent is a form of faith backed by evidence. Keep watering. Nothing that is fed daily stays the same size."],
w:[{w:'impenetrable',k:'vocabulary · adjective',d:'Impossible to enter or understand. Vivid for describing texts, accents, bureaucracy.',e:'Legal contracts are often impenetrable to ordinary readers.'},
{w:'persevere',k:'vocabulary · verb',d:'To continue despite difficulty. The exact register IELTS rewards — formal but natural.',e:'Students who persevere with languages report higher confidence.'},
{w:'abruptly',k:'vocabulary · adverb',d:'Suddenly and noticeably. Precise adverb for describing change in graphs and narratives.',e:'The birth rate declined abruptly after 1990.'}]},

{t:'Comparison, the Quiet Thief',s:'Your lane runs all the way to the Thames',
x:["Theodore Roosevelt reportedly called comparison the thief of joy; social media has since given the thief a master key. Someone will always be scoring higher, studying in a prettier library, holding an offer letter you have not received yet. Their timeline is not evidence about yours.",
"The only legitimate comparison is longitudinal: you, this month, against you, last month. On balance, that ledger is almost certainly positive — you simply never read it, because you were reading someone else's. Close the tab. Open the ledger."],
w:[{w:'legitimate',k:'vocabulary · adjective',d:'Valid, justifiable, lawful. High-frequency academic adjective — collocates with “concern”, “question”, “claim”.',e:'Residents have legitimate concerns about noise.'},
{w:'longitudinal',k:'vocabulary · adjective',d:'Measured over a long period. A precise research word — used well, it signals genuine academic range.',e:'Longitudinal studies link reading habits to later income.'},
{w:'On balance',k:'linking · conclusion',d:'Signals a weighed judgement after considering both sides — the classic band 7 conclusion opener.',e:'On balance, the advantages of remote study outweigh the drawbacks.'}]},

{t:'Perfect Is a Verb That Never Finishes',s:'Ship the ugly first draft',
x:["Perfectionism masquerades as high standards, but functionally it is a delay mechanism: nothing can be judged if nothing is finished. The essay you never wrote scores zero; the flawed essay you wrote and reviewed taught you seven distinct lessons. In writing, as in construction, scaffolding is supposed to look ugly.",
"Lower the entry bar, not the exit bar. Draft fast, then revise like an examiner. To a large extent, band seven is built in the second pass — but there is no second pass without a first."],
w:[{w:'masquerades',k:'vocabulary · verb',d:'To pretend to be something more attractive. A vivid, memorable verb for exposing false appearances.',e:'Much advertising masquerades as advice.'},
{w:'functionally',k:'vocabulary · adverb',d:'In practical effect, whatever the theory says. Sharp analytical adverb.',e:'The committee is functionally powerless.'},
{w:'To a large extent',k:'linking · degree',d:'Quantifies agreement — “mostly, though not entirely”. Perfect for nuanced opinion essays.',e:'To a large extent, urban stress is a design problem.'}]},

{t:'Sleep Is Study',s:'The library that files itself at night',
x:["Memory consolidation is not a metaphor. During deep sleep the hippocampus replays the day's learning and transfers it to long-term storage; cut the night short and the transfer is cut with it. The vocabulary you met this morning is scheduled for filing at roughly 2 a.m.",
"An all-night session before an exam is therefore self-sabotage with extra steps. Protect the last hour before bed: no feeds, no bright screens, a page of English fiction if you like. Rest is not the absence of ambition; it is ambition, delegated."],
w:[{w:'consolidation',k:'vocabulary · noun',d:'The process of making something solid and permanent. Key noun for education and memory topics.',e:'Revision aids the consolidation of new knowledge.'},
{w:'self-sabotage',k:'vocabulary · noun',d:'Undermining your own goals. Compound noun that adds psychological precision.',e:'Procrastination is often anxiety disguised as self-sabotage.'},
{w:'delegated',k:'vocabulary · verb',d:'Entrusted to someone or something else. Formal verb from management English — versatile and impressive.',e:'Routine decisions should be delegated to local councils.'}]},

{t:'Test Yourself Before the Test Does',s:'Active recall, the unglamorous king',
x:["Rereading feels productive because it is fluent; retrieval feels awkward because it is work. Yet decades of research crown active recall — closing the book and dragging the answer out of your own head — as the most effective study technique ever measured. Fluency is a flattering mirror; retrieval is a photograph.",
"Convert passive minutes into questions. Not “I studied linking words” but “name four concession connectors, now”. Similarly, finish each block by writing three sentences using what it taught. What you can produce unprompted is the only thing the exam will count."],
w:[{w:'retrieval',k:'vocabulary · noun',d:'The act of bringing stored information back. Core cognitive-science noun; pairs with “practice”.',e:'Retrieval practice outperforms rereading in nearly every study.'},
{w:'flattering',k:'vocabulary · adjective',d:'Making something look better than it is. Elegant for critiquing appearances.',e:'National averages paint a flattering picture of the economy.'},
{w:'Similarly',k:'linking · addition',d:'Introduces a parallel case. Keeps cohesion smooth without the heaviness of “furthermore”.',e:'Similarly, older workers benefit from retraining schemes.'}]},

{t:'Space It Out',s:'Forgetting is part of the filing system',
x:["Hermann Ebbinghaus mapped the forgetting curve in 1885 and it has not changed since: memory decays fast, then slowly. The trick is to schedule reviews at the exact moments of almost-forgetting — a day, then three, then a week. Each rescue makes the memory more durable than the last.",
"This is why the Anki block matters more than it seems. It looks like repetition; in reality it is precision engineering against the curve. Provided that the reviews actually happen, twenty minutes a day quietly outperforms weekend heroics."],
w:[{w:'decays',k:'vocabulary · verb',d:'To decline gradually and naturally. Scientific verb that transfers well to cities, institutions, standards.',e:'Public infrastructure decays without steady investment.'},
{w:'durable',k:'vocabulary · adjective',d:'Long-lasting, resistant to wear. Collocates with “goods”, “peace”, “memory”.',e:'Apprenticeships create durable employment outcomes.'},
{w:'Provided that',k:'linking · condition',d:'Formal “only if”. Conditional connectors are underused — deploying one accurately stands out.',e:'Tourism benefits regions, provided that profits stay local.'}]},

{t:'Say It Badly, Then Say It Better',s:'Speaking is a contact sport',
x:["No one ever spoke a language into fluency silently. The mouth needs mileage: muscles, rhythm, the small courage of being audibly imperfect. Record yourself for sixty seconds daily; the discomfort you feel listening back is not failure, it is calibration.",
"Shadow a British podcast, imitate the melody, exaggerate it until it feels theatrical. It could be argued that accent matters less than clarity — true — but rhythm carries clarity on its back. Your voice is an instrument; instruments require practice, not permission."],
w:[{w:'calibration',k:'vocabulary · noun',d:'Fine adjustment against a standard. A precise technical noun used metaphorically — band 7 territory.',e:'Feedback provides the calibration that self-study lacks.'},
{w:'audibly',k:'vocabulary · adverb',d:'In a way that can be heard. Specific sensory adverb; “audibly imperfect” shows stylistic control.',e:'The audience sighed audibly at the announcement.'},
{w:'It could be argued that',k:'structure · hedging',d:'Introduces a debatable claim without full commitment — essential academic hedging for Task 2.',e:'It could be argued that examinations reward memory over thought.'}]},

{t:'Feedback Is a Gift Wrapped in Sandpaper',s:'Seek the red ink',
x:["Amateurs collect praise; professionals collect corrections. A returned essay covered in red ink stings for a minute and serves for a decade, because each marked error is a map reference: here, exactly here, is where the next band lives. Unread feedback is tuition thrown into the Thames.",
"Build a personal error log — article misuse, comma splices, that verb you always bend. Review it before every writing session. In other words, let your past mistakes become your most private, most accurate textbook."],
w:[{w:'stings',k:'vocabulary · verb',d:'To cause sharp brief pain, physical or emotional. Vivid and natural in speaking.',e:'Criticism stings most when it is accurate.'},
{w:'bend',k:'vocabulary · verb',d:'Here: to distort a rule or form. Flexible metaphorical verb — “bend the rules/truth/grammar”.',e:'Politicians bend statistics to fit the story.'},
{w:'In other words',k:'linking · reformulation',d:'Restates an idea more simply — signals control over your own argument.',e:'The tax is regressive; in other words, the poor pay proportionally more.'}]},

{t:'The Long Game Has Quiet Scoreboards',s:'Nobody claps for Tuesday',
x:["The decisive work of your life will mostly happen on unremarkable days, unwatched, unposted, unapplauded. A Tuesday listening block moves you toward London by exactly one Tuesday; the crowd arrives only later, for the photograph with the certificate, and will politely call it talent.",
"Let them. Meanwhile, keep the private scoreboard: streaks kept, essays written, words banked. Little by little, the compound interest of ordinary discipline becomes indistinguishable from what others call luck."],
w:[{w:'unremarkable',k:'vocabulary · adjective',d:'Ordinary, not worth comment — often used with quiet irony. Understatement is very British, very band 7.',e:'The treatment began as an unremarkable laboratory finding.'},
{w:'indistinguishable',k:'vocabulary · adjective',d:'Impossible to tell apart. Long, precise, and always impressive when spelled correctly.',e:'Online rumours are often indistinguishable from news.'},
{w:'Meanwhile',k:'linking · time/contrast',d:'Moves the reader to a parallel situation — useful in Task 1 and narrative moments in Task 2.',e:'Exports doubled; meanwhile, imports remained flat.'}]},

{t:'The Economics of a Notification',s:'Someone is billing your attention',
x:["Every notification is an invoice paid in concentration. The average phone user is interrupted every few minutes, and each interruption taxes not just the moment but the twenty minutes of refocusing that follow. Attention has become the scarcest resource in the economy, which is precisely why so many engineers are employed to harvest yours.",
"Turn the economics around. Batch your messages at set hours; make the phone greyscale; let silence accrue like savings. Ultimately, the exam is ninety minutes of sustained attention — train the muscle the market is trying to buy."],
w:[{w:'scarcest',k:'vocabulary · adjective',d:'Superlative of scarce — in shortest supply. Core economics vocabulary, transferable everywhere.',e:'Time is the scarcest resource for working parents.'},
{w:'accrue',k:'vocabulary · verb',d:'To accumulate gradually, like interest. Formal financial verb — superb in essays on benefits building over time.',e:'Advantages accrue to children who read early.'},
{w:'Ultimately',k:'linking · conclusion',d:'“In the end, when everything is weighed”. A softer conclusion signal than “in conclusion” — ideal mid-essay.',e:'Ultimately, prevention costs less than treatment.'}]},

{t:'Begin Before You Feel Ready',s:'Motivation is a result, not a requirement',
x:["We imagine motivation as fuel that must arrive before the engine turns. Neuroscience suggests the reverse: action generates the dopamine that we experience as motivation. The first five minutes of a task are the ignition; feeling like it comes later, if at all, and matters less than advertised.",
"So negotiate with yourself in minutes, not moods. Open the book for five; almost always, the sixth follows voluntarily. As a result, the students who finish are rarely the inspired ones — they are the ones who start on schedule, uninspired."],
w:[{w:'ignition',k:'vocabulary · noun',d:'The act of starting an engine or fire. Strong metaphor for beginnings.',e:'Small grants provided the ignition for local start-ups.'},
{w:'voluntarily',k:'vocabulary · adverb',d:'By choice, without being forced. Precise adverb for behaviour and policy topics.',e:'Few citizens voluntarily reduce their energy use.'},
{w:'As a result',k:'linking · result',d:'Clean cause-and-effect connector — clearer than “so” in formal writing.',e:'Fares were cut; as a result, ridership rose by a third.'}]},

{t:'A Letter to the Tired Version of You',s:'For the day the flame gutters',
x:["Some morning soon you will wake with the flame down to a coal: the schedule will look absurd, London abstract, the whole enterprise vain. This letter is for that morning. Tiredness is a weather system, not a verdict; it distorts forecasts exactly when you are most inclined to trust them.",
"Do not renegotiate the dream at your weakest hour. Shrink the day instead: one block, done gently, keeps the chain alive and the identity intact. Above all, remember that resilience is not feeling strong — it is acting faithfully while feeling weak."],
w:[{w:'verdict',k:'vocabulary · noun',d:'A final judgement. Legal register lends authority — “the verdict of history/science”.',e:'The verdict of researchers is unanimous: sleep matters.'},
{w:'distorts',k:'vocabulary · verb',d:'To twist out of true shape. Essential verb for media, statistics and perception topics.',e:'Fear distorts the public assessment of risk.'},
{w:'Above all',k:'linking · emphasis',d:'Marks your single most important point — a spotlight, so use it once per essay.',e:'Above all, education must teach children how to learn.'}]},

{t:'The Examiner Is Not Your Enemy',s:'Writing for a tired reader in Manchester',
x:["Demystify the person who will grade you: a trained examiner, twenty scripts deep, grateful for anything easy to follow. They are not hunting for genius; they are matching your text against descriptors — task response, coherence, lexis, grammar. Clarity, to them, reads as competence because it is.",
"Write for that tired reader. Signpost ruthlessly, one idea per paragraph, examples that actually illustrate. Rather than decorating sentences with rare words, deploy precise ones. The kindest thing you can do for your band score is to be easy to reward."],
w:[{w:'Demystify',k:'vocabulary · verb',d:'To strip away false mystery. Excellent verb for education and technology essays.',e:'Schools should demystify how algorithms shape choices.'},
{w:'ruthlessly',k:'vocabulary · adverb',d:'Without mercy — often positive when applied to editing or prioritising.',e:'Successful writers cut adjectives ruthlessly.'},
{w:'Rather than',k:'linking · preference',d:'Sets up a rejected alternative — compact contrast that varies sentence openings.',e:'Rather than banning cars, cities should price road use.'}]},

{t:'Ritual Is Freedom Wearing a Uniform',s:'Why the same cup, the same chair, the same hour',
x:["From monasteries to laboratories, serious work has always leaned on ritual. Repetition automates the start, and automating the start abolishes the daily debate about whether to begin — the debate in which dreams usually lose. The same desk at the same hour is not rigidity; it is a corridor your feet know in the dark.",
"Your morning ritual is such a corridor. Guard its sequence jealously, for its power lies not in any single step but in the fact that the sequence decides, so you don't have to."],
w:[{w:'abolishes',k:'vocabulary · verb',d:'To end something officially and completely. Strong verb — collocates with “slavery”, “fees”, “barriers”.',e:'The reform abolishes tuition fees for nursing students.'},
{w:'rigidity',k:'vocabulary · noun',d:'Inflexibility. Useful abstract noun, often in criticism — here elegantly denied.',e:'The curriculum suffers from excessive rigidity.'},
{w:'jealously',k:'vocabulary · adverb',d:'With fierce protectiveness — “jealously guard” is a prized collocation.',e:'The committee jealously guards its independence.'}]},

{t:'One Thing at a Time Is a Superpower',s:'The myth of multitasking, retired',
x:["The brain does not multitask; it alternates, and each switch burns glucose and drops stitches. Studies at Stanford found chronic multitaskers performed worse at the very filtering skills they believed they had mastered. Doing two things at once means doing neither, slightly slower.",
"Single-tasking, by contrast, is a competitive advantage precisely because it has become countercultural. One tab. One passage. One timed section, undivided. Furthermore, the habit transfers: the mind you train on Tuesday is the mind that sits the exam."],
w:[{w:'alternates',k:'vocabulary · verb',d:'To switch back and forth between states. Precise process verb, useful in Task 1 descriptions.',e:'The chart shows demand alternates with the seasons.'},
{w:'countercultural',k:'vocabulary · adjective',d:'Going against mainstream habits. A sophisticated way to frame minority behaviours.',e:'Choosing to be unreachable has become countercultural.'},
{w:'Furthermore',k:'linking · addition',d:'Heavyweight addition connector for a third supporting point. Vary it with “moreover” and “similarly”.',e:'Furthermore, green spaces raise surrounding property values.'}]},

{t:'Money in the Word Bank',s:'Collocation, the secret currency',
x:["Examiners can hear the difference between a learned word and an owned one, and the difference is collocation: the company a word habitually keeps. You do not “do a decision” or “make your homework”; decisions are made, homework is done, and a band is heavily influenced by such marriages.",
"Collect collocations, not isolated words: “bitterly disappointed”, “widely regarded”, “pose a threat”. Whenever you meet a new noun, immediately ask which verbs and adjectives it prefers. A small vocabulary, correctly married, outperforms a large one living alone."],
w:[{w:'habitually',k:'vocabulary · adverb',d:'As a regular habit. Formal frequency adverb — subtler than “usually”.',e:'The report habitually understates rural poverty.'},
{w:'pose a threat',k:'collocation · verb+noun',d:'The natural verb for “threat” is pose — never “make a threat” in this sense. Signature band 7 collocation.',e:'Invasive species pose a threat to native wildlife.'},
{w:'widely regarded',k:'collocation · adv+verb',d:'“Widely regarded as” = considered by most people. Smooth passive structure for introductions.',e:'The scheme is widely regarded as a success.'}]},

{t:'The Fresh Start Hypothesis',s:'Mondays are load-bearing',
x:["Behavioural scientists call it the fresh start effect: people are measurably more likely to begin ambitious behaviour on temporal landmarks — Mondays, first days of months, birthdays. The calendar quietly offers amnesty from past failures, and the wise learner accepts it without shame.",
"Missed three days? The streak mourns; the journey does not. Declare a fresh start, today if it is Monday, this hour if it is not. What matters, in the final analysis, is not an unbroken record but an unabandoned direction."],
w:[{w:'amnesty',k:'vocabulary · noun',d:'Official forgiveness for past offences. Powerful metaphor outside legal contexts.',e:'The library declared an amnesty on overdue fines.'},
{w:'measurably',k:'vocabulary · adverb',d:'To a degree that can be measured. Adds empirical authority to claims.',e:'Air quality improved measurably after the ban.'},
{w:'in the final analysis',k:'linking · conclusion',d:'“When everything has been considered” — an elegant, slightly literary conclusion signal.',e:'In the final analysis, prevention beats punishment.'}]},

{t:'Nerves Are Just Excitement in a Suit',s:'Reframing the racing heart',
x:["Harvard research on anxiety reappraisal found that saying “I am excited” outperforms “calm down”, because excitement and anxiety share the same physiology — racing heart, alert senses — and the mind finds a short walk easier than a U-turn. The body is not betraying you before a test; it is arriving early, engines running.",
"On exam day, thank the adrenaline and give it a job: sharper reading, faster recall. For the record, examiners cannot hear your heartbeat — only your linking words."],
w:[{w:'reappraisal',k:'vocabulary · noun',d:'A fresh evaluation of something. Core psychology noun; “cognitive reappraisal” is the technical term.',e:'The crisis forced a reappraisal of energy policy.'},
{w:'physiology',k:'vocabulary · noun',d:'The way the body functions. Precise scientific noun for health topics.',e:'Stress alters the physiology of sleep.'},
{w:'betraying',k:'vocabulary · verb',d:'To be disloyal to; here, the body “betraying” you is controlled personification.',e:'His trembling hands betrayed his calm voice.'}]},

{t:'Discipline Is Remembering What You Want',s:'The quote on the library wall',
x:["David Campbell defined discipline as remembering what you want — not gritted teeth, but vivid memory. The reason you rise at six is not the alarm; it is a seminar room in Bloomsbury, a reading list with your name on it, an October afternoon crossing Waterloo Bridge as a student, not a tourist.",
"When the schedule chafes, do not summon willpower; summon the image. Desire, kept detailed and near, does quietly what force does loudly. That is to say, the most disciplined person in the room is usually just the one with the clearest picture."],
w:[{w:'chafes',k:'vocabulary · verb',d:'To rub until sore; figuratively, to irritate through constraint. Literary, precise, memorable.',e:'Talented staff chafe under micromanagement.'},
{w:'summon',k:'vocabulary · verb',d:'To call forth, formally or with effort. Collocates with “courage”, “strength”, “the will”.',e:'She summoned the courage to challenge the decision.'},
{w:'That is to say',k:'linking · reformulation',d:'Introduces a sharper restatement — shows you can fold an idea and present it again cleanly.',e:'The policy is means-tested; that is to say, help goes only to the poorest.'}]},

{t:'Close the Day Like a Craftsman',s:'The shutdown ritual',
x:["Cal Newport ends every workday with a shutdown ritual: loose ends written down, tomorrow sketched, and a closing phrase said aloud. The ceremony sounds eccentric; the neuroscience is sound. Open loops leak into the evening as background anxiety, and anxiety is a tax on tomorrow's focus.",
"Your evening essay is exactly this ceremony wearing academic dress. It empties the day's language onto a page, files the lessons, and grants the mind permission to rest. Write the paragraphs, close the notebook, and in due course, sleep like someone whose work is finished — because it is."],
w:[{w:'eccentric',k:'vocabulary · adjective',d:'Unconventional in a harmless, often charming way. A very British adjective.',e:'The professor’s eccentric methods produced loyal students.'},
{w:'leak',k:'vocabulary · verb',d:'To escape gradually through gaps — vivid for describing stress, money, information.',e:'Work worries leak into family evenings.'},
{w:'in due course',k:'linking · time',d:'“At the appropriate future moment” — formal, patient time phrase beloved of British officialdom.',e:'Results will be published in due course.'}]},

{t:'Luck Favours the Documented',s:'Keep the ledger of small wins',
x:["Teresa Amabile's research at Harvard found that the single strongest booster of motivation is not praise or bonuses but the visible evidence of progress — the “progress principle”. People who track small wins persist longer, feel better, and, crucially, notice opportunities that the untracked walk past.",
"This page is your ledger. Every checked block, every banked word, every essay is an entry the future reads as inevitability. Keep writing it. In retrospect, every arrival looks like luck; the ledger knows better."],
w:[{w:'crucially',k:'vocabulary · adverb',d:'In a decisively important way — spotlights the key element of an argument.',e:'Crucially, the vaccine requires no refrigeration.'},
{w:'inevitability',k:'vocabulary · noun',d:'The quality of being unavoidable. Weighty abstract noun for conclusions.',e:'The decline of cash has an air of inevitability.'},
{w:'In retrospect',k:'linking · hindsight',d:'“Looking back now” — frames past judgement with present wisdom.',e:'In retrospect, the warnings were plainly visible.'}]},

{t:'The Bridge Was Always Yours',s:'On arriving properly',
x:["One day reasonably soon, this streak of ordinary mornings will deposit you somewhere extraordinary: a lecture hall smelling of old paper and rain, a student card with your face on it, the Thames performing its slow grey ceremony below a bridge you no longer photograph because you cross it daily.",
"Nothing about that day will be sudden. It was assembled here, in editions like this one, three words at a time. Carry on, then — not toward the dream, but along it. In conclusion, as every good essay knows: the argument was won in the body paragraphs."],
w:[{w:'deposit',k:'vocabulary · verb',d:'To place somewhere for safekeeping — here, time “deposits” you like a river. Controlled metaphor.',e:'The scholarship deposited her in a world she had only read about.'},
{w:'assembled',k:'vocabulary · verb',d:'Built from parts. Process verb that dignifies gradual work.',e:'Public trust is assembled slowly and spent quickly.'},
{w:'In conclusion',k:'linking · conclusion',d:'The classic closing signal. Use it once, in the final paragraph, then deliver a weighed judgement.',e:'In conclusion, the benefits clearly outweigh the costs.'}]}
];

/* ---------- IELTS Writing Task 2 prompts (40) ---------- */
const PROMPTS=[
{c:'Education',q:'Some people believe that universities should focus on preparing students for employment, while others think their purpose is knowledge for its own sake. Discuss both views and give your opinion.'},
{c:'Education',q:'In many countries, children begin learning a foreign language at primary school. Do the advantages of this outweigh the disadvantages?'},
{c:'Technology',q:'Artificial intelligence is increasingly used to make decisions that were once made by humans. Is this a positive or negative development?'},
{c:'Technology',q:'Some argue that smartphones have damaged the quality of human conversation. To what extent do you agree or disagree?'},
{c:'Environment',q:'Individuals can do little to protect the environment; only governments and large companies can make a real difference. To what extent do you agree?'},
{c:'Environment',q:'Many cities are banning cars from their centres. What problems does this solve, and what new problems might it create?'},
{c:'Health',q:'Prevention is better than cure, so governments should spend more on promoting healthy lifestyles than on treatment. To what extent do you agree?'},
{c:'Health',q:'In some countries, the average working week is becoming longer. What are the causes of this, and what effects does it have on individuals and society?'},
{c:'Society',q:'Some people think that living in a big city offers a better quality of life than living in the countryside. Discuss both views and give your opinion.'},
{c:'Society',q:'In many places, the gap between the rich and the poor is widening. Why is this happening, and what measures could reduce it?'},
{c:'Work',q:'Remote working is becoming common in many industries. Do the benefits for employees outweigh the drawbacks for organisations?'},
{c:'Work',q:'Some believe job satisfaction is more important than a high salary. To what extent do you agree or disagree?'},
{c:'Culture',q:'Globalisation is making cultures around the world increasingly similar. Is this a positive or negative development?'},
{c:'Culture',q:'Some people think museums should be free for everyone, while others believe visitors should pay. Discuss both views and give your opinion.'},
{c:'Cities',q:'As urban populations grow, some governments build upwards with high-rise housing, while others expand cities outwards. Compare the advantages of each approach.'},
{c:'Media',q:'Social media platforms allow anyone to publish news. What problems does this create, and how could they be addressed?'},
{c:'Government',q:'Some argue that governments should fund the arts, while others say public money is better spent on essential services. Discuss both views and give your opinion.'},
{c:'Education',q:'Examinations are the best way to measure a student’s ability. To what extent do you agree or disagree?'},
{c:'Technology',q:'Children today spend more time on screens than playing outside. What are the causes of this trend, and what effects does it have?'},
{c:'Environment',q:'Air travel is a major source of emissions, yet flights have never been cheaper. Should governments tax flying more heavily? Give your opinion.'},
{c:'Health',q:'Fast food is increasingly popular despite its known health risks. Why is this the case, and what can be done about it?'},
{c:'Society',q:'In some countries, more people are choosing to live alone. What are the reasons for this, and is it a positive or negative development?'},
{c:'Work',q:'Many young people change jobs frequently rather than staying with one employer. What are the advantages and disadvantages of this?'},
{c:'Culture',q:'Learning about the past has little value for people living in the present. To what extent do you agree or disagree?'},
{c:'Cities',q:'Public transport should be free in large cities. Do the advantages of this policy outweigh the disadvantages?'},
{c:'Media',q:'Advertising aimed at children should be banned. To what extent do you agree or disagree?'},
{c:'Government',q:'Some believe voting should be compulsory for all citizens. Discuss the advantages and disadvantages of compulsory voting.'},
{c:'Education',q:'Studying abroad has become increasingly popular. What are the benefits and challenges for students who choose to do so?'},
{c:'Technology',q:'Cash is disappearing as digital payments become standard. Is a cashless society a positive or negative development?'},
{c:'Environment',q:'Some people believe economic growth must be sacrificed to protect the environment. Discuss both views and give your opinion.'},
{c:'Health',q:'Sport is often promoted as the solution to childhood obesity, but diet may matter more. Discuss both views and give your opinion.'},
{c:'Society',q:'Elderly people possess wisdom that modern societies undervalue. To what extent do you agree or disagree?'},
{c:'Work',q:'Automation will eliminate many jobs in the coming decades. What problems will this cause, and what solutions can you suggest?'},
{c:'Culture',q:'English dominates as the global language of business and science. What are the advantages and disadvantages of one language being so dominant?'},
{c:'Cities',q:'Historic buildings should be preserved even when the land could be used for modern development. To what extent do you agree?'},
{c:'Media',q:'Celebrities have more influence over young people than teachers or parents. Is this a positive or negative development?'},
{c:'Government',q:'Some argue that space exploration is a waste of public money that should be spent on Earth. To what extent do you agree or disagree?'},
{c:'Education',q:'Teachers can never be fully replaced by technology in the classroom. To what extent do you agree or disagree?'},
{c:'Society',q:'People today feel lonelier than previous generations despite being more connected. Why might this be, and what can be done?'},
{c:'Environment',q:'Plastic waste is one of the greatest environmental challenges. Why has it become such a problem, and how should it be tackled?'}
];

/* ---------- obstacles & if-then plans (implementation intentions) ---------- */
const OBSTACLES=[
{o:'phone',plan:'If I reach for my phone during a block, then I will stand up and put it in another room before sitting back down.'},
{o:'tiredness',plan:'If I feel too tired to study, then I will do just the first ten minutes — permission to stop granted only after.'},
{o:'boredom',plan:'If a task feels boring, then I will set a 25-minute timer and race it — the block ends when the timer does.'},
{o:'anxiety',plan:'If anxious thoughts interrupt, then I will write them on the parking page and return to the sentence I was on.'},
{o:'other',plan:'If my obstacle shows up, then I will name it out loud and continue for five more minutes before deciding anything.'}
];

const DEF_RITUAL=[
'Wake without touching the phone',
'Water, then coffee, in silence',
'Daylight and a brief stretch',
'Read the Morning Page aloud',
'Write today’s intention in English'
];

const FOOTLINES=[
'Mind the gap between who you are and who you are becoming.',
'Printed on paper made of mornings.',
'All roads lead to the reading room.',
'Weather in London: irrelevant. You study indoors.',
'This publication accepts no advertising, only effort.',
'Tomorrow’s edition is earned tonight.'
];

/* ---------- default weekly template ---------- */
function wdBase(){return[
 {id:'rit', start:'06:15',end:'06:45',name:'Morning Ritual',type:'routine'},
 {id:'b1',  start:'07:00',end:'08:00',name:'General English · Evolve unit',type:'study'},
 {id:'b2',  start:'08:15',end:'09:00',name:'IELTS Listening practice',type:'study'},
 {id:'b3',  start:'09:15',end:'10:00',name:'IELTS Reading practice',type:'study'},
 {id:'b4',  start:'10:30',end:'11:30',name:'Vocabulary lab · Anki + collocations',type:'study'},
 {id:'musc',start:'11:45',end:'13:15',name:'Strength training',type:'training'},
 {id:'b5',  start:'14:15',end:'15:15',name:'Speaking · shadowing + recording',type:'study'},
 {id:'b6',  start:'15:30',end:'16:45',name:'IELTS Writing · Mindset 3',type:'study'},
 {id:'card',start:'18:00',end:'19:00',name:'Hyrox / CrossFit conditioning',type:'training'},
 {id:'b7',  start:'20:45',end:'21:45',name:'Magoosh timed section',type:'study'},
 {id:'ess', start:'21:45',end:'22:15',name:'The Evening Essay + shutdown',type:'routine'}
];}
function defaultTemplate(){
  const t={};
  ['1','2','3','4','5'].forEach(d=>{t[d]=wdBase();});
  t['2']=t['2'].map(b=>b.id==='card'?{id:'tera',start:'17:00',end:'18:00',name:'Therapy',type:'routine'}:b);
  t['6']=[
   {id:'cin1',start:'08:30',end:'09:15',name:'English wildcard · podcast or series',type:'study'},
   {id:'tre', start:'09:30',end:'11:00',name:'Training',type:'training'},
   {id:'cin2',start:'14:30',end:'15:30',name:'English wildcard · speaking or review',type:'study'},
   {id:'ess', start:'20:00',end:'20:30',name:'The Evening Essay',type:'routine'}
  ];
  t['0']=[
   {id:'tre', start:'09:30',end:'11:00',name:'Training',type:'training'},
   {id:'org', start:'15:00',end:'16:00',name:'Weekly review · plan the week',type:'routine'},
   {id:'ess', start:'20:00',end:'20:30',name:'The Evening Essay',type:'routine'}
  ];
  return t;
}
