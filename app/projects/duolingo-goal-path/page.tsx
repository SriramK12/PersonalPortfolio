// Duolingo Goal Path case study. Every fact here comes from the owner's case-study brief and its
// assets (content/duolingo-goal-path.json, the deck and the screens). Don't add or "improve" facts.
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import ReviewChart from '@/components/case-study/ReviewChart';
import { BackIcon, ExternalIcon, FileIcon } from '@/components/Icons';
import { Item, Page } from '@/components/Panel';
import data from '@/content/duolingo-goal-path.json';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const dir = `${base}/media/projects/duolingo-goal-path`;
const deck = `${dir}/goal-path-deck.pdf`;
const summary = "Let a learner's goal pick the situations they practice. A solo A/PM take-home exercise on Duolingo: 5 interviews, 500 App Store reviews, a feature spec, two screen mockups and a validation plan. Submitted; not built or shipped.";

export const metadata: Metadata = {
  title: { absolute: 'Duolingo Goal Path | Sriram Kakumanu' },
  description: summary,
  openGraph: { title: 'Duolingo Goal Path | Sriram Kakumanu', description: summary, images: [{ url: '/media/projects/duolingo-goal-path/og.jpg', width: 1200, height: 630 }] },
};

/** A phone screen (900px source, 450px variant). */
function Screen({ name, alt, eager = false }: { name: string; alt: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${dir}/${name}.jpg`}
      srcSet={`${dir}/${name}-450.jpg 450w, ${dir}/${name}.jpg 900w`}
      sizes="(max-width: 700px) 45vw, 300px"
      width={900}
      height={name.startsWith('flow') ? 1702 : 1819}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

function Section({ id, n, title, takeaway, children }: { id: string; n?: number; title: string; takeaway: string; children: ReactNode }) {
  return (
    <Item as="div" className="cs-section" id={id}>
      <section aria-labelledby={`${id}-title`}>
        <h2 id={`${id}-title`}>{n !== undefined && <span className="cs-num">{n}</span>}{title}</h2>
        {children}
        <p className="cs-takeaway"><strong>{takeaway}</strong></p>
      </section>
    </Item>
  );
}

const Planned = () => <span className="cs-planned">Planned</span>;

const slides = [
  { n: 1, caption: 'The problem: the five interviews and the review breakdown.', alt: 'Slide 1, The Problem: a table of five interviewees with their streaks and the issues they mentioned, and a pie chart of the main issue in 233 App Store reviews.' },
  { n: 2, caption: 'The KPI and the big idea: DAU, lessons per DAU, and "Your goal picks the situations you learn."', alt: 'Slide 2, The KPI and Big Idea: DAU of 58.7M in Q2 2026 with lessons per DAU as the driver, and the idea of moving from "Order a coffee" to "Ask for directions" for a Travel goal.' },
  { n: 3, caption: 'The feature: the new goals screen inside the existing onboarding flow.', alt: 'Slide 3, The Feature: four onboarding screens in order, with the goals screen marked as a new feature and the other three as existing features.' },
  { n: 4, caption: 'The product specification: where it lives, how it works, conflicts solved and edge cases.', alt: 'Slide 4, The Product Specification: the Change goal dropdown and a Goal Unit on the path, with notes on where it lives, how it works, conflicts solved and edge cases.' },
  { n: 5, caption: 'Validation and the A/B test plan, with pass and stop criteria.', alt: 'Slide 5, Validation and A/B Test: two tests before building, pass and stop criteria, a 12-week timeline, and the A/B test design and decision rule.' },
];

export default function DuolingoGoalPath() {
  const { reviews, interviews, kpi } = data;

  return (
    <Page className="case-study">
      <Item>
        <Link href="/projects/" className="back-link"><BackIcon width={16} height={16} /> Projects</Link>
      </Item>

      {/* Summary */}
      <Item as="header" className="page-heading cs-summary">
        <p className="eyebrow">Case study · Product management exercise</p>
        <h1>Duolingo Goal Path: let a learner&apos;s goal pick the situations they practice</h1>
        <dl className="cs-facts">
          <div><dt>Project type</dt><dd>Product management exercise (A/PM take-home, Duolingo)</dd></div>
          <div><dt>Status</dt><dd><strong>Submitted as a take-home; not built or shipped.</strong></dd></div>
          <div><dt>Role</dt><dd>Solo. I did the user interviews, review analysis, problem choice, feature definition, screen mockups, KPI choice, and the validation and A/B plan.</dd></div>
          <div><dt>Result</dt><dd>Submitted as a 5-slide take-home. Not shipped, no measured results. Slide 5 is the plan to test it.</dd></div>
        </dl>
        <div className="button-row">
          <a className="button" href={deck} download>
            <FileIcon width={16} height={16} /> Read the submitted deck (PDF)
          </a>
        </div>
        <p className="cs-note">In the downloadable deck, interviewee usernames are replaced with Interviewee A to E.</p>
      </Item>

      {/* Final product, shown early */}
      <Item as="div" className="cs-final">
        <figure>
          <Screen name="path-with-goal-unit" alt="Redesigned learning path: regular units with a blue Goal Unit tagged Travel, titled Ask for directions, marked New." eager />
          <figcaption>A Goal Unit on the path, tagged with the learner&apos;s goal.</figcaption>
        </figure>
        <figure>
          <Screen name="change-goal-dropdown" alt="Redesigned language menu: a new Change goal dropdown set to Travel, shown above New courses." eager />
          <figcaption>Existing learners change their goal from the language menu, above New courses.</figcaption>
        </figure>
        <p className="cs-takeaway cs-big"><strong>Your goal picks the situations you learn.</strong></p>
      </Item>

      {/* Real vs planned */}
      <Item as="div" className="cs-section">
        <h2 className="cs-strip-title">What&apos;s real vs. what&apos;s planned</h2>
        <table className="cs-table cs-real">
          <thead><tr><th scope="col">Part</th><th scope="col">Status</th></tr></thead>
          <tbody>
            <tr><th scope="row">Interviews</th><td><span className="cs-done">Done</span> 5</td></tr>
            <tr><th scope="row">Review analysis</th><td><span className="cs-done">Done</span> 500 reviews</td></tr>
            <tr><th scope="row">Competitive scan</th><td><span className="cs-not">Not done</span></td></tr>
            <tr><th scope="row">Validation and outcomes</th><td><span className="cs-planned">Planned</span> not done</td></tr>
          </tbody>
        </table>
      </Item>

      <Section id="problem" n={1} title="A real problem" takeaway="The problem I chose: content generalization, because lessons don't match why someone is learning.">
        <p>The user is the Duolingo learner with a goal (travel, media, work, family), not &quot;language learners&quot; in general. Their pain point: lessons are generalized and don&apos;t match why they&apos;re learning.</p>
        <p>The problem I chose was <strong>content generalization</strong>. Why: it&apos;s an issue I have personally, 3 of 5 interviewees raised it, and it shows up in the reviews.</p>
        <h3>Evidence</h3>
        <ul>
          <li>5 interviews (see Original research).</li>
          <li>The 500 most recent US App Store reviews as of Oct 16: {reviews.with_issue} (47%) mention an issue and {reviews.no_complaint} have no complaint. Of those that mention one: {reviews.issue_breakdown_of_233.filter((s) => s.label !== 'Other').map((s) => `${s.label} ${s.pct}%`).join(', ')}, and Other {reviews.issue_breakdown_of_233.find((s) => s.label === 'Other')!.pct}%.</li>
          <li>Two interviewees with 1,000+ day streaks open the app mainly to keep the streak. One said why: the lessons aren&apos;t usable in real life.</li>
        </ul>
        <h3>Why it matters</h3>
        <p>Duolingo had 58.7M daily active users in Q2 2026, up 23% year over year (<a className="text-link" href={kpi.dau_source} target="_blank" rel="noopener noreferrer">Q2 FY26 filing <ExternalIcon width={13} height={13} /></a>). As an illustration of scale, not a forecast: +1% DAU is about +587K daily learners.</p>
      </Section>

      <Section id="research" n={2} title="Original research" takeaway="Small and informal: 5 interviews and 500 hand-tagged reviews, with no competitive scan.">
        <h3>5 interviews</h3>
        <div className="cs-table-wrap">
          <table className="cs-table">
            <thead><tr><th scope="col">Interviewee</th><th scope="col">Status</th><th scope="col">Streak</th><th scope="col">Issues raised</th></tr></thead>
            <tbody>
              {interviews.map((p) => (
                <tr key={p.id}>
                  <th scope="row">{p.id}</th>
                  <td>{p.status}</td>
                  <td>{p.streak_days ? `${p.streak_days.toLocaleString()} days` : '-'}</td>
                  <td>{p.issues.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>3 of 5 raised content generalization. 3 were active users with 900 to 1,264 day streaks; 1 was not active (finished his Spanish class, no longer needs it); 1 uses it on and off (lost interest in the streak, can&apos;t hold a conversation in real life).</p>

        <h3>500 App Store reviews</h3>
        <p>Main issue in the {reviews.with_issue} reviews that mention one.</p>
        <ReviewChart slices={reviews.issue_breakdown_of_233} total={reviews.with_issue} />
        <p className="cs-note">Issue tags are my own judgment, one issue per review, so counts are approximate.</p>
        <p>A limit of this evidence: the 11% content slice is broader than &quot;too generic.&quot; In my own stricter read, only 8 of the 26 (about 3% of the 233) explicitly call the content too generic or irrelevant. The rest are about grammar explanations, repetition, or floods of new words after course updates.</p>

        <h3>Competitive scan</h3>
        <p><span className="cs-not">Not done</span> I did not do a formal competitive scan for this exercise. That&apos;s a gap I would close first.</p>
      </Section>

      <Section id="scope" n={3} title="Scope and decisions" takeaway="The minimal version: one course, Travel only, 3 Goal Units built from existing exercise types.">
        <p><strong>Problem statement:</strong> lessons are general, so learners can&apos;t use them in real life. Goal Path lets learners pick a goal and see lessons built around it.</p>
        <p><strong>Success metric:</strong> DAU is the headline (58.7M, Q2 2026). The driver metric is lessons per DAU. The deck links lessons per DAU to DAU, but that link isn&apos;t proven in the deck (see the reflection).</p>
        <p><strong>What comes first (the proposal):</strong> one course, Travel only, 3 Goal Units built from existing exercise types. Everything else is cut for now: other goals (Media, Work, Family) beyond picking them, and new exercise types. Why that cut: it&apos;s scoped for an intern project (about 12 weeks).</p>
        <h3>Design decisions</h3>
        <ul>
          <li>New learners get the goal question at course start. Existing learners tap the language icon, then &quot;Change goal&quot; above &quot;New courses.&quot;</li>
          <li>Goals: General, Travel, Media, Work, Family.</li>
          <li>Goal Units appear on the path with a &quot;Goal&quot; tag. About 1 in 3 units is a Goal Unit (a placeholder ratio, not tested).</li>
          <li>General lessons stay: the ones every goal shares, like greetings and goodbyes. Nothing is lost.</li>
          <li>&quot;Find my level&quot; still runs first; the goal layers on top.</li>
          <li>Energy, XP and streak work like any lesson. Changing goals keeps all progress.</li>
          <li>Edge cases: General or no goal gives the default path; a course with no goal content gives the default path; learners who want grammar basics still get them through the general lessons; goal changes are capped at 1 per week.</li>
        </ul>
        <p><strong>Constraints:</strong> 5 interviews, one person&apos;s judgment on review tagging, no access to Duolingo&apos;s internal data, and a take-home with no build.</p>
      </Section>

      <Section id="process" n={4} title="Process" takeaway="One real tradeoff: keep general lessons alongside goal lessons instead of replacing them.">
        <p>The goals screen is added to onboarding; existing learners get a &quot;Change goal&quot; dropdown; Goal Units then appear on the path.</p>
        <ol className="cs-flow">
          {[
            { n: 1, label: 'Existing feature', alt: 'Existing onboarding screen: How much Latin do you know?, with five levels from I am new to Latin to I can discuss most topics in detail.', caption: '"How much Latin do you know?"' },
            { n: 2, label: 'New feature', alt: 'New onboarding screen: What are your goals for learning Latin?, with General, Travel, Media consumption, Work and Family.', caption: '"What are your goals for learning Latin?" My new goals screen.' },
            { n: 3, label: 'Existing feature', alt: 'Existing onboarding screen: Where would you like to start?, with Start from scratch and Find my level.', caption: '"Where would you like to start?"' },
            { n: 4, label: 'Existing feature', alt: 'Existing onboarding screen: Okay! Get ready for Unit 1 Lesson 1.', caption: '"Okay! Get ready for Unit 1."' },
          ].map((f) => (
            <li key={f.n} className={f.label === 'New feature' ? 'is-new' : undefined}>
              <span className={f.label === 'New feature' ? 'cs-badge is-new' : 'cs-badge'}>{f.label}</span>
              <Screen name={`flow-${f.n}`} alt={f.alt} />
              <span className="cs-flow-caption">{f.caption}</span>
            </li>
          ))}
        </ol>
        <p><span className="cs-not">Not shown</span> I didn&apos;t document early sketches or rejected alternatives for this exercise.</p>
        <h3>The submitted deck</h3>
        <ol className="cs-slides">
          {slides.map((s) => (
            <li key={s.n}>
              <a href={`${dir}/slide-${s.n}.jpg`} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${dir}/slide-${s.n}-960.jpg`} srcSet={`${dir}/slide-${s.n}-960.jpg 960w, ${dir}/slide-${s.n}.jpg 1920w`} sizes="(max-width: 900px) 100vw, 560px" width={1920} height={1080} alt={s.alt} loading="lazy" decoding="async" />
              </a>
              <span><b>Slide {s.n}.</b> {s.caption}</span>
            </li>
          ))}
        </ol>
        <p><a className="text-link" href={deck} download>Read the submitted deck (PDF) <FileIcon width={14} height={14} /></a></p>
      </Section>

      <Section id="validation" n={5} title="Validation" takeaway="Pass and stop criteria are set before anything gets built.">
        <p><span className="cs-not">Not done</span> <strong>I have not tested this with real people.</strong> What exists is the validation plan from slide 5.</p>
        <dl className="cs-plan">
          <div><dt>Big bet <Planned /></dt><dd>Learners do more lessons when scenarios match why they&apos;re learning.</dd></div>
          <div><dt>Test 1 <Planned /></dt><dd>Talk to 60 learners (20 daily, 20 on-and-off, 20 who quit) with a clickable Goal Path mockup.</dd></div>
          <div><dt>Test 2 <Planned /></dt><dd>Check the app itself: set up the same course with a &quot;travel&quot; goal and a &quot;career&quot; goal and compare the first 3 units, to see whether Duolingo already tailors early units.</dd></div>
          <div><dt>Pass <Planned /></dt><dd>About two thirds (40 of 60) pick the Goal Unit and find it more useful, and some who quit say they&apos;d come back.</dd></div>
          <div><dt>Stop <Planned /></dt><dd>Fewer than 20 of 60 prefer it, or Duolingo already tailors the first units.</dd></div>
          <div><dt>Timeline <Planned /></dt><dd>Intern scale: weeks 1 to 2 test, weeks 3 to 8 build 3 Goal Units, weeks 9 to 12 run the A/B test.</dd></div>
        </dl>
      </Section>

      <Section id="outcomes" n={6} title="Outcomes" takeaway="The only real outcome is the submitted deck.">
        <p><strong>No outcomes. Nothing was shipped or tested.</strong> Below is the planned measurement from slide 5.</p>
        <dl className="cs-plan">
          <div><dt>A/B test <Planned /></dt><dd>One course, Travel only, 3 Goal Units. 5% of new learners in one country for 4 weeks; half get today&apos;s path, half get Goal Path.</dd></div>
          <div><dt>Primary <Planned /></dt><dd>Lessons per daily learner, and whether they&apos;re still around a month later.</dd></div>
          <div><dt>Also watching <Planned /></dt><dd>Goal Unit starts and finishes, goal switches, and coming back after a week.</dd></div>
          <div><dt>Must hold steady <Planned /></dt><dd>Finishing general lessons, Super upgrades, app crashes.</dd></div>
          <div><dt>Tracking events <Planned /></dt><dd><code>goal_selected</code>, <code>goal_changed</code>, <code>goal_unit_started</code>, <code>goal_unit_completed</code>, <code>goal_unit_skipped</code></dd></div>
          <div><dt>Decision rule <Planned /></dt><dd>Ship it if learners do more lessons and nothing above gets worse. Tweak it if they finish Goal Units but do no more lessons. Drop it if most skip them.</dd></div>
        </dl>
        <p>The real outcome: the deck itself, submitted.</p>
      </Section>

      <Section id="reflection" n={7} title="Role and reflection" takeaway="Scope small, set pass and stop criteria first, and be clear about what the evidence does and doesn't support.">
        <p><strong>Role:</strong> solo. I owned the interviews, review analysis, problem choice, feature definition, mockups, metric choice and test plan. There was no build or launch.</p>
        <h3>What I&apos;d do differently</h3>
        <ol className="cs-reflect">
          <li><strong>The DAU link.</strong> The deck picks DAU with lessons per DAU as the driver, but the slides never show why more lessons per user would raise DAU. I would add that mechanism, or pick a metric the feature more directly moves.</li>
          <li><strong>Preference vs. behavior.</strong> The pass bar in Test 1 counts learners who say they prefer the Goal Unit. What they say and what they do can differ, so the A/B test is the real check.</li>
          <li><strong>New learners vs. veterans.</strong> The A/B test targets new learners, but most of my evidence comes from long-streak users. Those are different groups.</li>
          <li><strong>Evidence breadth.</strong> The 11% content slice is broader than strict &quot;too generic&quot; complaints (about 3% by my stricter read).</li>
          <li><strong>Sample size.</strong> Five interviews and one reviewer&apos;s tagging is thin. I would add more interviews and a second person to tag reviews.</li>
          <li><strong>Competitive scan and early sketches.</strong> Do these first next time.</li>
          <li><strong>Existing tailoring risk.</strong> Duolingo&apos;s &quot;why are you learning&quot; onboarding may already tailor early lessons. Test 2 exists to check it, and I&apos;d run that first.</li>
        </ol>
        <h3>What I learned</h3>
        <ul>
          <li>Scoping to an intern-sized project.</li>
          <li>Defining pass and stop criteria before building.</li>
          <li>Being clear about what the evidence does and doesn&apos;t support.</li>
        </ul>
      </Section>

      <Item className="cs-end">
        <Link href="/projects/" className="back-link"><BackIcon width={16} height={16} /> Back to projects</Link>
        <p className="cs-disclaimer">Independent exercise. Not affiliated with, endorsed by, or built for Duolingo. Duolingo and related marks belong to Duolingo, Inc. Screens marked &quot;new&quot; are my own mockups.</p>
      </Item>
    </Page>
  );
}
