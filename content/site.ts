export type Project = { id: string; name: string; category: string; title: string; description: string; note: string; href?: string; theme: string };
export type Experience = { company: string; role: string; context?: string };
// Source: MASTER_BUILD_BRIEF.md. Metrics and dates await current source verification.
export const profile = { name: 'Sriram Kakumanu', positioning: 'Product × Technology × Human Behavior', school: 'The University of Texas at Austin', classYear: '2028', studies: 'Management Information Systems + Psychology', github: 'https://github.com/SriramK12' };
export const projects: Project[] = [
 { id:'studysense',name:'StudySense',category:'01 / LEARNING',title:'A little more understanding. A lot more possibility.',description:'Personalized AI tutoring, shaped around how people learn.',note:'Public product · Case study in preparation',href:'https://www.studysense.org/',theme:'study'},
 { id:'plateconnect',name:'PlateConnect',category:'02 / FOOD SYSTEMS',title:'The food was never the problem.',description:'An iOS product connecting surplus restaurant food with food banks and charities. Designed around the friction of reporting and coordinating a pickup.',note:'Project brief · Ownership and outcomes under review',theme:'plate'},
 { id:'credit-card-advisor',name:'Credit Card Advisor',category:'03 / PRODUCT EXPERIMENT',title:'Better decisions, without the black box.',description:'A rule-based advisor built with Claude Code. An experiment in product judgment, AI-assisted development, and responsible recommendations.',note:'Prototype · Manual card-data snapshot · No adoption claims',theme:'credit'}
];
export const experiences: Experience[] = [
 {company:'IBM',role:'Product Management Intern',context:'watsonx.data Intelligence'},
 {company:'Avion Wealth',role:'Product Strategy Intern'},
 {company:'Drink Barcode',role:'Product Management Intern'},
 {company:'Adobe',role:'Product Management & Strategy',context:'Student Insider'},
 {company:'Texas Convergent',role:'Product Lead',context:'Digital Arts & Media Team'},
 {company:'Texas Consulting / HP',role:'Technical Lead Developer',context:'Client project'}
];
export type ArchiveEntry = { id: string; title: string; category: string; visibility: 'draft' | 'public'; cover?: string; alt?: string; story?: string };
export const archive: ArchiveEntry[] = [
 {id:'outside',title:'The long way around.',category:'TRAVEL & OUTDOORS',visibility:'draft'},
 {id:'everyday',title:'Worth keeping.',category:'PEOPLE & EVERYDAY LIFE',visibility:'draft'},
 {id:'curiosity',title:'Off the clock.',category:'TENNIS, FOOD & CURIOSITY',visibility:'draft'}
];
