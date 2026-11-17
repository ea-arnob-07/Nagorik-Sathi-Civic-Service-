import {
  Case,
  HotspotZone,
  VerifiedServiceKnowledge,
  AuditLogEntry,
  AppNotification,
  AiGateConfiguration,
  ResponsibilityRule,
  DuplicateCandidate
} from '../types';

export const INITIAL_CASES: Case[] = [
  {
    id: 'NS-2026-000184',
    trackingNumber: 'NS-2026-000184',
    citizenId: 'cit_01',
    citizenName: 'আব্দুল্লাহ আল মামুন (গোপনীয়)',
    citizenPhone: '01712-345678',
    title: 'রাস্তার ড্রেন বর্জ্য জমে বন্ধ ও তীব্র জলাবদ্ধতা',
    description: 'রাস্তার পাশের প্রধান ভূগর্ভস্থ ড্রেনটি কয়েকদিন ধরে পলিথিন ও কঠিন বর্জ্য জমে পুরোপুরি বন্ধ। হালকা বৃষ্টিতেই রাস্তায় নোংরা পানি জমে যাচ্ছে এবং যানবাহন ও পথচারী চলাচলে চরম ভোগান্তি হচ্ছে।',
    audioRecordingUrl: 'mock_audio_sample.mp3',
    location: {
      lat: 23.8682,
      lng: 90.3985,
      address: 'রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা',
      wardId: 12,
      wardName: 'ওয়ার্ড ১২',
      landmark: 'উত্তরা আধুনিক মেডিকেল কলেজ সংলগ্ন রোড'
    },
    category: 'drainage',
    priority: 'high',
    status: 'in_progress',
    submittedAt: '2026-10-06T09:30:00+06:00',
    updatedAt: '2026-10-08T11:15:00+06:00',
    estimatedResolutionDays: 3,
    initialEvidence: [
      {
        id: 'ev_01',
        type: 'photo',
        url: '/images/incidents/incident_drainage.webp',
        caption: 'নাগরিকের প্রাথমিক ছবি: ড্রেনের মুখে বর্জ্য ও রাস্তায় পানি',
        uploadedAt: '2026-10-06T09:30:00+06:00',
        uploaderRole: 'citizen',
        isPrivacyMasked: true,
        fileSizeBytes: 2450000
      }
    ],
    aiAnalysis: {
      category: 'drainage',
      categoryLabel: 'ড্রেনেজ ও পয়ঃনিষ্কাশন',
      problemSummary: 'কঠিন বর্জ্যের কারণে ড্রেনের পানি নিষ্কাশন ব্যাহত ও রাস্তায় জলাবদ্ধতা সৃষ্টি',
      confidenceScore: 86,
      proposedPriority: 'high',
      priorityReason: 'রাস্তার প্রধান ড্রেন বন্ধ + যানবাহন ও পথচারী চলাচলে সরাসরি বিঘ্ন + ডেঙ্গু লার্ভা সৃষ্টির ঝুঁকি',
      proposedDepartmentId: 'dept_drainage',
      proposedDepartmentName: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ',
      ruleReference: 'R-12: Drain Segment Asset Owner (DS-104)',
      assetId: 'DS-104',
      assetName: 'উত্তরা সেক্টর ৭ প্রধান ড্রেন সেগমেন্ট ১০৪',
      requiresHumanVerification: false,
      signals: [
        'ছবিতে ড্রেনের মুখে ভাসমান কঠিন পলিথিন বর্জ্য শনাক্ত (92% confidence)',
        'রাস্তার পৃষ্ঠে ১ ফুট উচ্চতায় নোংরা পানির বিস্তার (88% confidence)',
        'অবস্থান ওয়ার্ড ১২ এর ড্রেনেজ মাস্টারপ্ল্যান ম্যাপের সাথে মিলে গেছে (99% match)'
      ]
    },
    humanVerification: {
      verifiedBy: 'কামরুল হাসান (ওয়ার্ড ১২ ডেস্ক অফিসার)',
      verifiedAt: '2026-10-06T10:15:00+06:00',
      isOverridden: false,
      confirmedDepartmentId: 'dept_drainage',
      confirmedDepartmentName: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ'
    },
    tasks: [
      {
        id: 'tsk_01',
        caseId: 'NS-2026-000184',
        sequenceOrder: 1,
        departmentId: 'dept_waste',
        departmentName: 'বর্জ্য ব্যবস্থাপনা বিভাগ',
        title: 'ড্রেনের মুখের উপরিভাগের কঠিন বর্জ্য ও আবর্জনা অপসারণ',
        description: 'ড্রেনের ক্যাচপিট ও স্লাব উন্মুক্ত করে উপরিভাগের সমস্ত প্লাস্টিক, মাটি ও কঠিন বর্জ্য অপসারণ করতে হবে।',
        status: 'resolved',
        assignedOfficerId: 'off_waste_01',
        assignedOfficerName: 'মোঃ শফিকুল ইসলাম (পরিদর্শক)',
        assignedOfficerPhone: '01819-112233',
        slaTargetHours: 24,
        slaDeadline: '2026-10-07T10:15:00+06:00',
        isOverdue: false,
        startedAt: '2026-10-06T11:00:00+06:00',
        resolvedAt: '2026-10-06T16:30:00+06:00',
        resolutionEvidence: [
          {
            id: 'ev_res_01',
            type: 'photo',
            url: '/images/incidents/incident_waste.webp',
            caption: 'বর্জ্য ব্যবস্থাপনা দলের কাজ সম্পন্ন: সমস্ত বর্জ্য বস্তাবন্দী করে অপসারিত',
            uploadedAt: '2026-10-06T16:30:00+06:00',
            uploaderRole: 'field_officer',
            isPrivacyMasked: true
          }
        ],
        resolutionNotes: 'ড্রেনের উপরিভাগের প্রায় ২ টন কঠিন আবর্জনা অপসারণ করে ল্যান্ডফিলে পাঠানো হয়েছে।'
      },
      {
        id: 'tsk_02',
        caseId: 'NS-2026-000184',
        sequenceOrder: 2,
        departmentId: 'dept_drainage',
        departmentName: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ',
        title: 'ভূগর্ভস্থ ড্রেন সেগমেন্ট DS-104 সাকশন ও পলি ডেসিল্টিং',
        description: 'হাইড্রোলিক জেট মেশিন দিয়ে ড্রেনের পাইপলাইনের জমাট পলি ও কাদামাটি নিষ্কাশন করা।',
        status: 'in_progress',
        assignedOfficerId: 'off_drain_01',
        assignedOfficerName: 'প্রকৌশলী তানভীর আহমেদ (সহকারী প্রকৌশলী)',
        assignedOfficerPhone: '01713-998877',
        prerequisiteTaskId: 'tsk_01',
        prerequisiteDeptName: 'বর্জ্য ব্যবস্থাপনা বিভাগ',
        slaTargetHours: 48,
        slaDeadline: '2026-10-08T18:00:00+06:00',
        isOverdue: false,
        startedAt: '2026-10-07T09:00:00+06:00',
        resolutionNotes: 'জেটিং ও ফ্লাশিং কাজ চলছে, আজ বিকালের মধ্যে পানি সম্পূর্ণ নেমে যাবে।'
      },
      {
        id: 'tsk_03',
        caseId: 'NS-2026-000184',
        sequenceOrder: 3,
        departmentId: 'dept_road',
        departmentName: 'সড়ক ও অবকাঠামো প্রকৌশল বিভাগ',
        title: 'জলাবদ্ধতায় ক্ষতিগ্রস্ত রাস্তার কার্পেটিং ও পিচ সংস্কার',
        description: 'পানি নিষ্কাশনের পর ক্ষতিগ্রস্ত অ্যাসফল্ট রাস্তা প্যাচওয়ার্ক মেরামত।',
        status: 'pending_dependency',
        assignedOfficerId: 'off_road_01',
        assignedOfficerName: 'প্রকৌশলী সাজ্জাদ হোসেন (উপ-বিভাগীয় প্রকৌশলী)',
        assignedOfficerPhone: '01911-445566',
        prerequisiteTaskId: 'tsk_02',
        prerequisiteDeptName: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ',
        waitingReason: 'ড্রেনেজ বিভাগের কাজ ও রাস্তা শুকানোর অপেক্ষায়',
        slaTargetHours: 72,
        slaDeadline: '2026-10-10T12:00:00+06:00',
        isOverdue: false
      }
    ],
    timeline: [
      {
        id: 'tl_01',
        caseId: 'NS-2026-000184',
        timestamp: '2026-10-06T09:30:00+06:00',
        actorName: 'নাগরিক অ্যাপ (অটোমেটেড)',
        actorRole: 'citizen',
        actionTitle: 'রিপোর্ট জমা ও অবস্থান নিশ্চিতকরণ',
        actionDescription: 'নাগরিক ভয়েস নোট ও ড্রেনের ছবিসহ ওয়ার্ড ১২ এর রোড ৪ এ রিপোর্ট নিবন্ধন করেছেন।',
        stage: 'submitted',
        badgeType: 'info'
      },
      {
        id: 'tl_02',
        caseId: 'NS-2026-000184',
        timestamp: '2026-10-06T09:31:00+06:00',
        actorName: 'AI Triage Engine (M4)',
        actorRole: 'ward_desk',
        actionTitle: 'এআই বিশ্লেষণ ও প্রস্তাবনা',
        actionDescription: 'AI ড্রেনেজ বিভাগ ও উচ্চ অগ্রাধিকার প্রস্তাব করেছে (কনফিডেন্স ৮৬%, রুল R-12)।',
        stage: 'submitted',
        badgeType: 'info'
      },
      {
        id: 'tl_03',
        caseId: 'NS-2026-000184',
        timestamp: '2026-10-06T10:15:00+06:00',
        actorName: 'কামরুল হাসান',
        actorRole: 'ward_desk',
        actionTitle: 'ওয়ার্ড ডেস্ক কর্তৃক দায়িত্ব নিশ্চিত',
        actionDescription: 'ওয়ার্ড ডেস্ক অফিসার এআই প্রস্তাব যাচাই করে দায়িত্বপ্রাপ্ত বিভাগ নির্ধারণ করেছেন।',
        stage: 'verified',
        badgeType: 'success'
      },
      {
        id: 'tl_04',
        caseId: 'NS-2026-000184',
        timestamp: '2026-10-06T10:45:00+06:00',
        actorName: 'মাহমুদুল হক (সমন্বয়ক)',
        actorRole: 'coordinator',
        actionTitle: '৩-ধাপের বহু-বিভাগীয় পরিকল্পনা অনুমোদিত',
        actionDescription: 'বর্জ্য অপসারণ ➔ ড্রেন ডেসিল্টিং ➔ সড়ক সংস্কার ক্রমানুসারে কাজের ওয়ার্ক-অর্ডার দেওয়া হয়েছে।',
        stage: 'under_inspection',
        badgeType: 'warning'
      },
      {
        id: 'tl_05',
        caseId: 'NS-2026-000184',
        timestamp: '2026-10-06T16:30:00+06:00',
        actorName: 'মোঃ শফিকুল ইসলাম (বর্জ্য ব্যবস্থাপনা)',
        actorRole: 'field_officer',
        actionTitle: 'ধাপ ১ সম্পন্ন (বর্জ্য অপসারণ)',
        actionDescription: 'ড্রেনের মুখের সমস্ত কঠিন বর্জ্য পরিষ্কার করে ছবি প্রমাণ আপলোড করা হয়েছে।',
        stage: 'in_progress',
        badgeType: 'success'
      }
    ]
  },
  {
    id: 'NS-2026-000192',
    trackingNumber: 'NS-2026-000192',
    citizenId: 'cit_02',
    citizenName: 'নুসরাত জাহান',
    citizenPhone: '01811-223344',
    title: 'প্রধান সড়কে বিপজ্জনক গর্ত ও পিচ উঠে যাওয়া',
    description: 'মিরপুর ১০ গোলচত্বরের পূর্ব পাশে বড় গর্ত তৈরি হয়েছে। রাতে বাইক ও রিকশা উল্টে যাওয়ার ঝুঁকি তৈরি হচ্ছে।',
    location: {
      lat: 23.8069,
      lng: 90.3687,
      address: 'মিরপুর ১০ গোলচত্বর সংলগ্ন প্রধান সড়ক',
      wardId: 13,
      wardName: 'ওয়ার্ড ১৩',
      landmark: 'ফায়ার সার্ভিস স্টেশনের বিপরীত পাশে'
    },
    category: 'road_engineering',
    priority: 'emergency',
    status: 'under_inspection',
    submittedAt: '2026-10-07T14:20:00+06:00',
    updatedAt: '2026-10-08T08:30:00+06:00',
    estimatedResolutionDays: 2,
    initialEvidence: [
      {
        id: 'ev_02',
        type: 'photo',
        url: '/images/incidents/incident_road.webp',
        caption: 'রাস্তার মাঝে ২ ফুট গভীর গর্ত',
        uploadedAt: '2026-10-07T14:20:00+06:00',
        uploaderRole: 'citizen',
        isPrivacyMasked: true
      }
    ],
    aiAnalysis: {
      category: 'road_engineering',
      categoryLabel: 'সড়ক ও অবকাঠামো',
      problemSummary: 'প্রধান সড়কের উপরিভাগে মারাত্মক খানাখন্দ ও দুর্ঘটনা ঝুঁকি',
      confidenceScore: 94,
      proposedPriority: 'emergency',
      priorityReason: 'প্রধান ট্রাফিক মোড়ে গভীর গর্ত + প্রাণনাশের তাৎক্ষণিক ঝুঁকি',
      proposedDepartmentId: 'dept_road',
      proposedDepartmentName: 'সড়ক ও অবকাঠামো প্রকৌশল বিভাগ',
      ruleReference: 'R-04: Primary Roadway Maintenance Grid',
      assetId: 'RD-MIR-10',
      requiresHumanVerification: false,
      signals: ['অ্যাসফল্ট ক্ষয় ও গর্ত শনাক্ত (95%)', 'উচ্চ ট্রাফিক জংশন জিওফেন্স (100%)']
    },
    tasks: [
      {
        id: 'tsk_10',
        caseId: 'NS-2026-000192',
        sequenceOrder: 1,
        departmentId: 'dept_road',
        departmentName: 'সড়ক ও অবকাঠামো প্রকৌশল বিভাগ',
        title: 'জরুরি কোল্ড-মিক্স প্যাচওয়ার্ক ও সতর্কীকরণ ব্যারিকেড',
        description: 'তাৎক্ষণিক দুর্ঘটনা রোধে ব্যারিকেড স্থাপন এবং ইমার্জেন্সি বিটুমিনাস প্যাচিং।',
        status: 'in_inspection',
        assignedOfficerId: 'off_road_02',
        assignedOfficerName: 'প্রকৌশলী ফারহান করিম',
        slaTargetHours: 12,
        slaDeadline: '2026-10-08T16:00:00+06:00',
        isOverdue: false
      }
    ],
    timeline: [
      {
        id: 'tl_11',
        caseId: 'NS-2026-000192',
        timestamp: '2026-10-07T14:20:00+06:00',
        actorName: 'নাগরিক অ্যাপ',
        actorRole: 'citizen',
        actionTitle: 'জরুরি সড়ক রিপোর্ট জমা',
        actionDescription: 'নাগরিক মিরপুর ১০ এর মারাত্মক গর্তের ছবিসহ রিপোর্ট দিয়েছেন।',
        stage: 'submitted',
        badgeType: 'danger'
      }
    ]
  },
  {
    id: 'NS-2026-000170',
    trackingNumber: 'NS-2026-000170',
    citizenId: 'cit_01',
    citizenName: 'আব্দুল্লাহ আল মামুন',
    citizenPhone: '01712-345678',
    title: 'ল্যাম্পপোস্টের এলইডি লাইট টানা ৩ দিন বন্ধ',
    description: 'রোড ৬ এর তিন নম্বর ল্যাম্পপোস্টটির বাতি নষ্ট থাকায় পুরো গলি অন্ধকার হয়ে থাকে। ছিনতাইয়ের আশঙ্কা তৈরি হয়েছে।',
    location: {
      lat: 23.8710,
      lng: 90.3950,
      address: 'রোড ৬, সেক্টর ৯, উত্তরা, ঢাকা',
      wardId: 12,
      wardName: 'ওয়ার্ড ১২',
      landmark: 'মসজিদের পাশে ল্যাম্পপোস্ট নম্বর LP-09-32'
    },
    category: 'lighting',
    priority: 'medium',
    status: 'resolved_pending_citizen',
    submittedAt: '2026-10-04T18:00:00+06:00',
    updatedAt: '2026-10-07T20:00:00+06:00',
    estimatedResolutionDays: 2,
    initialEvidence: [
      {
        id: 'ev_03',
        type: 'photo',
        url: '/images/incidents/incident_electricity.svg',
        caption: 'রাতে নিভে থাকা অন্ধকার ল্যাম্পপোস্ট',
        uploadedAt: '2026-10-04T18:00:00+06:00',
        uploaderRole: 'citizen',
        isPrivacyMasked: true
      }
    ],
    aiAnalysis: {
      category: 'lighting',
      categoryLabel: 'সড়ক বাতি ও বিদ্যুৎ',
      problemSummary: 'গলির সড়ক বাতি অকার্যকর ও অন্ধকার',
      confidenceScore: 91,
      proposedPriority: 'medium',
      priorityReason: 'রাতের নিরাপত্তা বিঘ্নিত হলেও তাৎক্ষণিক বড় দুর্ঘটনা ঝুঁকি নেই',
      proposedDepartmentId: 'dept_lighting',
      proposedDepartmentName: 'বিদ্যুৎ ও সড়ক বাতি বিভাগ',
      ruleReference: 'R-08: Street Lighting Asset LP Grid',
      assetId: 'LP-09-32',
      requiresHumanVerification: false,
      signals: ['ল্যাম্পপোস্ট আইডি শনাক্ত (LP-09-32)', 'বিদ্যুৎ সংযোগ ফল্ট কোড']
    },
    tasks: [
      {
        id: 'tsk_20',
        caseId: 'NS-2026-000170',
        sequenceOrder: 1,
        departmentId: 'dept_lighting',
        departmentName: 'বিদ্যুৎ ও সড়ক বাতি বিভাগ',
        title: '৯০ ওয়াট এলইডি ড্রাইভার ও বাল্ব প্রতিস্থাপন',
        description: 'নষ্ট এলইডি মডিউল পরিবর্তন ও টাইমার সুইচের সংযোগ মেরামত করা।',
        status: 'resolved',
        assignedOfficerId: 'off_light_01',
        assignedOfficerName: 'মোঃ মোশাররফ হোসেন (লাইন টেকনিশিয়ান)',
        assignedOfficerPhone: '01678-554433',
        slaTargetHours: 48,
        slaDeadline: '2026-10-06T18:00:00+06:00',
        resolvedAt: '2026-10-07T19:45:00+06:00',
        resolutionEvidence: [
          {
            id: 'ev_res_02',
            type: 'photo',
            url: '/images/incidents/incident_electricity.svg',
            caption: 'সমাধানের প্রমাণ: নতুন এলইডি বাতি জ্বলছে ও গলি আলোকিত',
            uploadedAt: '2026-10-07T19:45:00+06:00',
            uploaderRole: 'field_officer',
            isPrivacyMasked: true
          }
        ],
        resolutionNotes: 'নতুন ৯০W Philips LED ড্রাইভার লাগানো হয়েছে। লাইট স্বাভাবিকভাবে জ্বলছে।'
      }
    ],
    timeline: [
      {
        id: 'tl_21',
        caseId: 'NS-2026-000170',
        timestamp: '2026-10-04T18:00:00+06:00',
        actorName: 'নাগরিক',
        actorRole: 'citizen',
        actionTitle: 'রিপোর্ট জমা',
        actionDescription: 'নাগরিক সড়ক বাতি বন্ধের রিপোর্ট দিয়েছেন।',
        stage: 'submitted'
      },
      {
        id: 'tl_22',
        caseId: 'NS-2026-000170',
        timestamp: '2026-10-07T19:45:00+06:00',
        actorName: 'মোঃ মোশাররফ হোসেন',
        actorRole: 'field_officer',
        actionTitle: 'সমাধানের প্রমাণ আপলোড সম্পন্ন',
        actionDescription: 'ফিল্ড টেকনিশিয়ান নতুন লাইট জ্বালিয়ে ছবি প্রমাণ জমা দিয়েছেন। নাগরিকের সন্তুষ্টি যাচাই প্রয়োজন।',
        stage: 'resolved_pending_citizen',
        badgeType: 'success'
      }
    ]
  },
  {
    id: 'NS-2026-W04-0412',
    trackingNumber: 'NS-2026-W04-0412',
    citizenId: 'cit_02',
    citizenName: 'তানজিলা হক (নাগরিক)',
    citizenPhone: '01819-223344',
    title: 'ওয়াসা মেইন পাইপলাইন লিকেজ ও রাস্তা প্লাবিত',
    description: 'মিরপুর ১০ গোলচত্বর সংলগ্ন প্রধান পানির পাইপ ফেটে অবিরাম খাবার পানি রাস্তায় ছড়িয়ে পড়ছে এবং সড়ক ধসের ঝুঁকি তৈরি হয়েছে।',
    location: {
      lat: 23.8055,
      lng: 90.3695,
      address: 'মিরপুর ১০ গোলচত্বর উত্তর পার্শ্ব, ঢাকা',
      wardId: 4,
      wardName: 'ওয়ার্ড ৪',
      landmark: 'মেট্রোরেল স্টেশন পিলার নম্বর ৭২ এর কাছে'
    },
    category: 'water',
    priority: 'emergency',
    status: 'in_progress',
    submittedAt: '2026-10-08T08:15:00+06:00',
    updatedAt: '2026-10-08T10:00:00+06:00',
    estimatedResolutionDays: 1,
    initialEvidence: [
      {
        id: 'ev_04',
        type: 'photo',
        url: '/images/incidents/incident_water.svg',
        caption: 'ওয়াসা পাইপ ফেটে রাস্তায় তীব্র পানির স্রোত',
        uploadedAt: '2026-10-08T08:15:00+06:00',
        uploaderRole: 'citizen'
      }
    ],
    aiAnalysis: {
      category: 'water',
      categoryLabel: 'পানি সরবরাহ ও পাইপলাইন',
      problemSummary: 'ওয়াসা মেইন লাইনে উচ্চ চাপে লিকেজ ও সুপেয় পানির অপচয়',
      confidenceScore: 94,
      proposedPriority: 'emergency',
      priorityReason: 'সুপেয় পানির মারাত্মক অপচয় + প্রধান সড়ক ধসের ঝুঁকি',
      proposedDepartmentId: 'dept_water',
      proposedDepartmentName: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন বিভাগ (ওয়াসা)',
      ruleReference: 'R-WATER-01: WASA Main Transmission Grid',
      assetId: 'WASA-PIPE-M10',
      requiresHumanVerification: false,
      signals: ['ওয়াসা পাইপলাইন কোড (WASA-PIPE-M10)', 'উচ্চ চাপ লিকেজ সিগন্যাল']
    },
    tasks: [
      {
        id: 'tsk_water_01',
        caseId: 'NS-2026-W04-0412',
        sequenceOrder: 1,
        departmentId: 'dept_water',
        departmentName: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন বিভাগ (ওয়াসা)',
        title: 'ওয়াসা ভালভ আইসোলেশন ও পাইপলাইন ওয়েল্ডিং সংস্কার',
        description: 'মেনুয়াল ভালভ সাময়িক বন্ধ করে ক্ষতিগ্রস্ত ১২ ইঞ্চি পাইপ ক্ল্যাম্পিং ও পরিবর্তন।',
        status: 'in_progress',
        assignedOfficerId: 'off_water_01',
        assignedOfficerName: 'প্রকৌশলী শামসুল হুদা (সহকারী প্রকৌশলী - ওয়াসা)',
        assignedOfficerPhone: '০৩১-৬২০৫৫৭',
        slaTargetHours: 12,
        slaDeadline: '2026-10-08T20:15:00+06:00'
      }
    ],
    timeline: [
      {
        id: 'tl_w1',
        caseId: 'NS-2026-W04-0412',
        timestamp: '2026-10-08T08:15:00+06:00',
        actorName: 'নাগরিক',
        actorRole: 'citizen',
        actionTitle: 'জরুরি ওয়াসা রিপোর্ট দাখিল',
        actionDescription: 'নাগরিক পাইপ ফেটে তীব্র পানি ছড়িয়ে পড়ার রিপোর্ট দিয়েছেন।',
        stage: 'submitted'
      }
    ]
  },
  {
    id: 'NS-2026-W06-0819',
    trackingNumber: 'NS-2026-W06-0819',
    citizenId: 'cit_03',
    citizenName: 'মোহাম্মদ রফিক উল্লাহ',
    citizenPhone: '01715-998877',
    title: 'কমিউনিটি ক্লিনিক প্রাঙ্গণে ডেঙ্গু লার্ভা ও আবর্জনা সংকট',
    description: 'মোহাম্মদপুর সূচনা কমিউনিটি ক্লিনিকের পেছনে ভাঙা পাত্র ও ড্রেনে মশার লার্ভা বংশবৃদ্ধি করছে। সেবাগ্রহীতারা ডেঙ্গু ঝুঁকিতে রয়েছেন।',
    location: {
      lat: 23.7660,
      lng: 90.3580,
      address: 'কাটাসুর রোড, মোহাম্মদপুর, ঢাকা',
      wardId: 6,
      wardName: 'ওয়ার্ড ৬',
      landmark: 'সূচনা কমিউনিটি স্বাস্থ্য ক্লিনিক সংলগ্ন'
    },
    category: 'healthcare',
    priority: 'high',
    status: 'in_progress',
    submittedAt: '2026-10-07T11:00:00+06:00',
    updatedAt: '2026-10-08T09:30:00+06:00',
    estimatedResolutionDays: 2,
    initialEvidence: [
      {
        id: 'ev_05',
        type: 'photo',
        url: '/images/incidents/incident_healthcare.svg',
        caption: 'স্বাস্থ্য ক্লিনিকের পেছনে জমে থাকা অস্বাস্থ্যকর পানি',
        uploadedAt: '2026-10-07T11:00:00+06:00',
        uploaderRole: 'citizen'
      }
    ],
    aiAnalysis: {
      category: 'healthcare',
      categoryLabel: 'জনস্বাস্থ্য ও চিকিৎসা',
      problemSummary: 'ক্লিনিক এলাকায় ডেঙ্গু লার্ভা ও স্বাস্থ্য ঝুঁকি বৃদ্ধি',
      confidenceScore: 92,
      proposedPriority: 'high',
      priorityReason: 'ক্লিনিকের সেবাগ্রহীতা ও রোগীদের মাঝে ডেঙ্গু ছড়িয়ে পড়ার উচ্চ ঝুঁকি',
      proposedDepartmentId: 'dept_health',
      proposedDepartmentName: 'জনস্বাস্থ্য ও রোগ নিয়ন্ত্রণ বিভাগ',
      ruleReference: 'R-HEALTH-01: Vector Control & Clinic Sanitation',
      requiresHumanVerification: false,
      signals: ['মশক নিধন অগ্রাধিকার', 'কমিউনিটি স্বাস্থ্যঝুঁকি']
    },
    tasks: [
      {
        id: 'tsk_health_01',
        caseId: 'NS-2026-W06-0819',
        sequenceOrder: 1,
        departmentId: 'dept_health',
        departmentName: 'জনস্বাস্থ্য ও রোগ নিয়ন্ত্রণ বিভাগ',
        title: 'লার্ভিসাইড স্প্রে ও জমে থাকা পাত্র অপসারণ',
        description: 'ক্লিনিক ও আশপাশের ৫০ মিটার এলাকায় ফগিং ও নোভালুরন প্রয়োগ।',
        status: 'in_progress',
        assignedOfficerId: 'off_health_01',
        assignedOfficerName: 'ডাঃ সাবরিনা ইয়াসমিন (স্বাস্থ্য কর্মকর্তা)',
        assignedOfficerPhone: '০৩১-৬২০৬৬৮',
        slaTargetHours: 24,
        slaDeadline: '2026-10-08T11:00:00+06:00'
      }
    ],
    timeline: [
      {
        id: 'tl_h1',
        caseId: 'NS-2026-W06-0819',
        timestamp: '2026-10-07T11:00:00+06:00',
        actorName: 'নাগরিক',
        actorRole: 'citizen',
        actionTitle: 'স্বাস্থ্য সংক্রান্ত অভিযোগ জমা',
        actionDescription: 'ক্লিনিকে মশার লার্ভা জমার রিপোর্ট দাখিল।',
        stage: 'submitted'
      }
    ]
  },
  {
    id: 'NS-2026-W02-0925',
    trackingNumber: 'NS-2026-W02-0925',
    citizenId: 'cit_04',
    citizenName: 'সৈয়দ আকরাম হোসেন',
    citizenPhone: '01911-334455',
    title: 'বাজার সংলগ্ন রেস্তোরাঁয় বাসি পচা খাবার ও নোংরা পরিবেশ',
    description: 'মিরপুর ১ মুক্তবাংলা মার্কেটের গলির দুটি হোটেলে বাসি পোড়া তেলে রান্না ও পচা মাংস বিক্রির অভিযোগ। ড্রেন খোলা রেখে দূষিত পানি ছিটছে।',
    location: {
      lat: 23.7950,
      lng: 90.3530,
      address: 'মুক্তবাংলা শপিং কমপ্লেক্স রোড, মিরপুর ১, ঢাকা',
      wardId: 2,
      wardName: 'ওয়ার্ড ২',
      landmark: 'মুক্তবাংলা কাঁচাবাজারের প্রবেশমুখ'
    },
    category: 'food',
    priority: 'high',
    status: 'verified',
    submittedAt: '2026-10-08T07:45:00+06:00',
    updatedAt: '2026-10-08T09:00:00+06:00',
    estimatedResolutionDays: 2,
    initialEvidence: [
      {
        id: 'ev_06',
        type: 'photo',
        url: '/images/incidents/incident_food.svg',
        caption: 'রেস্তোরাঁর নোংরা কিচেন ও অস্বাস্থ্যকর খাদ্য প্রস্তুত',
        uploadedAt: '2026-10-08T07:45:00+06:00',
        uploaderRole: 'citizen'
      }
    ],
    aiAnalysis: {
      category: 'food',
      categoryLabel: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার',
      problemSummary: 'বাণিজ্যিক রেস্তোরাঁয় বাসি ভেজাল খাবার ও অস্বাস্থ্যকর রান্নাঘর',
      confidenceScore: 89,
      proposedPriority: 'high',
      priorityReason: 'জনস্বাস্থ্যের মারাত্মক হানি ও ডায়রিয়া সংক্রমণের আশঙ্কা',
      proposedDepartmentId: 'dept_food',
      proposedDepartmentName: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার শাখা',
      ruleReference: 'R-FOOD-01: Food Hygiene & Adulteration Audit',
      requiresHumanVerification: true,
      signals: ['খাদ্যে ভেজাল অভিযোগ', 'ভোক্তা অধিকার লঙ্ঘন']
    },
    tasks: [
      {
        id: 'tsk_food_01',
        caseId: 'NS-2026-W02-0925',
        sequenceOrder: 1,
        departmentId: 'dept_food',
        departmentName: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার শাখা',
        title: 'মোবাইল কোর্ট ও স্যানিটারি ইন্সপেকশন পরিচালনা',
        description: 'খাবারের নমুনা পরীক্ষা ও অস্বাস্থ্যকর পরিবেশের বিরুদ্ধে জরিমানা/নোটিশ।',
        status: 'ready',
        assignedOfficerId: 'off_food_01',
        assignedOfficerName: 'কামাল হোসেন (স্যানিটারি ইন্সপেক্টর)',
        assignedOfficerPhone: '০৩১-৬২০৭৭৯',
        slaTargetHours: 24,
        slaDeadline: '2026-10-09T07:45:00+06:00'
      }
    ],
    timeline: [
      {
        id: 'tl_f1',
        caseId: 'NS-2026-W02-0925',
        timestamp: '2026-10-08T07:45:00+06:00',
        actorName: 'নাগরিক',
        actorRole: 'citizen',
        actionTitle: 'ভেজাল খাদ্যের অভিযোগ জমা',
        actionDescription: 'মিরপুর ১ হোটেলের অস্বাস্থ্যকর খাবার সংক্রান্ত অভিযোগ দাখিল।',
        stage: 'submitted'
      }
    ]
  },
  {
    id: 'NS-2026-W03-1001',
    trackingNumber: 'NS-2026-W03-1001',
    citizenId: 'cit_05',
    citizenName: 'মেহেদী হাসান (ব্যবসায়ী)',
    citizenPhone: '01711-224466',
    title: 'প্রধান সড়কে বড় গর্ত ও কালভার্ট সংযোগে যান চলাচল স্থবির',
    description: 'মিরপুর ১০ হতে মিরপুর ২ সংযোগ সড়কের কালভার্টের মুখে পিচ উঠে রড বের হয়ে পড়েছে। যেকোনো সময় ট্রাক উল্টে প্রাণহানি হতে পারে।',
    location: {
      lat: 23.8068,
      lng: 90.3687,
      address: 'মিরপুর ১০ মেইন রোড, ঢাকা',
      wardId: 3,
      wardName: 'ওয়ার্ড ৩',
      landmark: 'ফায়ার সার্ভিসের বিপরীত লেন'
    },
    category: 'road_transport',
    priority: 'emergency',
    status: 'reopened',
    submittedAt: '2026-10-05T10:00:00+06:00',
    updatedAt: '2026-10-08T08:30:00+06:00',
    estimatedResolutionDays: 1,
    initialEvidence: [
      {
        id: 'ev_07',
        type: 'photo',
        url: '/images/incidents/incident_road.webp',
        caption: 'কালভার্ট সংযোগে বিপজ্জনক ভাঙা গর্ত',
        uploadedAt: '2026-10-05T10:00:00+06:00',
        uploaderRole: 'citizen'
      }
    ],
    aiAnalysis: {
      category: 'road_transport',
      categoryLabel: 'সড়ক ও পরিবহন',
      problemSummary: 'মেইন আর্টেরিয়াল রোডে ধস ও কালভার্ট সংযোগ ক্ষতি',
      confidenceScore: 96,
      proposedPriority: 'emergency',
      priorityReason: 'ব্যস্ততম ট্রাফিক করিডোর + ভারী যানবাহন দুর্ঘটনার তাৎক্ষণিক ঝুঁকি',
      proposedDepartmentId: 'dept_road',
      proposedDepartmentName: 'সড়ক পরিবহন ও অবকাঠামো প্রকৌশল বিভাগ',
      ruleReference: 'R-ROAD-02: Arterial Road Safety Grid',
      assetId: 'RD-CLV-M10',
      requiresHumanVerification: false,
      signals: ['কালভার্ট ক্ষতি কোড (RD-CLV-M10)', 'ট্রাফিক নিরাপত্তা বিপন্ন']
    },
    tasks: [
      {
        id: 'tsk_rd_01',
        caseId: 'NS-2026-W03-1001',
        sequenceOrder: 1,
        departmentId: 'dept_road',
        departmentName: 'সড়ক পরিবহন ও অবকাঠামো প্রকৌশল বিভাগ',
        title: 'জরুরি কোল্ড মিক্স পিচ রিপেয়ার ও স্টিল প্লেট স্থাপন',
        description: 'যানবাহন নিরাপদে চলাচলের জন্য তাত্ক্ষণিক স্টিল প্লেট বসিয়ে পিচ রিপেয়ার।',
        status: 'in_progress',
        assignedOfficerId: 'off_road_01',
        assignedOfficerName: 'প্রকৌশলী মাহমুদুল হাসান (সড়ক প্রকৌশলী)',
        assignedOfficerPhone: '০৩১-৬২০৩৩৬',
        slaTargetHours: 6,
        slaDeadline: '2026-10-08T14:30:00+06:00'
      }
    ],
    timeline: [
      {
        id: 'tl_rd1',
        caseId: 'NS-2026-W03-1001',
        timestamp: '2026-10-08T08:30:00+06:00',
        actorName: 'সিস্টেম অ্যাডমিন',
        actorRole: 'admin',
        actionTitle: 'জরুরি আপত্তির প্রেক্ষিতে কেস পুনরায় চালু',
        actionDescription: 'নাগরিকের আপত্তির পর কেসটিকে জরুরি অগ্রাধিকার দিয়ে প্রকৌশল উইংয়ে পাঠানো হয়েছে।',
        stage: 'reopened',
        badgeType: 'danger'
      }
    ]
  },
  {
    id: 'NS-2026-000192',
    trackingNumber: 'NS-2026-000192',
    citizenId: 'cit_09',
    citizenName: 'তানভীর আহমেদ চৌধুরী',
    citizenPhone: '০১৭৫২-৯৮৭৬৫৪',
    title: 'ট্রান্সফরমার অতিরিক্ত তাপে বিস্ফোরিত ও লাইভ হাই-ভোল্টেজ তার রাস্তায় ঝুলন্ত',
    description: 'মিরপুর ১ কমার্শিয়াল এরিয়ায় প্রধান ডিস্ট্রিবিউশন ট্রান্সফরমার বিকট শব্দে বিস্ফোরিত হয়ে আগুন ধরে যায়। প্রধান সড়কের উপর ১১ কেভি লাইভ তার ছিঁড়ে পড়েছে, ফলে আশপাশের বিপণিবিতান ও আবাসিক এলাকায় বিদ্যুৎ সরবরাহ সম্পূর্ণ বন্ধ এবং পথচারীদের জন্য প্রাণনাশের তীব্র ঝুঁকি তৈরি হয়েছে।',
    location: {
      lat: 23.7956,
      lng: 90.3537,
      address: 'রোড ২, ব্লক বি, মিরপুর ১ গোলচত্বর সংলগ্ন',
      wardId: 8,
      wardName: 'ওয়ার্ড ৮',
      landmark: 'মুক্তবাংলা শপিং কমপ্লেক্সের উত্তর গেট'
    },
    category: 'electricity',
    priority: 'emergency',
    status: 'in_progress',
    submittedAt: '2026-10-08T11:00:00+06:00',
    updatedAt: '2026-10-08T11:45:00+06:00',
    estimatedResolutionDays: 1,
    initialEvidence: [
      {
        id: 'ev_el_192',
        type: 'photo',
        url: '/images/incidents/incident_electricity.svg',
        caption: 'জরুরি সাইট ছবি: বিস্ফোরিত ট্রান্সফরমার ও রাস্তায় পড়া লাইভ কেবল',
        uploadedAt: '2026-10-08T11:00:00+06:00',
        uploaderRole: 'citizen',
        isPrivacyMasked: true,
        fileSizeBytes: 3100000
      }
    ],
    aiAnalysis: {
      category: 'electricity',
      categoryLabel: 'বিদ্যুৎ ও সড়কবাতি',
      problemSummary: 'ট্রান্সফরমার ব্লাস্ট ও লাইভ বৈদ্যুতিক তার বিচ্ছিন্ন হয়ে জননিরাপত্তা বিপন্ন',
      confidenceScore: 98,
      proposedPriority: 'emergency',
      priorityReason: 'লাইভ হাই-ভোল্টেজ ক্যাবল উন্মুক্ত ফুটপাতে পতিত + তাৎক্ষণিক অগ্নিকাণ্ড ও ইলেকট্রিক শক ঝুঁকি',
      proposedDepartmentId: 'dept_electricity',
      proposedDepartmentName: 'বিদ্যুৎ ও সড়কবাতি বিভাগ',
      ruleReference: 'R-ELEC-01: Live Wire Critical Response Protocol',
      assetId: 'TR-M1-08',
      requiresHumanVerification: false,
      signals: ['হাই ভোল্টেজ ক্যাবল ফল্ট (TR-M1-08)', 'মার্কেট এরিয়া পাওয়ার কাট', 'তাত্ক্ষণিক অগ্নিনির্বাপণ প্রটোকল']
    },
    tasks: [
      {
        id: 'tsk_el_01',
        caseId: 'NS-2026-000192',
        sequenceOrder: 1,
        departmentId: 'dept_electricity',
        departmentName: 'বিদ্যুৎ ও সড়কবাতি বিভাগ',
        title: 'জরুরি পাওয়ার কাটআইসোলেশন ও নতুন ট্রান্সফরমার প্রতিস্থাপন',
        description: 'সাব-স্টেশন থেকে গ্রিড আইসোলেট করে পোড়া ট্রান্সফরমার সরিয়ে নতুন ২৫০ কেভিএ ইউনিট সংস্থাপন।',
        status: 'in_progress',
        assignedOfficerId: 'off_elec_01',
        assignedOfficerName: 'প্রকৌশলী মেজবাহ উদ্দিন',
        assignedOfficerPhone: '০৩১-৬২০৪৪৪',
        slaTargetHours: 8,
        slaDeadline: '2026-10-08T19:00:00+06:00'
      }
    ],
    timeline: [
      {
        id: 'tl_el_1',
        caseId: 'NS-2026-000192',
        timestamp: '2026-10-08T11:00:00+06:00',
        actorName: 'নাগরিক অ্যাপ (জরুরি এসওএস)',
        actorRole: 'citizen',
        actionTitle: 'জরুরি বিপদ সংকেত দাখিল',
        actionDescription: 'নাগরিক ছবিসহ লাইভ তার ছিঁড়ে পড়ার ঘটনা রিপোর্ট করেছেন।',
        stage: 'submitted',
        badgeType: 'danger'
      },
      {
        id: 'tl_el_2',
        caseId: 'NS-2026-000192',
        timestamp: '2026-10-08T11:15:00+06:00',
        actorName: 'জরুরি কমান্ড সেন্টার',
        actorRole: 'admin',
        actionTitle: 'গ্রিড ট্রিপ ও রেপিড রেসপন্স টিম প্রেরণ',
        actionDescription: 'মিরপুর ১ ফিডার সাময়িকভাবে বন্ধ করে রেপিড ইমার্জেন্সি টিম স্পটে পাঠানো হয়েছে।',
        stage: 'in_progress',
        badgeType: 'warning'
      }
    ]
  },
  {
    id: 'NS-2026-000193',
    trackingNumber: 'NS-2026-000193',
    citizenId: 'cit_10',
    citizenName: 'সেলিনা পারভীন',
    citizenPhone: '০১৮১৬-৭৭৮৮৯৯',
    title: 'ভূগর্ভস্থ সুপেয় পানির পাইপলাইনে ছিদ্র ও নর্দমার বিষাক্ত পানির মিশ্রণ',
    description: 'মোহাম্মদপুর জাকির হোসেন রোডে ওয়াসার ৬ ইঞ্চি ব্যাসের সুপেয় পানির মূল ফিডার লাইনে ফাটল ধরেছে। পাশের উন্মুক্ত নর্দমার নোংরা পানি পাইপের ফাটল দিয়ে প্রবেশ করায় প্রায় চার শতাধিক পরিবারের বাসাবাড়িতে দুর্গন্ধযুক্ত ঘোলা ও রোগজীবাণুযুক্ত পানি প্রবাহিত হচ্ছে।',
    location: {
      lat: 23.7612,
      lng: 90.3621,
      address: 'রোড ৪, জাকির হোসেন রোড, মোহাম্মদপুর, ঢাকা',
      wardId: 5,
      wardName: 'ওয়ার্ড ৫',
      landmark: 'জাকির হোসেন খেলার মাঠ সংলগ্ন'
    },
    category: 'water',
    priority: 'high',
    status: 'under_inspection',
    submittedAt: '2026-10-08T09:15:00+06:00',
    updatedAt: '2026-10-08T10:30:00+06:00',
    estimatedResolutionDays: 2,
    initialEvidence: [
      {
        id: 'ev_wat_193',
        type: 'photo',
        url: '/images/incidents/incident_water.svg',
        caption: 'সাইট ছবি: ভূগর্ভস্থ পাইপলাইনে লিকেজ ও পানির সরবরাহ পয়েন্টে দূষণ',
        uploadedAt: '2026-10-08T09:15:00+06:00',
        uploaderRole: 'citizen',
        isPrivacyMasked: true,
        fileSizeBytes: 2890000
      }
    ],
    aiAnalysis: {
      category: 'water',
      categoryLabel: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন',
      problemSummary: 'ওয়াসা পাইপলাইনে লিকেজের কারণে সুপেয় পানির লাইনে দূষিত বর্জ্য পানির অনুপ্রবেশ',
      confidenceScore: 94,
      proposedPriority: 'high',
      priorityReason: 'জনস্বাস্থ্যের মারাত্মক ঝুঁকি + ডায়রিয়া ও পানিবাহিত রোগের সংক্রমণ বিস্তার প্রতিরোধ',
      proposedDepartmentId: 'dept_water',
      proposedDepartmentName: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন শাখা (ওয়াসা)',
      ruleReference: 'R-WASA-04: Contaminated Drinking Line Isolation',
      assetId: 'WS-MH-102',
      requiresHumanVerification: true,
      signals: ['ওয়াসা ড্রিংকিং ওয়াটার পাইপ লিকেজ', 'নর্দমা মিশ্রণ দূষণ', 'ওয়ার্ড ৫ ডায়রিয়া সতর্কবার্তা']
    },
    tasks: [
      {
        id: 'tsk_wat_01',
        caseId: 'NS-2026-000193',
        sequenceOrder: 1,
        departmentId: 'dept_water',
        departmentName: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন শাখা (ওয়াসা)',
        title: 'ভূগর্ভস্থ লিকেজ পয়েন্ট শনাক্তকরণ ও পাইপ সেকশন মেরামত',
        description: 'রোড এক্সকাভেশন করে লিকেজ স্পট সিল করা এবং বিশুদ্ধ পানি ফ্লাশিং নিশ্চিত করা।',
        status: 'ready',
        assignedOfficerId: 'off_water_01',
        assignedOfficerName: 'প্রকৌশলী শামসুল হুদা',
        assignedOfficerPhone: '০৩১-৬২০৫৫৭',
        slaTargetHours: 24,
        slaDeadline: '2026-10-09T09:15:00+06:00'
      }
    ],
    timeline: [
      {
        id: 'tl_wat_1',
        caseId: 'NS-2026-000193',
        timestamp: '2026-10-08T09:15:00+06:00',
        actorName: 'নাগরিক অভিযোগ পোর্টাল',
        actorRole: 'citizen',
        actionTitle: 'পানি দূষণ অভিযোগ দাখিল',
        actionDescription: 'নাগরিক জাকির হোসেন রোডে পানির লাইনে নর্দমার পানি আসার বিষয়ে অভিযোগ করেছেন।',
        stage: 'submitted',
        badgeType: 'warning'
      },
      {
        id: 'tl_wat_2',
        caseId: 'NS-2026-000193',
        timestamp: '2026-10-08T10:30:00+06:00',
        actorName: 'ওয়ার্ড ৫ ডেস্ক অফিসার',
        actorRole: 'ward_desk',
        actionTitle: 'প্রাথমিক পরিদর্শনের জন্য অনুমোদন',
        actionDescription: 'ওয়াসা টিমকে ফিল্ডে পাঠিয়ে লিকেজ স্পট যাচাইয়ের নির্দেশ প্রদান।',
        stage: 'under_inspection',
        badgeType: 'info'
      }
    ]
  }
];

