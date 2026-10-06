export type DeskObject = { id: string; label: string; subtitle: string; kind: 'notebook' | 'receipt' | 'card' | 'journal' | 'tennis' | 'print'; x: number; y: number; rotation: number; text: string; detail: string; href?: string; linkLabel?: string };
export const deskObjects: Record<'work' | 'life', DeskObject[]> = {
 work: [
  {id:'study',label:'StudySense',subtitle:'Learning, reconsidered',kind:'notebook',x:12,y:13,rotation:-12,text:'Aha!',detail:'Personalized AI tutoring, shaped around how people learn. Open the public product, or keep scrolling for the selected-work overview.',href:'https://www.studysense.org/',linkLabel:'Visit StudySense'},
  {id:'plate',label:'PlateConnect',subtitle:'Small friction. Big consequences.',kind:'receipt',x:53,y:9,rotation:9,text:'Good food.\nNext stop.',detail:'An iOS product connecting surplus restaurant food with food banks and charities. The product tension: fast reporting for restaurants, enough detail for coordinators.',href:'#plateconnect',linkLabel:'Try the tradeoff'},
  {id:'advisor',label:'Credit Card Advisor',subtitle:'An experiment in product judgment',kind:'card',x:38,y:56,rotation:-8,text:'Consider\nyour options.',detail:'A rule-based advisor built with Claude Code, using a manual snapshot of card data. A product experiment, with no adoption claims.',href:'#credit-card-advisor',linkLabel:'Read the overview'}
 ],
 life: [
  {id:'field',label:'Field notes',subtitle:'Travel & outdoors',kind:'journal',x:10,y:10,rotation:-9,text:'Take the\nlong way.',detail:'The start of a personal archive for travel and outdoor stories. This illustrated notebook is a placeholder; personal photographs and captions are still to come.'},
  {id:'tennis',label:'Off the clock',subtitle:'Tennis & curiosity',kind:'tennis',x:57,y:13,rotation:13,text:'One more\nset?',detail:'Tennis is one of the interests named in the supplied brief. This is an illustrated object, not a claim about a particular match or event.'},
  {id:'moments',label:'Worth keeping',subtitle:'People & everyday life',kind:'print',x:32,y:54,rotation:6,text:'A little\nless ordinary.',detail:'A space for photographs of people, everyday moments, and small discoveries. Owner-approved imagery will replace this graphic placeholder.'}
 ]
};
