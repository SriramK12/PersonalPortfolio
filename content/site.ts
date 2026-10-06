export type Project={id:string;name:string;summary:string;description:string;label:string;href?:string;details:{label:string;value:string}[]};
export type Experience={company:string;role:string;context?:string};
// Source: owner-supplied master brief. Disputed metrics and ownership are omitted.
export const profile={name:'Sriram Kakumanu',school:'The University of Texas at Austin',classYear:'2028',github:'https://github.com/SriramK12'};
export const projects:Project[]=[
 {id:'studysense',name:'StudySense',summary:'Personalized AI tutoring.',description:'A personalized AI tutoring product. Real-time voice tutoring was prioritized from direct user interviews.',label:'Learning',href:'https://www.studysense.org/',details:[{label:'Product',value:'Personalized AI tutoring'},{label:'Stack',value:'Django, React, PostgreSQL'}]},
 {id:'plateconnect',name:'PlateConnect',summary:'Surplus food redistribution.',description:'An iOS product connecting surplus restaurant food with food banks and charities.',label:'Food systems',details:[{label:'Problem',value:'Restaurants need fast reporting. Coordinators need enough detail to decide on a pickup.'},{label:'Approach',value:'Photo-based reporting, low-friction quantity input, matching by proximity and urgency, and in-app messaging.'}]},
 {id:'credit-card-advisor',name:'Credit Card Advisor',summary:'Rule-based recommendations.',description:'A rule-based credit card advisor built with Claude Code.',label:'Prototype',details:[{label:'Implementation',value:'AI-assisted, built with Claude Code'},{label:'Data',value:'Manual card-data snapshot'},{label:'Status',value:'Prototype. No live demo or verified user adoption.'}]}
];
export const experiences:Experience[]=[
 {company:'IBM',role:'Product Management Intern',context:'watsonx.data Intelligence'},
 {company:'Avion Wealth',role:'Product Strategy Intern'},
 {company:'Drink Barcode',role:'Product Management Intern'},
 {company:'Adobe',role:'Product Management & Strategy',context:'Student Insider'},
 {company:'Texas Convergent',role:'Product Lead',context:'Digital Arts & Media Team'},
 {company:'Texas Consulting / HP',role:'Technical Lead Developer',context:'Client project'}
];