export const INITIAL_SERVICES: VerifiedServiceKnowledge[] = [
  {
    id: 'srv_01',
    code: 'TRD-01',
    title: 'ই-ট্রেড লাইসেন্স ইস্যু ও নবায়ন',
    titleEn: 'E-Trade License Issuance & Renewal',
    category: 'ব্যবসা ও বাণিজ্য',
    department: 'রাজস্ব ও এস্টেট শাখা',
    targetCitizens: 'সকল বাণিজ্যিক প্রতিষ্ঠান, দোকান ও ব্যবসায়ী',
    requiredDocuments: [
      { id: 'doc_1', name: 'জাতীয় পরিচয়পত্র (NID)', mandatory: true, description: 'মালিক বা অংশীদারদের ডিজিটাল এনআইডি কপি' },
      { id: 'doc_2', name: 'ভাড়ার চুক্তিপত্র বা হোল্ডিং ট্যাক্স রসিদ', mandatory: true, description: 'দোকান/অফিসের ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে ভাড়াচুক্তি' },
      { id: 'doc_3', name: 'পাসপোর্ট সাইজের রঙিন ছবি', mandatory: true, description: 'সদ্য তোলা ২ কপি ছবি (ডিজিটাল জেপিজি)' },
      { id: 'doc_4', name: 'টিন (TIN) সার্টিফিকেট', mandatory: false, description: 'সীমিত দায় কোম্পানি ও আমদানিকারকদের জন্য বাধ্যতামূলক' }
    ],
    steps: [
      { stepNumber: 1, title: 'অনলাইন ফরম পূরণ', description: 'প্রতিষ্ঠানের বিস্তারিত তথ্য ও ঠিকানা ইনপুট দিন', estimatedDays: 1 },
      { stepNumber: 2, title: 'কাগজপত্র আপলোড', description: 'এনআইডি, ছবি ও ভাড়াচুক্তি স্ক্যান আপলোড করুন', estimatedDays: 1 },
      { stepNumber: 3, title: 'ফি পরিশোধ', description: 'বিকাশ/নগদ/অনলাইন ব্যাংকিংয়ের মাধ্যমে সরকারি ফি দিন', estimatedDays: 1 },
      { stepNumber: 4, title: 'ডিজিটাল লাইসেন্স ডাউনলোড', description: 'যাচাই শেষে কিউআর কোডযুক্ত সার্টিফিকেট ডাউনলোড করুন', estimatedDays: 2 }
    ],
    officialFee: '৫০০ - ৫,০০০ টাকা (ব্যবসার ধরনভেদে নির্ধারিত)',
    officialSource: 'স্থানীয় সরকার বিভাগ, সিটি কর্পোরেশন রাজস্ব সার্কুলার ২০২৪',
    officialPortalUrl: 'https://etradelicense.gov.bd',
    lastVerifiedDate: '২০২৬-০৮-১৫',
    isOnlineAvailable: true
  },
  {
    id: 'srv_02',
    code: 'BRG-02',
    title: 'অনলাইন জন্ম নিবন্ধন ও সংশোধন',
    titleEn: 'Online Birth Registration & Correction',
    category: 'নাগরিক সনদ',
    department: 'স্বাস্থ্য ও জন্ম-মৃত্যু নিবন্ধন শাখা',
    targetCitizens: 'সকল বয়সের নাগরিক ও নবজাতকের অভিভাবক',
    requiredDocuments: [
      { id: 'doc_5', name: 'ইপিআই কার্ড / হাসপাতালের জন্ম সনদ', mandatory: true, description: 'চিকিৎসক বা ক্লিনিক কর্তৃক প্রদত্ত অফিসিয়াল বার্থ স্লিপ' },
      { id: 'doc_6', name: 'পিতা-মাতার ডিজিটাল জন্ম নিবন্ধন ও এনআইডি', mandatory: true, description: '১৬ বা ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর' },
      { id: 'doc_7', name: 'হোল্ডিং ট্যাক্স রসিদ / ইউটিলিটি বিল', mandatory: true, description: 'স্থায়ী বা বর্তমান ঠিকানার সমর্থনে বিদ্যুৎ বা গ্যাস বিল' }
    ],
    steps: [
      { stepNumber: 1, title: 'BDRIS পোর্টালে আবেদন', description: 'আবেদন ফরম পূরণ করে প্রিভিউ দেখে সাবমিট করুন', estimatedDays: 1 },
      { stepNumber: 2, title: 'ওয়ার্ড অফিসে প্রিন্ট কপি জমা', description: 'আবেদনপত্রের প্রিন্ট কপি ও মূল কাগজপত্র ওয়ার্ড সচিবের নিকট প্রদর্শন', estimatedDays: 2 },
      { stepNumber: 3, title: 'কাউন্সিলর যাচাই ও অনুমোদন', description: 'কাউন্সিলর ও স্বাস্থ্য পরিদর্শক কর্তৃক অনুমোদন', estimatedDays: 3 },
      { stepNumber: 4, title: 'ডিজিটাল সনদ গ্রহণ', description: 'অনলাইন থেকে ১৭ ডিজিটের কিউআর কোডযুক্ত সনদ সংগ্রহ', estimatedDays: 1 }
    ],
    officialFee: 'বিনামূল্যে (৪৫ দিনের মধ্যে) / ৫০-১০০ টাকা (বিলম্বিত)',
    officialSource: 'রেজিস্ট্রার জেনারেলের কার্যালয়, জন্ম ও মৃত্যু নিবন্ধন',
    officialPortalUrl: 'https://bdris.gov.bd',
    lastVerifiedDate: '২০২৬-০৯-০১',
    isOnlineAvailable: true
  },
  {
    id: 'srv_03',
    code: 'HLD-03',
    title: 'হোল্ডিং ট্যাক্স নির্ধারণ ও ই-পেমেন্ট',
    titleEn: 'Holding Tax Assessment & E-Payment',
    category: 'কর ও রাজস্ব',
    department: 'রাজস্ব বিভাগ',
    targetCitizens: 'সিটি কর্পোরেশনের সকল বাড়ি ও ফ্ল্যাটের মালিক',
    requiredDocuments: [
      { id: 'doc_8', name: 'জমির দলিল ও নামজারি খতিয়ান', mandatory: true, description: 'মালিকানা প্রমাণের দলিলের স্ক্যান কপি' },
      { id: 'doc_9', name: 'রাজউক / সিডিএ অনুমোদিত বিল্ডিং প্ল্যান', mandatory: true, description: 'অনুমোদিত নকশা ও ভবনের ফ্লোর এরিয়া বিবরণ' }
    ],
    steps: [
      { stepNumber: 1, title: 'হোল্ডিং নম্বর দিয়ে সার্চ', description: 'ওয়ার্ড ও হোল্ডিং নম্বর দিয়ে বকেয়া ট্যাক্স বিবরণী দেখুন', estimatedDays: 1 },
      { stepNumber: 2, title: 'ডিজিটাল চালান যাচাই', description: 'ত্রৈমাসিক বা বাৎসরিক রিবেটসহ পরিমাণ দেখুন', estimatedDays: 1 },
      { stepNumber: 3, title: 'ই-পেমেন্ট', description: 'যেকোনো মোবাইল ওয়ালেট বা কার্ডে পরিশোধ করুন', estimatedDays: 1 }
    ],
    officialFee: 'বার্ষিক মূল্যায়ন মূল্যের ১২% (পৌরকর ও আলোকায়ন সহ)',
    officialSource: 'সিটি কর্পোরেশন ট্যাক্সেশন রুলস',
    officialPortalUrl: 'https://holdingtax.gov.bd',
    lastVerifiedDate: '২০২৬-০৭-২০',
    isOnlineAvailable: true
  },
  {
    id: 'srv_04',
    code: 'WST-04',
    title: 'বিশেষ বর্জ্য অপসারণ ও নির্মাণ বর্জ্য বুকিং',
    titleEn: 'Special & Construction Waste Removal Booking',
    category: 'পরিবেশ ও বর্জ্য',
    department: 'বর্জ্য ব্যবস্থাপনা বিভাগ',
    targetCitizens: 'ভবন নির্মাতা, কারখানা ও কমিউনিটি সেন্টার',
    requiredDocuments: [
      { id: 'doc_10', name: 'জাতীয় পরিচয়পত্র', mandatory: true, description: 'আবেদনকারীর এনআইডি' },
      { id: 'doc_11', name: 'বর্জ্যের আনুমানিক আয়তন ও ছবি', mandatory: true, description: 'ট্রাক বা কন্টেইনার পরিমাণের বিবরণ' }
    ],
    steps: [
      { stepNumber: 1, title: 'পিকআপ রিকোয়েস্ট তৈরি', description: 'তারিখ, সময় ও ঠিকানা উল্লেখ করে আবেদন করুন', estimatedDays: 1 },
      { stepNumber: 2, title: 'পরিদর্শক মূল্যায়ন', description: 'ওয়ার্ড পরিদর্শক ভল্যুম যাচাই করে কন্টেইনার বরাদ্দ করবেন', estimatedDays: 1 },
      { stepNumber: 3, title: 'পিকআপ ও ডাম্পিং', description: 'নির্দিষ্ট সময়ে সিটি কর্পোরেশনের ডাম্পার ট্রাক বর্জ্য সংগ্রহ করবে', estimatedDays: 1 }
    ],
    officialFee: '১,২০০ টাকা প্রতি মিনি-ট্রাক ট্রিপ',
    officialSource: 'সিটি কর্পোরেশন বর্জ্য ব্যবস্থাপনা নীতিমালা',
    officialPortalUrl: 'https://clean.gov.bd',
    lastVerifiedDate: '২০২৬-০৮-১০',
    isOnlineAvailable: true
  },
  {
    id: 'srv_05',
    code: 'ENG-05',
    title: 'রাস্তা খনন ও ইউটিলিটি সংযোগ অনুমতিপত্র',
    titleEn: 'Road Cutting & Utility Trenching Permission',
    category: 'প্রকৌশল ও অবকাঠামো',
    department: 'সড়ক ও অবকাঠামো প্রকৌশল বিভাগ',
    targetCitizens: 'ওয়াসা, তিতাস গ্যাস, ডেসকো ও ব্যক্তিগত ভবন মালিক',
    requiredDocuments: [
      { id: 'doc_12', name: 'ইউটিলিটি এজেন্সির চাহিদাপত্র', mandatory: true, description: 'ওয়াসা/তিতাস অনুমোদিত সংযোগ নকশা' },
      { id: 'doc_13', name: 'রাস্তার রুট ম্যাপ ও মেজারমেন্ট', mandatory: true, description: 'খননের দৈর্ঘ্য, প্রস্থ ও গভীরতার পরিমাপ' }
    ],
    steps: [
      { stepNumber: 1, title: 'অনলাইন নো-অবজেকশন আবেদন', description: 'রুট ও কাজের সময়কাল উল্লেখ করুন', estimatedDays: 2 },
      { stepNumber: 2, title: 'সাইট ইন্সপেকশন', description: 'সহকারী প্রকৌশলী রাস্তা পর্যবেক্ষণ করে ক্ষতিপূরণ ফি নির্ধারণ করবেন', estimatedDays: 3 },
      { stepNumber: 3, title: 'ক্ষতিপূরণ আমানত জমা', description: 'রাস্তা পুনঃনির্মাণ ফি ব্যাংকে জমা দিন', estimatedDays: 1 },
      { stepNumber: 4, title: 'কাজের অনুমতি প্রদান', description: 'নির্ধারিত মেয়াদের ডিজিটাল অনুমতিপত্র ইস্যু', estimatedDays: 2 }
    ],
    officialFee: 'প্রতি বর্গমিটার বিটুমিনাস রাস্তা ৩,৫০০ টাকা (পুনঃনির্মাণ জামানত)',
    officialSource: 'সড়ক খনন সমন্বয় নীতিমালা',
    officialPortalUrl: 'https://roadcut.gov.bd',
    lastVerifiedDate: '২০২৬-০৯-১০',
    isOnlineAvailable: true
  },
  {
    id: 'srv_06',
    code: 'DRN-06',
    title: 'ব্যক্তিগত ড্রেন আউটফল সংযোগ অনুমোদন',
    titleEn: 'Private Drain Outfall Connection Approval',
    category: 'ড্রেনেজ ও পয়ঃনিষ্কাশন',
    department: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ',
    targetCitizens: 'নতুন বহুতল ভবনের মালিক ও আবাসন নির্মাতা',
    requiredDocuments: [
      { id: 'doc_14', name: 'অভ্যন্তরীণ প্লাম্বিং ও ড্রেনেজ লে-আউট', mandatory: true, description: 'সার্টিফাইড সিভিল ইঞ্জিনিয়ারের ডিজাইন' },
      { id: 'doc_15', name: 'সেপটিক ট্যাংক ও সোয়াক পিট বিবরণ', mandatory: true, description: 'সরাসরি সলিড ওয়েস্ট ড্রেনে ফেলা যাবে না মর্মে অঙ্গীকার' }
    ],
    steps: [
      { stepNumber: 1, title: 'আউটফল কানেকশন রিকোয়েস্ট', description: 'কাছের সিটি ড্রেনের সাথে সংযোগ পয়েন্ট নির্বাচন', estimatedDays: 2 },
      { stepNumber: 2, title: 'কারিগরি সম্ভাব্যতা যাচাই', description: 'ড্রেনেজ বিভাগের ফিল্ড টিম স্লোপ ও পাইপ ডায়ামিটার চেক করবে', estimatedDays: 4 },
      { stepNumber: 3, title: 'সংযোগ সম্পন্ন ও অনুমোদন', description: 'সুপারভিশনে সংযোগ প্রদান ও ছাড়পত্র ইস্যু', estimatedDays: 3 }
    ],
    officialFee: '২,০০০ টাকা (ফিক্সড ইন্সপেকশন ফি)',
    officialSource: 'সিটি কর্পোরেশন পয়ঃনিষ্কাশন উপ-আইন',
    officialPortalUrl: 'https://drainage.gov.bd',
    lastVerifiedDate: '২০২৬-০৮-২০',
    isOnlineAvailable: true
  }
];

