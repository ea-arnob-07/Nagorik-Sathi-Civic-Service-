from __future__ import annotations

import random
from pathlib import Path

import pandas as pd


SEED = 20261119
SAMPLES_PER_CATEGORY = 120

LOCATIONS = {
    "bn": ["মিরপুর ১০", "ধানমন্ডি ২৭", "উত্তরা সেক্টর ৭", "গুলশান ২", "মোহাম্মদপুর", "পাঁচলাইশ", "চান্দগাঁও", "মতিঝিল", "বনানী", "খিলগাঁও"],
    "en": ["Mirpur 10", "Dhanmondi 27", "Uttara Sector 7", "Gulshan 2", "Mohammadpur", "Panchlaish", "Chandgaon", "Motijheel", "Banani", "Khilgaon"],
    "bl": ["Mirpur 10", "Dhanmondi 27", "Uttara Sector 7", "Gulshan 2", "Mohammadpur", "Panchlaish", "Chandgaon", "Motijheel", "Banani", "Khilgaon"],
}
TIMES = {
    "bn": ["আজ সকাল থেকে", "গতকাল রাত থেকে", "গত তিন দিন ধরে", "এক সপ্তাহ ধরে", "বৃষ্টির পর থেকে", "প্রতিদিন", "গত কয়েক ঘণ্টা ধরে"],
    "en": ["since this morning", "since last night", "for the last three days", "for a week", "after the rainfall", "every day", "for several hours"],
    "bl": ["aj shokal theke", "goto rat theke", "last three days dhore", "ek shoptaho dhore", "bristir por theke", "protodin", "koyek ghonta dhore"],
}
SEVERITY_PREFIXES = {
    "bn": {
        "low": ["সামান্য সমস্যা: ", "ছোট একটি সমস্যা: ", "আংশিকভাবে সমস্যা হচ্ছে: "],
        "medium": ["বারবার সমস্যা হচ্ছে: ", "নিয়মিত সমস্যা: ", "এলাকাবাসী ভোগান্তিতে আছেন: "],
        "high": ["জরুরি সমস্যা: ", "বিপজ্জনক অবস্থা: ", "তাৎক্ষণিক ব্যবস্থা প্রয়োজন: "],
    },
    "en": {
        "low": ["Minor issue: ", "A small service issue: ", "Part of the service is affected: "],
        "medium": ["Recurring issue: ", "Residents are repeatedly affected: ", "Ongoing service disruption: "],
        "high": ["Urgent issue: ", "Dangerous situation: ", "Immediate action is required: "],
    },
    "bl": {
        "low": ["Choto ekta problem: ", "Minor issue: ", "Ektu shomossha hocche: "],
        "medium": ["Bar bar problem hocche: ", "Regular issue: ", "Elakar manush bhugchhen: "],
        "high": ["Joruri issue: ", "Dangerous obostha: ", "Immediate action dorkar: "],
    },
}

