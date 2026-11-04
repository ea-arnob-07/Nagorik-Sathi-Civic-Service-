import re
import unicodedata
from typing import Dict, Any
from app.models.case import PriorityEnum


class AIEngineService:
    """Safety-first Bangla, Banglish and English civic complaint fallback classifier."""

    CATEGORY_KEYWORDS = {
        "water": [
            "ওয়াসা", "ওয়াসা", "পানির লাইন", "পানির পাইপ", "পানির সরবরাহ", "পানি সরবরাহ",
            "পানির চাপ", "পানির সংকট", "সুপেয় পানি", "সুেপয় পানি", "নলকূপ", "পাইপলাইন",
            "water supply", "water pressure", "water pipeline", "tap water", "wasa", "pani line",
            "pani ashe na", "pani pressure",
        ],
        "road_transport": [
            "রাস্তা", "সড়ক", "সড়ক", "গর্ত", "খানাখন্দ", "ফুটপাত", "ফুটওভারব্রিজ",
            "যানজট", "ট্রাফিক", "অবৈধ পার্কিং", "মহাসড়ক", "মহাসড়ক", "সিগন্যাল",
            "road", "pothole", "footpath", "footbridge", "traffic", "highway", "illegal parking",
            "rasta", "gorto",
        ],
        "waste": [
            "ময়লা", "ময়লা", "আবর্জনা", "বর্জ্য", "ডাস্টবিন", "ভাগাড়", "ভাগাড়",
            "বর্জ্য সংগ্রহ", "বর্জ্য অপসারণ", "খোলা ডাম্পিং", "পচা বর্জ্য", "পরিচ্ছন্নতা",
            "waste", "garbage", "trash", "dustbin", "dumping", "street sweeping", "moyla",
        ],
        "electricity": [
            "বিদ্যুৎ", "কারেন্ট", "সড়কবাতি", "সড়কবাতি", "বিদ্যুতের তার", "ঝুলন্ত তার",
            "ছেঁড়া তার", "ছেঁড়া তার", "ট্রান্সফরমার", "লোডশেডিং", "ল্যাম্পপোস্ট",
            "electricity", "power outage", "power supply", "transformer", "live wire",
            "hanging wire", "streetlight", "street light", "load shedding", "current nai",
        ],
        "healthcare": [
            "হাসপাতাল", "ক্লিনিক", "স্বাস্থ্যকেন্দ্র", "স্বাস্থ্য কেন্দ্র", "ডাক্তার", "ওষুধ",
            "টিকা", "মশা", "মশক", "ডেঙ্গু", "মেডিকেল বর্জ্য", "চিকিৎসা", "স্বাস্থ্যসেবা",
            "hospital", "clinic", "health centre", "health center", "doctor", "medicine",
            "vaccine", "mosquito", "dengue", "fogging", "medical waste",
        ],
        "food": [
            "খাবার", "খাদ্য", "রেস্তোরাঁ", "রেস্টুরেন্ট", "হোটেল", "ভেজাল", "মেয়াদোত্তীর্ণ",
            "মেয়াদোত্তীর্ণ", "ফরমালিন", "পচা মাংস", "অস্বাস্থ্যকর খাবার", "রাসায়নিক",
            "food", "restaurant", "hotel", "adulteration", "expired food", "formalin",
            "spoiled meat", "unhygienic food", "chemical",
        ],
        "drainage": [
            "ড্রেন", "ড্রেনেজ", "নর্দমা", "নালা", "জলাবদ্ধতা", "জলাবদ্ধ", "পানি জমে",
            "পানি নিষ্কাশন", "পয়ঃনিষ্কাশন", "পয়ঃনিষ্কাশন", "ম্যানহোল", "খোলা ম্যানহোল",
            "ড্রেন বন্ধ", "নর্দমা উপচে", "স্যুয়ারেজ", "সুয়ারেজ", "স্টর্মওয়াটার",
            "drain", "drainage", "blocked drain", "sewer", "sewage", "waterlogging",
            "stormwater", "open manhole", "manhole cover", "nala", "nordoma", "jolaboddhota",
        ],
    }

    HAZARD_KEYWORDS = [
        "খোলা ম্যানহোল", "ম্যানহোলের ঢাকনা নেই", "ঝুলন্ত তার", "ছেঁড়া তার", "ছেঁড়া তার",
        "বিদ্যুতের তার", "কারেন্ট", "স্পার্ক", "ট্রান্সফরমার থেকে আগুন", "ট্রান্সফরমারে আগুন",
        "রাস্তা ধসে", "মারাত্মক", "বিপজ্জনক", "বিপদজনক", "জীবননাশের ঝুঁকি", "আগুন",
        "শক", "বিষাক্ত রাসায়নিক", "বিষাক্ত রাসায়নিক", "অক্সিজেন সংকট", "ডেঙ্গু মহামারী",
        "পচা মাংস", "বিষাক্ত খাবার", "sewage overflow", "live wire", "electric shock",
        "transformer fire", "open manhole", "dangerous",
    ]

    @staticmethod
    def normalize_bangla_text(raw_text: str) -> str:
        if not raw_text:
            return ""
        text = unicodedata.normalize("NFC", raw_text.strip())
        text = re.sub(r"[\r\n\t]+", " ", text)
        return re.sub(r"\s{2,}", " ", text)

    @classmethod
    def analyze_intake_text(cls, text: str) -> Dict[str, Any]:
        normalized = cls.normalize_bangla_text(text)
        lower_text = normalized.lower()
        category_scores: Dict[str, float] = {}

        for category, keywords in cls.CATEGORY_KEYWORDS.items():
            matches = [keyword for keyword in keywords if keyword in lower_text]
            if matches:
                category_scores[category] = sum(1.0 + min(len(keyword) / 30, 0.6) for keyword in matches)

        ordered = sorted(category_scores.items(), key=lambda item: item[1], reverse=True)
        detected_categories = [category for category, _ in ordered]
        if ordered:
            primary_category = ordered[0][0]
            secondary_categories = [category for category, score in ordered[1:] if score >= 1.0]
            confidence = min(0.92, 0.62 + (0.06 * min(len(ordered), 3)) + (0.025 * min(ordered[0][1], 4)))
        else:
            primary_category = "waste"
            secondary_categories = []
            confidence = 0.42

        hazard_reasons = [
            f"বিপজ্জনক সংকেত শনাক্ত: '{keyword}'"
            for keyword in cls.HAZARD_KEYWORDS
            if keyword in lower_text
        ]
        hazard_found = bool(hazard_reasons)

        if hazard_found:
            proposed_priority = PriorityEnum.HIGH
        elif len(detected_categories) >= 2 or any(term in lower_text for term in ("জরুরি", "উপচে", "দুর্ঘটনা", "severe", "urgent")):
            proposed_priority = PriorityEnum.HIGH
        elif any(term in lower_text for term in ("সামান্য", "minor", "ছোট সমস্যা")):
            proposed_priority = PriorityEnum.LOW
        else:
            proposed_priority = PriorityEnum.MEDIUM

        entities: Dict[str, Any] = {}
        location_match = re.search(r"(?:এলাকা|এলাকায়|এলাকায়|অঞ্চল|near|around)\s+([^,।.]+)", lower_text)
        if location_match:
            entities["location_clue"] = location_match.group(1).strip()
        if any(term in lower_text for term in ("কয়েক দিন", "কয়েক দিন", "৩ দিন", "এক সপ্তাহ", "গতকাল", "গত তিন দিন", "for a week", "three days")):
            entities["duration"] = "দীর্ঘস্থায়ী সমস্যা"

        return {
            "normalized_text": normalized,
            "primary_category": primary_category,
            "secondary_categories": secondary_categories,
            "detected_categories": detected_categories,
            "proposed_priority": proposed_priority,
            "is_hazard": hazard_found,
            "hazard_reasons": hazard_reasons,
            "extracted_entities": entities,
            "confidence_score": confidence,
        }

    @staticmethod
    def transcribe_mock_voice(audio_url: str) -> str:
        return "আমাদের গলির সামনে অনেক ময়লা জমে ড্রেন বন্ধ হয়ে গেছে। পানি জমে রাস্তা নষ্ট হচ্ছে।"

# Refined module integration