export const INITIAL_HOTSPOTS: HotspotZone[] = [
  {
    id: 'hotspot_w12_01',
    name: 'উত্তরা সেক্টর ৭ ও ৯ ড্রেনেজ ও বর্জ্য হটস্পট',
    wardId: 12,
    wardName: 'ওয়ার্ড ১২',
    category: 'drainage',
    incidentCount: 14,
    severity: 'critical',
    recurrentAsset: 'ড্রেন সেগমেন্ট DS-104 ও DS-105',
    geoCenter: [23.8682, 90.3985],
    polygonCoordinates: [
      [23.865, 90.395],
      [23.872, 90.395],
      [23.872, 90.402],
      [23.865, 90.402]
    ],
    aiSuggestion: 'ড্রেনের মুখে নিয়মিত কঠিন বর্জ্য ফেলার কারণে বারবার ব্লকেজ। স্থায়ী ওয়েস্ট গ্রিল স্থাপন ও ড্রেন সেকশন প্রশস্তকরণ সুপারিশকৃত।',
    lastIncidentDate: '2026-10-06',
    status: 'active_monitoring'
  },
  {
    id: 'hotspot_w13_02',
    name: 'মিরপুর ১০ গোলচত্বর সড়ক অবকাঠামো হটস্পট',
    wardId: 13,
    wardName: 'ওয়ার্ড ১৩',
    category: 'road_engineering',
    incidentCount: 9,
    severity: 'high',
    recurrentAsset: 'মিরপুর জংশন করিডোর RD-MIR-10',
    geoCenter: [23.8069, 90.3687],
    polygonCoordinates: [
      [23.803, 90.365],
      [23.810, 90.365],
      [23.810, 90.372],
      [23.803, 90.372]
    ],
    aiSuggestion: 'ভারী বাস চলাচলের কারণে দ্রুত পিচ ক্ষয়। বিটুমিনের পরিবর্তে আরসিসি ঢালাইয়ের মাধ্যমে স্থায়ী সংস্কার প্রয়োজন।',
    lastIncidentDate: '2026-10-07',
    status: 'remediation_planned'
  }
];