TEMPLATES = {
    "water": {
        "bn": [
            "{loc} এলাকায় ওয়াসার পানির মূল পাইপে লিকেজ হয়েছে, রাস্তার পাশে পানি বের হচ্ছে।",
            "{loc} এলাকার বাসাবাড়িতে পানির সরবরাহ বন্ধ, কল খুললেও পানি আসছে না।",
            "{loc} এলাকায় কলের পানিতে দুর্গন্ধ ও ময়লা দেখা যাচ্ছে, পানীয় পানি নিরাপদ নয়।",
            "{loc} এলাকায় পানির লাইনে চাপ খুব কম, বাসিন্দারা প্রয়োজনীয় পানি পাচ্ছেন না।",
            "{loc} এলাকায় পাইপলাইন ফেটে ফুটপাত ও রাস্তা ভিজে যাচ্ছে, ওয়াসার মেরামত দরকার।",
            "{loc} এলাকার পানির ট্যাংকে দূষিত পানি জমেছে, সরবরাহ পরীক্ষা করা প্রয়োজন।",
            "{loc} এলাকায় কয়েকটি বাড়িতে সুপেয় পানির সংকট দেখা দিয়েছে।",
            "{loc} এলাকার পানির সংযোগ থেকে অবিরাম পানি ঝরছে এবং অপচয় হচ্ছে।",
        ],
        "en": [
            "The WASA water main is leaking near {loc}, and clean water is flowing onto the sidewalk.",
            "Water supply has stopped in homes around {loc}; no water comes from the taps.",
            "Tap water around {loc} smells unpleasant and contains visible dirt, making it unsafe to drink.",
            "Water pressure is very low in {loc}, leaving residents without enough supply.",
            "A burst water pipeline is flooding the footpath near {loc} and needs repair.",
            "The water storage tank serving {loc} appears contaminated and needs inspection.",
            "Several homes in {loc} are facing a shortage of safe drinking water.",
            "A service connection near {loc} is continuously leaking and wasting water.",
        ],
        "bl": [
            "{loc} elakay WASA-r main pani pipe leak kore rastay pani porchhe.",
            "{loc} elakay bashay pani ashe na, tap khulleo supply pachhi na.",
            "{loc} er tap water-e gondho o moyla ache, drinking water safe na.",
            "{loc} elakay pani pressure onek kom, residents-ra pani pachhen na.",
            "{loc} er pipeline fete footpath vije jacche, WASA repair dorkar.",
            "{loc} er water tank-e dirty pani, supply check korte hobe.",
            "{loc} elakay safe drinking water shortage dekha diyeche.",
            "{loc} er pani connection theke nonstop leak hocche.",
        ],
    },
    "road_transport": {
        "bn": [
            "{loc} এলাকার প্রধান সড়কে বড় গর্ত তৈরি হয়েছে, যানবাহন চলাচল ঝুঁকিপূর্ণ।",
            "{loc} এলাকায় ফুটপাতের স্ল্যাব ভেঙে গেছে, পথচারীরা পড়ে যেতে পারেন।",
            "{loc} এলাকার ফুটওভারব্রিজের সিঁড়ি ও রেলিং ক্ষতিগ্রস্ত হয়েছে।",
            "{loc} এলাকায় অবৈধ পার্কিংয়ের কারণে রাস্তা সংকীর্ণ হয়ে তীব্র যানজট হচ্ছে।",
            "{loc} সংযোগ সড়কের পিচ উঠে গেছে এবং অনেক জায়গায় খানাখন্দ তৈরি হয়েছে।",
            "{loc} এলাকার মহাসড়কে ভাঙা অংশ ও অসমান পৃষ্ঠের কারণে দুর্ঘটনার ঝুঁকি আছে।",
            "{loc} এলাকায় ট্রাফিক সিগন্যাল কাজ করছে না, যানবাহন আটকে যাচ্ছে।",
            "{loc} এলাকার সড়ক সংস্কার ও ফুটপাত মেরামত জরুরি হয়ে পড়েছে।",
        ],
        "en": [
            "A large pothole has formed on the main road near {loc}, making traffic unsafe.",
            "A footpath slab is broken in {loc}, creating a fall risk for pedestrians.",
            "The pedestrian overpass stairs and handrails near {loc} are damaged.",
            "Illegal parking is narrowing the road around {loc} and causing severe congestion.",
            "The asphalt has peeled off on the access road near {loc}, leaving multiple potholes.",
            "A damaged highway surface near {loc} is increasing the risk of road accidents.",
            "The traffic signal near {loc} is not working and vehicles are getting stuck.",
            "Road resurfacing and sidewalk repairs are urgently needed in {loc}.",
        ],
        "bl": [
            "{loc} er main road-e boro pothole hoyeche, gari cholachol risky.",
            "{loc} elakay footpath-er slab venge geche, pedestrian pore jete pare.",
            "{loc} er foot overbridge-er stair o railing damaged.",
            "{loc} te illegal parking-er jonno road narrow hoye traffic jam hocche.",
            "{loc} er connecting road-er asphalt uthe geche, onek gorto ache.",
            "{loc} er highway damaged, accident-er risk bere geche.",
            "{loc} er traffic signal kaj korche na, gari atke jacche.",
            "{loc} elakay road repair o footpath maintenance dorkar.",
        ],
    },
    "waste": {
        "bn": [
            "{loc} এলাকার নির্ধারিত ডাস্টবিন উপচে ময়লা রাস্তায় ছড়িয়ে আছে।",
            "{loc} বাজারের সামনে কয়েক দিন ধরে পৌরসভার বর্জ্য সংগ্রহ করা হয়নি।",
            "{loc} এলাকায় খোলা জায়গায় অবৈধভাবে আবর্জনা ফেলা হচ্ছে।",
            "{loc} এলাকার রাস্তার পাশে পচা বর্জ্যের স্তূপ থেকে দুর্গন্ধ ছড়াচ্ছে।",
            "{loc} এর কমিউনিটি বিন ভরে গেছে, পরিচ্ছন্নতা কর্মীরা ময়লা সরাননি।",
            "{loc} এলাকায় রাস্তা ঝাড়ু দেওয়া হচ্ছে না এবং প্লাস্টিক জমে আছে।",
            "{loc} এলাকার খোলা ডাম্পিং পয়েন্টে গৃহস্থালি বর্জ্য জমে পরিবেশ নষ্ট হচ্ছে।",
            "{loc} এলাকায় নিয়মিত বর্জ্য অপসারণ ও ডাস্টবিন খালি করা প্রয়োজন।",
        ],
        "en": [
            "Municipal bins are overflowing near {loc}, with garbage scattered across the road.",
            "Waste collection has not happened for several days outside the market in {loc}.",
            "People are illegally dumping household rubbish in an open area near {loc}.",
            "A pile of rotting municipal waste beside the road in {loc} is causing a foul smell.",
            "The community waste container in {loc} is full and has not been emptied.",
            "Street sweeping is missing in {loc}, leaving plastic and litter on the pavement.",
            "Open dumping near {loc} is polluting the surrounding public space.",
            "Regular garbage collection and bin clearance are needed in {loc}.",
        ],
        "bl": [
            "{loc} er dustbin overflow kore garbage rastay choriye poreche.",
            "{loc} bazar-er shamne koyek din dhore waste collection hoyni.",
            "{loc} elakay open place-e illegal garbage dumping hocche.",
            "{loc} er rastar pashe rotten waste-er pile theke durgondho asche.",
            "{loc} er community bin full, cleaner-ra garbage remove koreni.",
            "{loc} elakay street sweeping hocche na, plastic jome ache.",
            "{loc} er open dumping point-e household waste jome poribesh noshto hocche.",
            "{loc} elakay regular garbage collection dorkar.",
        ],
    },
    "electricity": {
        "bn": [
            "{loc} এলাকায় বিদ্যুতের খুঁটি থেকে ঝুলন্ত তার নিচু হয়ে পথচারীদের ঝুঁকিতে ফেলছে।",
            "{loc} এলাকার সড়কবাতি কয়েক রাত ধরে জ্বলছে না, রাস্তা অন্ধকার।",
            "{loc} এলাকায় ট্রান্সফরমার থেকে স্পার্ক হচ্ছে এবং পোড়া গন্ধ বের হচ্ছে।",
            "{loc} এলাকায় বিদ্যুৎ সরবরাহ বন্ধ, দীর্ঘ সময় ধরে লোডশেডিং হচ্ছে।",
            "{loc} এলাকার বৈদ্যুতিক তার ছিঁড়ে রাস্তার ওপর পড়ে আছে।",
            "{loc} এলাকায় নষ্ট ল্যাম্পপোস্ট ও বাল্ব বদলানো প্রয়োজন।",
            "{loc} এলাকার ট্রান্সফরমারের কাছে খোলা তার ও বৈদ্যুতিক ঝুঁকি রয়েছে।",
            "{loc} এলাকায় ভোল্টেজ ওঠানামা করছে এবং বিদ্যুৎ সংযোগ অনিরাপদ।",
        ],
        "en": [
            "A low-hanging live electrical wire near {loc} is creating a serious pedestrian hazard.",
            "Streetlights have been out for several nights around {loc}, leaving the road dark.",
            "The transformer near {loc} is sparking and producing a burning smell.",
            "Power supply is interrupted in {loc}, with prolonged load shedding.",
            "A broken electric cable has fallen across the road near {loc}.",
            "Damaged lamp posts and streetlight bulbs need replacement in {loc}.",
            "Exposed wiring beside the transformer in {loc} poses an electrical risk.",
            "Voltage is fluctuating in {loc}, making the power connection unsafe.",
        ],
        "bl": [
            "{loc} elakay electric pole theke live wire jhule pedestrian risk hocche.",
            "{loc} er street light koyek rat dhore jole na, road ondhokar.",
            "{loc} er transformer theke spark hocche, pora gondho asche.",
            "{loc} elakay power supply bondho, load shedding cholche.",
            "{loc} er electric wire chire rastay pore ache.",
            "{loc} elakay damaged lamp post o bulb replace kora dorkar.",
            "{loc} er transformer-er pashe exposed wire dangerous.",
            "{loc} elakay voltage up-down korche, connection safe na.",
        ],
    },
    "healthcare": {
        "bn": [
            "{loc} এলাকার কমিউনিটি ক্লিনিকে অপরিচ্ছন্ন পরিবেশ ও চিকিৎসা বর্জ্য জমে আছে।",
            "{loc} এলাকার সরকারি হাসপাতালে টয়লেট ও ওয়ার্ডের স্বাস্থ্যবিধি মানা হচ্ছে না।",
            "{loc} এলাকায় জমে থাকা পানিতে মশার প্রজনন হচ্ছে, ডেঙ্গুর ঝুঁকি বাড়ছে।",
            "{loc} এলাকায় ডেঙ্গু নিয়ন্ত্রণে মশক নিধন ও ফগিং কার্যক্রম প্রয়োজন।",
            "{loc} এলাকার স্বাস্থ্যকেন্দ্রে প্রয়োজনীয় টিকা ও ওষুধের ঘাটতি রয়েছে।",
            "{loc} এলাকার ক্লিনিকে বর্জ্য ব্যবস্থাপনা ও জীবাণুনাশক পরিষ্কার দরকার।",
            "{loc} এলাকায় মশার উপদ্রব বেড়েছে, জনস্বাস্থ্য বিভাগকে ব্যবস্থা নিতে হবে।",
            "{loc} এলাকার হাসপাতালের জরুরি সেবা ও পরিচ্ছন্নতা পরীক্ষা করা প্রয়োজন।",
        ],
        "en": [
            "The community clinic in {loc} has poor hygiene and accumulated medical waste.",
            "Sanitation in the toilets and wards of the public hospital in {loc} is inadequate.",
            "Mosquitoes are breeding in stagnant water around {loc}, increasing dengue risk.",
            "Mosquito control and fogging are needed in {loc} to reduce dengue transmission.",
            "The health centre in {loc} is short of essential vaccines and medicines.",
            "The clinic in {loc} needs safe medical-waste handling and disinfection.",
            "Mosquito infestation has increased in {loc}, requiring public-health action.",
            "Emergency service conditions and hospital cleanliness in {loc} need inspection.",
        ],
        "bl": [
            "{loc} er community clinic-e hygiene kharap, medical waste jome ache.",
            "{loc} er public hospital-er toilet o ward porishkar na.",
            "{loc} elakay stagnant water-e mosquito breed hocche, dengue risk barche.",
            "{loc} elakay dengue control-er jonno mosquito fogging dorkar.",
            "{loc} er health centre-e vaccine o medicine shortage ache.",
            "{loc} er clinic-e medical waste handling o disinfection dorkar.",
            "{loc} elakay moshar upodrob bereche, public health action dorkar.",
            "{loc} er hospital-er emergency service o cleanliness inspect kora dorkar.",
        ],
    },
    "food": {
        "bn": [
            "{loc} এলাকার রেস্তোরাঁয় অস্বাস্থ্যকর পরিবেশে খাবার প্রস্তুত ও পরিবেশন করা হচ্ছে।",
            "{loc} বাজারে মেয়াদোত্তীর্ণ প্যাকেটজাত খাবার বিক্রি করা হচ্ছে।",
            "{loc} এলাকার খাবারে ভেজাল ও ক্ষতিকর রাসায়নিক ব্যবহারের অভিযোগ রয়েছে।",
            "{loc} এলাকার দোকানে পচা মাংস ও বাসি খাবার বিক্রি হচ্ছে।",
            "{loc} এলাকার খাদ্য প্রতিষ্ঠানে রান্নাঘর অপরিষ্কার এবং নিরাপদ সংরক্ষণ নেই।",
            "{loc} বাজারে ফল ও খাদ্যে ফরমালিন বা কৃত্রিম রং ব্যবহারের সন্দেহ রয়েছে।",
            "{loc} এলাকার হোটেলে খাবার ঢেকে রাখা হয় না এবং পোকামাকড় রয়েছে।",
            "{loc} এলাকার খাদ্য বিক্রেতারা মূল্যতালিকা ও ওজনের নিয়ম মানছেন না।",
        ],
        "en": [
            "Food is being prepared and served in unhygienic conditions at a restaurant in {loc}.",
            "Expired packaged food is being sold in the market near {loc}.",
            "A complaint reports food adulteration and harmful chemical use in {loc}.",
            "Spoiled meat and stale meals are being sold by shops in {loc}.",
            "The food premises in {loc} have an unclean kitchen and unsafe storage.",
            "There is suspected formalin or artificial colouring in food sold in {loc}.",
            "Food at a hotel in {loc} is left uncovered and exposed to insects.",
            "Food vendors in {loc} are not following price-display and accurate-weight rules.",
        ],
        "bl": [
            "{loc} er restaurant-e unhygienic environment-e food prepare o serve hocche.",
            "{loc} bazar-e expired packaged food sell kora hocche.",
            "{loc} er khabar-e adulteration o harmful chemical use-er complaint ache.",
            "{loc} er dokane rotten meat o stale food bikri hocche.",
            "{loc} er food shop-er kitchen dirty, safe storage nei.",
            "{loc} bazar-er food-e formalin ba artificial colour use-er shondeho.",
            "{loc} er hotel-e food cover kora hoy na, insects ache.",
            "{loc} er food vendor-ra price list o weight rules follow korche na.",
        ],
    },
    "drainage": {
        "bn": [
            "{loc} এলাকার প্রধান ড্রেনের মুখ প্লাস্টিক ও ময়লায় বন্ধ হয়ে পানি নামছে না।",
            "{loc} এলাকায় নর্দমা উপচে নোংরা পানি রাস্তায় ছড়িয়ে পড়ছে।",
            "{loc} এলাকার খোলা ম্যানহোলের ঢাকনা নেই, পথচারীদের দুর্ঘটনার ঝুঁকি।",
            "{loc} এলাকার ভাঙা ড্রেন স্ল্যাব দিয়ে নর্দমা দেখা যাচ্ছে এবং দুর্গন্ধ ছড়াচ্ছে।",
            "{loc} এলাকায় বৃষ্টির পানি নিষ্কাশন না হওয়ায় জলাবদ্ধতা তৈরি হয়েছে।",
            "{loc} এলাকার স্যুয়ারেজ লাইন বন্ধ হয়ে নোংরা পানি ফুটপাত দিয়ে বের হচ্ছে।",
            "{loc} এলাকার স্টর্মওয়াটার ড্রেন পলি জমে বন্ধ, পানি প্রবাহ থেমে গেছে।",
            "{loc} এলাকায় ম্যানহোল থেকে পয়ঃনিষ্কাশনের পানি উপচে পড়ছে।",
        ],
        "en": [
            "The main storm drain near {loc} is blocked by plastic and garbage, so water cannot flow.",
            "A sewer overflow near {loc} is spreading dirty wastewater onto the road.",
            "An uncovered manhole in {loc} has no safety lid and poses a serious fall hazard.",
            "A broken drain cover in {loc} exposes the open sewer and causes a foul smell.",
            "Rainwater is not draining in {loc}, causing severe street waterlogging.",
            "The sewer line near {loc} is blocked and wastewater is flowing over the footpath.",
            "Silt has blocked the stormwater drainage channel in {loc}, stopping runoff flow.",
            "Sewage is overflowing from a manhole near {loc} onto the public street.",
        ],
        "bl": [
            "{loc} er main drain plastic o garbage diye block, pani namche na.",
            "{loc} elakay sewer overflow hoye dirty water rastay choriye jacche.",
            "{loc} er open manhole-er cover nei, pedestrian fall hazard ache.",
            "{loc} er broken drain slab diye open sewer dekha jacche, durgondho hocche.",
            "{loc} elakay rainwater drain hocche na, waterlogging hoyeche.",
            "{loc} er sewer line block hoye wastewater footpath diye ber hocche.",
            "{loc} er stormwater drain-e silt jome water flow bondho.",
            "{loc} er manhole theke sewage overflow hocche.",
        ],
    },
}

