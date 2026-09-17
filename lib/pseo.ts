export type PseoService = Readonly<{
  kind: 'service';
  slug: string;
  name: string;
  title: string;
  description: string;
  intent: string;
  buyer: string;
  context: string;
  workflow: readonly string[];
  deliverables: readonly string[];
  evidence: readonly string[];
  readiness: string;
  agencySlug: string;
  agencyName: string;
  agencyThaiName: string;
  agencyStatus: 'incubating' | 'target' | 'locked';
  agencyStage: string;
}>;

export const pseoService: PseoService = {
  "kind": "service",
  "slug": "technical-recruitment-pilot",
  "name": "Specialist technical search pilot",
  "title": "Technical Recruitment สำหรับทีมที่ต้องการคนสำคัญ",
  "description": "เริ่มจาก role scorecard และ evidence pack เพื่อให้การคัดเลือก senior technical talent ตรวจสอบได้",
  "intent": "ต้องการหาคน backend, data หรือ AI ที่ตรงกับงานจริง โดยไม่ตัดสินจาก CV เพียงอย่างเดียว",
  "buyer": "CEO, CHRO และ hiring manager",
  "context": "เริ่มจาก search pilot หนึ่งตำแหน่งที่มี scorecard, consent และ hiring owner ชัดเจน ไม่ใช่ marketplace หรือฐานข้อมูลผู้สมัคร",
  "workflow": [
    "กำหนด role scorecard, must-have และ evidence ที่ยอมรับได้",
    "เก็บข้อมูลผู้สมัครเท่าที่ได้รับ consent และตรวจความครบของหลักฐาน",
    "ทำ shortlist 5–8 รายพร้อม gap และคำถามสำหรับ interview",
    "ส่ง evidence pack ให้ hiring manager ตัดสินใจและบันทึก feedback"
  ],
  "deliverables": [
    "role scorecard และ candidate evidence template",
    "consented shortlist พร้อมเหตุผลที่ตรวจได้",
    "interview handoff และ open-question register",
    "consent, retention และ reviewer checklist"
  ],
  "evidence": [
    "ไม่มี candidate data จริงใน public website หรือ fixture",
    "ไม่อ้าง placement, hiring outcome หรือเครือข่ายผู้สมัครที่ยังไม่มีหลักฐาน",
    "การตัดสินใจรับคนยังเป็นของ hiring manager"
  ],
  "readiness": "ต้องมี talent owner, role brief, consent/retention boundary และ reviewer ก่อนเปิด inquiry",
  "agencySlug": "talent",
  "agencyName": "Talent",
  "agencyThaiName": "Talent & Workforce",
  "agencyStatus": "incubating",
  "agencyStage": "P0"
};