export const INITIAL_DUPLICATES: DuplicateCandidate[] = [
  {
    primaryCaseId: 'NS-2026-000184',
    duplicateCaseId: 'NS-2026-000189',
    similarityScore: 92,
    distanceMeters: 18,
    category: 'drainage',
    detectedAt: '2026-10-06T11:45:00+06:00',
    status: 'pending_review'
  }
];

export const INITIAL_AI_GATE: AiGateConfiguration = {
  confidenceThresholdPercent: 80,
  alwaysRequireHumanVerificationOnEmergency: true,
  alwaysRequireHumanVerificationOnMultiDept: true,
  version: '2.4.1 (Governance Approved)',
  updatedAt: '2026-09-15T10:00:00+06:00',
  updatedBy: 'সিস্টেম অ্যাডমিনিস্ট্রেটর (চিফ আইসিটি অফিসার)'
};

export const INITIAL_RULES: ResponsibilityRule[] = [
  {
    id: 'rule_12',
    ruleCode: 'R-12',
    title: 'ভূগর্ভস্থ ও উন্মুক্ত ড্রেনেজ পাইপলাইন রেসপন্সিবিলিটি রুল',
    assetType: 'ড্রেন ও ক্যাচপিট (Drain Segment DS)',
    wardId: 12,
    primaryDepartmentId: 'dept_drainage',
    primaryDepartmentName: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ',
    secondaryDepartmentId: 'dept_waste',
    secondaryDepartmentName: 'বর্জ্য ব্যবস্থাপনা বিভাগ (উপরিভাগের কঠিন বর্জ্যের জন্য)',
    version: 'v3.2',
    status: 'active',
    effectiveDate: '২০২৪-০১-০১'
  },
  {
    id: 'rule_04',
    ruleCode: 'R-04',
    title: 'সিটি প্রাইমারি ও সেকেন্ডারি সড়ক মেরামত নীতিমালা',
    assetType: 'বিটুমিনাস ও আরসিসি সড়ক (Road Segment RD)',
    primaryDepartmentId: 'dept_road',
    primaryDepartmentName: 'সড়ক ও অবকাঠামো প্রকৌশল বিভাগ',
    version: 'v2.1',
    status: 'active',
    effectiveDate: '২০২৩-০৬-১৫'
  },
  {
    id: 'rule_08',
    ruleCode: 'R-08',
    title: 'স্মার্ট স্ট্রিট লাইটিং ও ফিডার প্যানেল সার্ভিস রুল',
    assetType: 'ল্যাম্পপোস্ট ও ট্রান্সফরমার (Lamp Post LP)',
    primaryDepartmentId: 'dept_lighting',
    primaryDepartmentName: 'বিদ্যুৎ ও সড়ক বাতি বিভাগ',
    version: 'v1.8',
    status: 'active',
    effectiveDate: '২০২৩-১১-০১'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_101',
    timestamp: '2026-10-06T09:30:15+06:00',
    actorId: 'cit_01',
    actorName: 'নাগরিক (টোকেন-এনক্রিপ্টেড)',
    actorRole: 'citizen',
    action: 'CASE_SUBMITTED',
    resourceType: 'case',
    resourceId: 'NS-2026-000184',
    details: 'ওয়ার্ড ১২ এ ড্রেন বন্ধ ও জলাবদ্ধতা সংক্রান্ত অভিযোগ দাখিলকৃত। অডিও ও ছবি প্রমাণ সংযুক্ত।',
    ipAddress: '103.140.24.12',
    isImmutableVerified: true
  },
  {
    id: 'aud_102',
    timestamp: '2026-10-06T10:15:30+06:00',
    actorId: 'ward_12_officer',
    actorName: 'কামরুল হাসান (ওয়ার্ড ডেস্ক কর্মকর্তা)',
    actorRole: 'ward_desk',
    action: 'RESPONSIBILITY_VERIFIED',
    resourceType: 'case',
    resourceId: 'NS-2026-000184',
    details: 'এআই দায়িত্ব সুপারিশ গৃহীত। ড্রেনেজ ও বর্জ্য ব্যবস্থাপনা বিভাগকে অ্যাসাইন করা হয়েছে (Rule R-12)।',
    ipAddress: '192.168.12.44',
    isImmutableVerified: true
  },
  {
    id: 'aud_103',
    timestamp: '2026-10-06T10:45:10+06:00',
    actorId: 'coord_01',
    actorName: 'মাহমুদুল হক (সমন্বয়ক)',
    actorRole: 'coordinator',
    action: 'MULTI_DEPT_SEQUENCE_APPROVED',
    resourceType: 'case',
    resourceId: 'NS-2026-000184',
    details: '৩-ধাপের ডিপেন্ডেন্সি সিকোয়েন্স অনুমোদন: ১. বর্জ্য ➔ ২. ড্রেনেজ ➔ ৩. সড়ক মেরামত।',
    ipAddress: '192.168.10.15',
    isImmutableVerified: true
  },
  {
    id: 'aud_104',
    timestamp: '2026-10-06T16:30:22+06:00',
    actorId: 'off_waste_01',
    actorName: 'মোঃ শফিকুল ইসলাম (মাঠ পরিদর্শক)',
    actorRole: 'field_officer',
    action: 'EVIDENCE_PROOF_UPLOADED',
    resourceType: 'task',
    resourceId: 'tsk_01',
    details: 'বর্জ্য অপসারণ সমাপ্তির ছবি প্রমাণ আপলোড ও টাস্ক রেজলভড চিহ্নিত।',
    ipAddress: '103.205.71.9',
    isImmutableVerified: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    userId: 'cit_01',
    targetRole: 'citizen',
    caseId: 'NS-2026-000184',
    title: 'অভিযোগের অগ্রগতি: মাঠ কাজ শুরু হয়েছে',
    message: 'আপনার অভিযোগ NS-2026-000184 এর ১ম ধাপের বর্জ্য অপসারণ সম্পন্ন হয়েছে। ড্রেন ডেসিল্টিং কাজ চলমান।',
    type: 'status_update',
    createdAt: '2026-10-06T16:35:00+06:00',
    isRead: false,
    actionLink: '/cases/NS-2026-000184'
  },
  {
    id: 'notif_02',
    targetRole: 'ward_desk',
    caseId: 'NS-2026-000192',
    title: 'জরুরি অগ্রাধিকার অ্যালার্ট (Emergency)',
    message: 'মিরপুর ১০ গোলচত্বরে বিপজ্জনক গর্ত সংক্রান্ত জরুরি অভিযোগ দ্রুত যাচাই প্রয়োজন।',
    type: 'action_required',
    createdAt: '2026-10-07T14:22:00+06:00',
    isRead: false,
    actionLink: '/ward/cases/NS-2026-000192'
  },
  {
    id: 'notif_03',
    userId: 'cit_01',
    targetRole: 'citizen',
    caseId: 'NS-2026-000170',
    title: 'সমাধান সম্পন্ন: আপনার মতামত প্রয়োজন',
    message: 'ল্যাম্পপোস্ট মেরামতের ছবি প্রমাণ আপলোড করা হয়েছে। অনুগ্রহ করে দেখে মতামত দিন।',
    type: 'evidence_submitted',
    createdAt: '2026-10-07T19:50:00+06:00',
    isRead: false,
    actionLink: '/cases/NS-2026-000170'
  }
];

// Refined component integration