def generate_dataset(output: Path) -> pd.DataFrame:
    rng = random.Random(SEED)
    rows = []
    for category, language_templates in TEMPLATES.items():
        for language in ("bn", "en", "bl"):
            templates = language_templates[language]
            for index in range(SAMPLES_PER_CATEGORY // 3):
                severity = ("low", "medium", "high")[index % 3]
                template_index = index % len(templates)
                template = templates[template_index]
                location = rng.choice(LOCATIONS[language])
                time_phrase = rng.choice(TIMES[language])
                prefix = rng.choice(SEVERITY_PREFIXES[language][severity])
                text = f"{prefix}{time_phrase}, {template.format(loc=location)}"
                rows.append({
                    "text": text,
                    "category": category,
                    "severity": severity,
                    "language": language,
                    "source": "synthetic_showcase",
                    "scenario_group": f"{category}:{language}:{template_index}",
                })
    rng.shuffle(rows)
    frame = pd.DataFrame(rows).drop_duplicates(subset=["text"]).reset_index(drop=True)
    output.parent.mkdir(parents=True, exist_ok=True)
    frame.to_csv(output, index=False, encoding="utf-8-sig")
    return frame


if __name__ == "__main__":
    destination = Path(__file__).resolve().parents[1] / "data" / "showcase_complaints.csv"
    data = generate_dataset(destination)
    print(f"Generated {len(data)} synthetic complaint samples across {data['category'].nunique()} categories.")
    print(data.groupby(["category", "severity"]).size().to_string())

# Refined module integration
