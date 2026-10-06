export type DeskObject = { id: string; label: string; subtitle: string; kind: 'notebook' | 'receipt' | 'card' | 'journal' | 'tennis' | 'print'; x: number; y: number; rotation: number; text: string; detail: string; href?: string; linkLabel?: string };
export const deskObjects: Record<'work' | 'life', DeskObject[]> = {
 work: [
  {id:'study',label:'StudySense',subtitle:'AI tutoring',kind:'notebook',x:12,y:13,rotation:-12,text:'Aha!',detail:'Personalized AI tutoring.',href:'https://www.studysense.org/',linkLabel:'Visit StudySense'},
  {id:'plate',label:'PlateConnect',subtitle:'Food redistribution',kind:'receipt',x:53,y:9,rotation:9,text:'Plate\nConnect',detail:'An iOS product connecting surplus restaurant food with food banks and charities. The product tension: fast reporting for restaurants, enough detail for coordinators.',href:'#plateconnect',linkLabel:'Try the tradeoff'},
  {id:'advisor',label:'Credit Card Advisor',subtitle:'Rule-based prototype',kind:'card',x:38,y:56,rotation:-8,text:'Credit Card\nAdvisor',detail:'Rule-based prototype built with Claude Code. Uses a manual card-data snapshot.',href:'#credit-card-advisor',linkLabel:'Read the overview'}
 ],
 life: [
  {id:'field',label:'Field notes',subtitle:'Travel & outdoors',kind:'journal',x:10,y:10,rotation:-9,text:'Field\nnotes',detail:'Travel & outdoors. Archive coming soon.'},
  {id:'tennis',label:'Off the clock',subtitle:'Tennis & curiosity',kind:'tennis',x:57,y:13,rotation:13,text:'Tennis',detail:'Tennis.'},
  {id:'moments',label:'Worth keeping',subtitle:'People & everyday life',kind:'print',x:32,y:54,rotation:6,text:'Photography',detail:'Personal photography. Archive coming soon.'}
 ]
};
