import { useState, useEffect, useRef } from "react";

// ─── TEAMS ────────────────────────────────────────────────────────────────────
// Returns team color info — bright colors used as accent, dark colors used as hero bg with white text
function getTeamColors(hex, factionAccent) {
  try {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const brightness = (r*299 + g*587 + b*114) / 1000;
    if (brightness >= 140) {
      // Bright color — use as accent on dark/light backgrounds
      return { accent: hex, heroBg: hex, heroText: "#111", useWhiteText: false };
    } else if (brightness >= 30) {
      // Dark saturated color (Dodger blue, Red Sox red) — use as hero background with white text
      return { accent: "#fff", heroBg: hex, heroText: "#fff", useWhiteText: true };
    } else {
      // Too dark — fall back to faction color
      return { accent: factionAccent, heroBg: factionAccent, heroText: "#111", useWhiteText: false };
    }
  } catch { return { accent: factionAccent, heroBg: factionAccent, heroText: "#111", useWhiteText: false }; }
}

const MLB_TEAMS = [
  { id:108, name:"Los Angeles Angels",    city:"Anaheim",       abbr:"LAA", color:"#BA0021", lat:33.8003, lng:-117.8827, rival:"Houston Astros",        house:"The Angels of Anaheim" },
  { id:109, name:"Arizona Diamondbacks",  city:"Phoenix",       abbr:"ARI", color:"#A71930", lat:33.4484, lng:-112.0740, rival:"Los Angeles Dodgers",    house:"House Serpent of the Desert" },
  { id:110, name:"Baltimore Orioles",     city:"Baltimore",     abbr:"BAL", color:"#DF4601", lat:39.2904, lng:-76.6122,  rival:"New York Yankees",      house:"The Orange Watch of the Chesapeake" },
  { id:111, name:"Boston Red Sox",        city:"Boston",        abbr:"BOS", color:"#BD3039", lat:42.3601, lng:-71.0589,  rival:"New York Yankees",      house:"The Crimson Fellowship of Fenway" },
  { id:112, name:"Chicago Cubs",          city:"Chicago",       abbr:"CHC", color:"#0E3386", lat:41.8781, lng:-87.6298,  rival:"St. Louis Cardinals",   house:"The Wrigley Keep" },
  { id:113, name:"Cincinnati Reds",       city:"Cincinnati",    abbr:"CIN", color:"#C6011F", lat:39.1031, lng:-84.5120,  rival:"St. Louis Cardinals",   house:"The Red Legion of the Ohio" },
  { id:114, name:"Cleveland Guardians",   city:"Cleveland",     abbr:"CLE", color:"#E31937", lat:41.4993, lng:-81.6944,  rival:"Chicago White Sox",     house:"Guardians of the North Shore" },
  { id:115, name:"Colorado Rockies",      city:"Denver",        abbr:"COL", color:"#C4CED4", lat:39.7392, lng:-104.9903, rival:"Arizona Diamondbacks",  house:"The Mountain Realm of Coors" },
  { id:116, name:"Detroit Tigers",        city:"Detroit",       abbr:"DET", color:"#FA4616", lat:42.3314, lng:-83.0458,  rival:"Cleveland Guardians",   house:"The Tigers of Motor City" },
  { id:117, name:"Houston Astros",        city:"Houston",       abbr:"HOU", color:"#EB6E1F", lat:29.7604, lng:-95.3698,  rival:"Texas Rangers",         house:"The Star Seekers of the South" },
  { id:118, name:"Kansas City Royals",    city:"Kansas City",   abbr:"KC", color:"#7BB2DD",  lat:39.0997, lng:-94.5786,  rival:"St. Louis Cardinals",   house:"The Royal Court of the Heartland" },
  { id:119, name:"Los Angeles Dodgers",   city:"Los Angeles",   abbr:"LAD", color:"#005A9C", lat:34.0522, lng:-118.2437, rival:"San Francisco Giants",  house:"The Blue Empire of Chavez Ravine" },
  { id:120, name:"Washington Nationals",  city:"Washington",    abbr:"WSH", color:"#14225A", lat:38.9072, lng:-77.0369,  rival:"Atlanta Braves",        house:"The Capitol Guard" },
  { id:121, name:"New York Mets",         city:"New York",      abbr:"NYM", color:"#FF5910", lat:40.7128, lng:-74.0060,  rival:"New York Yankees",      house:"The Amazin Order of Queens" },
  { id:133, name:"Oakland Athletics",     city:"Oakland",       abbr:"OAK", color:"#EFB21E", lat:37.8044, lng:-122.2712, rival:"San Francisco Giants",  house:"The Wandering Mercenaries" },
  { id:134, name:"Pittsburgh Pirates",    city:"Pittsburgh",    abbr:"PIT", color:"#FDB827", lat:40.4406, lng:-79.9959,  rival:"St. Louis Cardinals",   house:"The Buccaneers of Three Rivers" },
  { id:135, name:"San Diego Padres",      city:"San Diego",     abbr:"SD", color:"#FFC425",  lat:32.7157, lng:-117.1611, rival:"Los Angeles Dodgers",   house:"The Friars of Petco" },
  { id:136, name:"Seattle Mariners",      city:"Seattle",       abbr:"SEA", color:"#005C5C", lat:47.6062, lng:-122.3321, rival:"Houston Astros",        house:"The Mariners of the Emerald North" },
  { id:137, name:"San Francisco Giants",  city:"San Francisco", abbr:"SF", color:"#FD5A1E",  lat:37.7749, lng:-122.4194, rival:"Los Angeles Dodgers",   house:"The Giants of Oracle Bay" },
  { id:138, name:"St. Louis Cardinals",   city:"St. Louis",     abbr:"STL", color:"#C41E3A", lat:38.6270, lng:-90.1994,  rival:"Chicago Cubs",          house:"The Cardinal Lords of the Gateway" },
  { id:139, name:"Tampa Bay Rays",        city:"Tampa",         abbr:"TB", color:"#8FBCE6",  lat:27.9506, lng:-82.4572,  rival:"New York Yankees",      house:"The Rays of the Suncoast" },
  { id:140, name:"Texas Rangers",         city:"Dallas",        abbr:"TEX", color:"#C0111F", lat:32.7767, lng:-96.7970,  rival:"Houston Astros",        house:"The Rangers of the Lone Star" },
  { id:141, name:"Toronto Blue Jays",     city:"Toronto",       abbr:"TOR", color:"#E8291C", lat:43.6532, lng:-79.3832,  rival:"New York Yankees",      house:"The Northern Crown" },
  { id:142, name:"Minnesota Twins",       city:"Minneapolis",   abbr:"MIN", color:"#D31145", lat:44.9778, lng:-93.2650,  rival:"Cleveland Guardians",   house:"The Twin Guardians of the North" },
  { id:143, name:"Philadelphia Phillies", city:"Philadelphia",  abbr:"PHI", color:"#E81828", lat:39.9526, lng:-75.1652,  rival:"New York Mets",         house:"The Liberty Realm" },
  { id:144, name:"Atlanta Braves",        city:"Atlanta",       abbr:"ATL", color:"#CE1141", lat:33.7490, lng:-84.3880,  rival:"New York Mets",         house:"The Southern Dominion" },
  { id:145, name:"Chicago White Sox",     city:"Chicago",       abbr:"CWS", color:"#C4CED4", lat:41.8827, lng:-87.6233,  rival:"Chicago Cubs",          house:"The White Guard of the South Side" },
  { id:146, name:"Miami Marlins",         city:"Miami",         abbr:"MIA", color:"#00A3E0", lat:25.7617, lng:-80.1918,  rival:"Atlanta Braves",        house:"The Marlins of the Deep" },
  { id:147, name:"New York Yankees",      city:"New York",      abbr:"NYY", color:"#003087", lat:40.6892, lng:-74.0445,  rival:"Boston Red Sox",        house:"The Pinstripe Empire of the Bronx" },
  { id:158, name:"Milwaukee Brewers",     city:"Milwaukee",     abbr:"MIL", color:"#FFC52F", lat:43.0389, lng:-87.9065,  rival:"Chicago Cubs",          house:"The Brewers of the Great Lake" },
];

function haversine(la1,ln1,la2,ln2){const R=3959,dL=((la2-la1)*Math.PI)/180,dN=((ln2-ln1)*Math.PI)/180,a=Math.sin(dL/2)**2+Math.cos((la1*Math.PI)/180)*Math.cos((la2*Math.PI)/180)*Math.sin(dN/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function getCD(ds){if(!ds)return null;const diff=new Date(ds)-new Date();if(diff<0)return null;return{days:Math.floor(diff/86400000),hours:Math.floor((diff%86400000)/3600000),mins:Math.floor((diff%3600000)/60000)};}
function fmtDate(ds,opts){return ds?new Date(ds).toLocaleDateString("en-US",opts):"";}
function getOpp(game,teamName){if(!game?.teams)return"Unknown";return game.teams.away?.team?.name===teamName?game.teams.home?.team?.name??'?':game.teams.away?.team?.name??'?';}
function didWin(game,teamId){if(!game?.teams)return false;const h=game.teams.home,a=game.teams.away;return h?.team?.id===teamId?(h?.score??0)>(a?.score??0):(a?.score??0)>(h?.score??0);}
function extractStory(box,teamId){
  if(!box?.teams)return null;
  const isHome=box.teams.home?.team?.id===teamId;
  const my=isHome?box.teams.home:box.teams.away;
  const opp=isHome?box.teams.away:box.teams.home;
  if(!my)return null;
  const batters=Object.values(my.players||{}).filter(p=>p.stats?.batting?.atBats>0)
    .map(p=>({name:p.person?.fullName??"",h:p.stats.batting.hits??0,hr:p.stats.batting.homeRuns??0,rbi:p.stats.batting.rbi??0,ab:p.stats.batting.atBats??0}))
    .sort((a,b)=>(b.hr*3+b.rbi*2+b.h)-(a.hr*3+a.rbi*2+a.h)).slice(0,3);
  const pitchers=Object.values(my.players||{}).filter(p=>p.stats?.pitching?.inningsPitched)
    .map(p=>({name:p.person?.fullName??"",ip:p.stats.pitching.inningsPitched??"0",er:p.stats.pitching.earnedRuns??0,k:p.stats.pitching.strikeOuts??0,sv:p.stats.pitching.saves??0}))
    .sort((a,b)=>parseFloat(b.ip)-parseFloat(a.ip));
  return{batters,starter:pitchers[0]??null,closer:pitchers.find(p=>p.sv>0)??null,oppName:opp?.team?.name??""};
}

// ─── FACTION CONFIG ──────────────────────────────────────────────────────────
const LOTR_SVG = '<svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg"><rect width="680" height="340" fill="#080b14"/><circle cx="45" cy="18" r="1" fill="#fff" opacity=".6"/><circle cx="170" cy="12" r="1.5" fill="#fff" opacity=".7"/><circle cx="420" cy="20" r="1" fill="#fff" opacity=".6"/><circle cx="580" cy="14" r="1" fill="#fff" opacity=".7"/><circle cx="310" cy="55" r="1" fill="#fff" opacity=".4"/><ellipse cx="340" cy="80" rx="280" ry="60" fill="#0d0f1a" opacity=".8"/><circle cx="340" cy="110" r="72" fill="#3d0000" opacity=".4"/><circle cx="340" cy="110" r="60" fill="#5a0800" opacity=".5"/><circle cx="340" cy="110" r="50" fill="#f5f0e8"/><path d="M 305 92 Q 318 110 305 128" fill="none" stroke="#cc2200" stroke-width="2.5" stroke-linecap="round"/><path d="M 375 92 Q 362 110 375 128" fill="none" stroke="#cc2200" stroke-width="2.5" stroke-linecap="round"/><line x1="307" y1="96" x2="313" y2="98" stroke="#cc2200" stroke-width="1.5"/><line x1="306" y1="108" x2="312" y2="106" stroke="#cc2200" stroke-width="1.5"/><line x1="308" y1="120" x2="314" y2="122" stroke="#cc2200" stroke-width="1.5"/><line x1="373" y1="96" x2="367" y2="98" stroke="#cc2200" stroke-width="1.5"/><line x1="374" y1="108" x2="368" y2="106" stroke="#cc2200" stroke-width="1.5"/><line x1="372" y1="120" x2="366" y2="122" stroke="#cc2200" stroke-width="1.5"/><ellipse cx="340" cy="110" rx="28" ry="16" fill="#ff4400" opacity=".9"/><ellipse cx="340" cy="110" rx="8" ry="16" fill="#1a0000"/><ellipse cx="340" cy="158" rx="40" ry="12" fill="#ff4400" opacity=".35"/><polygon points="320,160 325,300 355,300 360,160" fill="#1a1a2a"/><polygon points="310,300 370,300 360,160 320,160" fill="#141420"/><polygon points="320,160 325,145 330,160" fill="#1a1a2a"/><polygon points="340,160 345,148 350,160" fill="#1a1a2a"/><polygon points="0,260 80,195 160,240 240,185 320,220 400,175 480,215 560,180 640,220 680,200 680,310 0,310" fill="#111825"/><rect x="0" y="295" width="680" height="45" fill="#0a0e18"/><rect x="50" y="278" width="3" height="22" fill="#080b14"/><circle cx="51" cy="276" r="4" fill="#080b14"/><rect x="51" y="258" width="3" height="8" fill="#5a3010" rx="1"/><ellipse cx="52" cy="257" rx="4" ry="2.5" fill="#5a3010"/><rect x="70" y="276" width="3" height="24" fill="#080b14"/><circle cx="71" cy="274" r="4" fill="#080b14"/><rect x="71" y="256" width="3" height="8" fill="#5a3010" rx="1"/><ellipse cx="72" cy="255" rx="4" ry="2.5" fill="#5a3010"/><rect x="90" y="279" width="3" height="21" fill="#080b14"/><circle cx="91" cy="277" r="4" fill="#080b14"/><rect x="91" y="259" width="3" height="8" fill="#5a3010" rx="1"/><ellipse cx="92" cy="258" rx="4" ry="2.5" fill="#5a3010"/><rect x="540" y="278" width="3" height="22" fill="#080b14"/><circle cx="541" cy="276" r="4" fill="#080b14"/><rect x="541" y="258" width="3" height="8" fill="#5a3010" rx="1"/><ellipse cx="542" cy="257" rx="4" ry="2.5" fill="#5a3010"/><rect x="185" y="218" width="55" height="32" fill="#1a1a2a" rx="2"/><rect x="188" y="221" width="49" height="26" fill="#0a0a14" rx="1"/><text x="212" y="233" font-family="monospace" font-size="8" fill="#FFE033" text-anchor="middle">W 4-2</text><text x="212" y="243" font-family="monospace" font-size="7" fill="#888" text-anchor="middle">BOT 9th</text><rect x="0" y="0" width="6" height="340" fill="#C9A84C"/><rect x="0" y="255" width="680" height="85" fill="#080b14" opacity=".55"/><text x="40" y="285" font-family="Arial Black,sans-serif" font-size="18" fill="#ffffff">One ball to rule them all.</text><text x="40" y="315" font-family="Georgia,serif" font-size="13" fill="rgba(255,255,255,0.5)" font-style="italic">The Eye sees your batting average.</text></svg>';
const SW_SVG = '<svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg"><rect width="680" height="340" fill="#04060f"/><circle cx="75" cy="42" r="1.5" fill="#fff" opacity=".5"/><circle cx="185" cy="55" r="1" fill="#fff" opacity=".6"/><circle cx="260" cy="28" r="1.5" fill="#fff" opacity=".8"/><circle cx="455" cy="22" r="1.5" fill="#fff" opacity=".6"/><circle cx="570" cy="16" r="1" fill="#fff" opacity=".5"/><circle cx="630" cy="38" r="1" fill="#fff" opacity=".7"/><circle cx="340" cy="130" r="88" fill="#1a1f35" opacity=".5"/><circle cx="340" cy="130" r="75" fill="#d8d4cc"/><path d="M 340 55 A 75 75 0 0 1 340 205" fill="#b8b4ac"/><line x1="265" y1="130" x2="415" y2="130" stroke="#c0bbb4" stroke-width="1.5" opacity=".6"/><path d="M 295 100 Q 310 130 295 160" fill="none" stroke="#cc2200" stroke-width="3" stroke-linecap="round"/><path d="M 385 100 Q 370 130 385 160" fill="none" stroke="#cc2200" stroke-width="3" stroke-linecap="round"/><line x1="297" y1="105" x2="305" y2="108" stroke="#cc2200" stroke-width="2"/><line x1="295" y1="121" x2="303" y2="119" stroke="#cc2200" stroke-width="2"/><line x1="295" y1="137" x2="303" y2="139" stroke="#cc2200" stroke-width="2"/><line x1="383" y1="105" x2="375" y2="108" stroke="#cc2200" stroke-width="2"/><line x1="385" y1="121" x2="377" y2="119" stroke="#cc2200" stroke-width="2"/><line x1="385" y1="137" x2="377" y2="139" stroke="#cc2200" stroke-width="2"/><circle cx="318" cy="112" r="18" fill="#c8c4bc" stroke="#a8a49c" stroke-width="1.5"/><circle cx="318" cy="112" r="4" fill="#606060"/><line x1="330" y1="112" x2="520" y2="200" stroke="#FFE033" stroke-width="2" opacity=".5"/><circle cx="540" cy="200" r="22" fill="#2a4a2a"/><path d="M 524 194 Q 530 200 524 206" fill="none" stroke="#cc2200" stroke-width="1.5"/><g transform="translate(480,155) rotate(25) scale(0.6)"><rect x="-3" y="-15" width="6" height="30" fill="#1a2035" rx="1"/><polygon points="-3,-4 -22,4 -22,11 -3,6" fill="#1a2035"/><polygon points="3,-4 22,4 22,11 3,6" fill="#1a2035"/><circle cx="0" cy="14" r="3" fill="#FFE033" opacity=".7"/></g><ellipse cx="340" cy="330" rx="480" ry="90" fill="#080c1a"/><rect x="130" y="275" width="3" height="35" fill="#0f1528"/><ellipse cx="131" cy="274" rx="5" ry="3" fill="#FFE033" opacity=".5"/><rect x="530" y="275" width="3" height="35" fill="#0f1528"/><ellipse cx="531" cy="274" rx="5" ry="3" fill="#FFE033" opacity=".5"/><rect x="0" y="0" width="6" height="340" fill="#FFE033"/><rect x="0" y="255" width="680" height="85" fill="#04060f" opacity=".6"/><text x="40" y="285" font-family="Arial Black,sans-serif" font-size="18" fill="#ffffff">That\'s no moon. That\'s a baseball.</text><text x="40" y="315" font-family="Georgia,serif" font-size="13" fill="rgba(255,255,255,0.5)" font-style="italic">Fully operational. Batting .240.</text></svg>';

const FACTIONS = {
  lotr: {
    id: "lotr",
    name: "Lord of the Rings",
    emoji: "⚔️",
    accent: "#C9A84C",
    accentBright: "#C9A84C",
    bg: "#F5F0E8",
    tagline: "One ring to explain them all.",
    oracleTitle: "THE PALANTÍR",
    storyTitle: "PREVIOUSLY IN THE CHRONICLE",
    battleTitle: "THE FELLOWSHIP'S BATTLE LOG",
    saySectionTitle: "SPEAK, FRIEND, AND ENTER THE CONVERSATION",
    intro: "Your season. Translated into Middle-earth.",
    sys: `You are a translator between baseball and Lord of the Rings. Everything gets explained through LOTR — mid-tier references: Faramir vs Boromir, the Rohirrim, Denethor losing his mind, Saruman's betrayal, Pelennor Fields, Helm's Deep, the Scouring of the Shire, Gollum. Not the Silmarillion.

The reference IS the explanation. "The bullpen has been pulling a Denethor — everyone can see it's unraveling but they keep adding fuel." Not a comparison — the reference carries the meaning.

Rules:
- Never explain the reference.
- Use real player names and stats when you have them.
- Dry. Let the LOTR parallel do the work.
- Full commitment. Never break character. Report it as news from the realm.
- Rename players in lore style when it lands. Ser Freeman. The Order of the Bullpen. The Hand of the Manager.
- Never say "like" or "similar to." State it as fact. He IS Aragorn. Just report it.
- Dry. Confident. Like WesterosCentral but for baseball.
- End every Oracle response with one line prefixed ⚔️ they can say at work.`,
  },
  sw: {
    id: "sw",
    name: "Star Wars",
    emoji: "🚀",
    accent: "#FFE033",
    accentBright: "#FFE033",
    bg: "#F5F2E8",
    tagline: "The Force is strong with this lineup.",
    oracleTitle: "THE HOLOCRON",
    storyTitle: "MISSION BRIEFING",
    battleTitle: "BATTLE RECORDS",
    saySectionTitle: "TRANSMIT THIS TO YOUR COWORKERS",
    intro: "Your season. Decoded by the Force.",
    sys: `You are a translator between baseball and Star Wars. Everything gets explained through Star Wars across all eras — the prequels (Anakin's fall, Order 66, Palpatine's manipulation), Clone Wars (Ahsoka, the Siege of Mandalore), the originals, the sequels. Not deep EU legends.

The reference IS the explanation. "The bullpen has been Order 66-ing every lead since April — executing perfectly good games with ruthless efficiency." Not a comparison — the reference carries the meaning.

Rules:
- Never explain the reference.
- Use real player names and stats when you have them.
- Dry. Let the Star Wars parallel do the work.
- Full commitment. Never break character. Report it as a HoloNet dispatch.
- Give players ranks and titles. Commander Freeman. The Bullpen Squadron. The Senate (front office).
- Never say "like" or "similar to." State it as fact. He IS a Jedi commander. Just report it.
- Dry. Confident. Like WesterosCentral but for Star Wars and baseball.
- End every Oracle response with one line prefixed ⚔️ they can say at work.`,
  },
};


// ─── FACTION-SPECIFIC PUNS ────────────────────────────────────────────────────
const PUNS_LOTR = [
  { quote: "One ring to rule them all, one ring to find them —", punchline: "turns out it was a curveball the whole time." },
  { quote: "A wizard is never late, nor is he early —", punchline: "he arrives precisely when the closer blows the save." },
  { quote: "You shall not pass!", punchline: "Said no catcher ever during a stolen base attempt." },
  { quote: "Not all those who wander are lost —", punchline: "but this lineup definitely left the base path." },
  { quote: "Even the smallest person can change the course of the future.", punchline: "The leadoff hitter agrees." },
  { quote: "I am no man.", punchline: "I am a designated hitter, and that distinction matters." },
  { quote: "All we have to decide is what to do with the at-bats given to us.", punchline: "This team has decided: swing at everything." },
  { quote: "My precious.", punchline: "Every manager, watching their closer's arm." },
  { quote: "Fly, you fools!", punchline: "— The third base coach, every single time." },
  { quote: "It is a gift to the foes of the bullpen.", punchline: "The closer agrees, and he works here." },
];

const PUNS_SW = [
  { quote: "Do or do not, there is no try.", punchline: "The bullpen did not get the memo." },
  { quote: "I find your lack of ERA disturbing.", punchline: "— Darth Vader, watching this rotation." },
  { quote: "It's a trap!", punchline: "— Admiral Ackbar, watching the infield shift." },
  { quote: "The dark side of the Force is a pathway to many abilities —", punchline: "including a .340 average in the clutch." },
  { quote: "I've got a bad feeling about this.", punchline: "— The manager, every time he calls the bullpen." },
  { quote: "Never tell me the odds.", punchline: "— This team's analytics department, apparently." },
  { quote: "That's no moon.", punchline: "That's a 500-foot home run. Same energy." },
  { quote: "Help me, Obi-Wan. You're my only hope.", punchline: "— The lineup, to the one guy hitting over .280." },
  { quote: "So this is how liberty dies — with thunderous applause.", punchline: "And also a walk-off wild pitch." },
  { quote: "In a dark place we find ourselves.", punchline: "We are at .500 in June. Yoda gets it." },
];

// ─── FUN LOADER ───────────────────────────────────────────────────────────────
const LOADER_MSGS = {
  lotr: {
    arc:      ["Consulting the Palantír...", "Asking Gandalf for context...", "Reading the scrolls of Minas Tirith...", "Translating the season into Westron..."],
    episodes: ["Naming the battles...", "Checking the Book of Mazarbul...", "Reviewing the campaign records...", "Asking the historians of Gondor..."],
    talking:  ["Forging your talking point...", "Channeling the wisdom of Rivendell...", "Preparing the briefing...", "Consulting the White Council..."],
    stats:    ["Summoning the data...", "Ravens incoming from the East...", "Awaiting word from the Grey Havens...", "Reading the signs..."],
  },
  sw: {
    arc:      ["Accessing the Holocron...", "Consulting the Jedi Archives...", "Decoding the mission briefing...", "Translating through the Force..."],
    episodes: ["Reviewing battle records...", "Checking the Imperial databanks...", "Scanning the mission logs...", "Pulling the holorecords..."],
    talking:  ["Transmitting your talking point...", "Encrypting the briefing...", "Preparing the intelligence report...", "Contacting Rebel Command..."],
    stats:    ["Downloading telemetry...", "Connecting to the HoloNet...", "Pinging the fleet...", "Reading sensor data..."],
  },
};

function EyeSpinner({ dark }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={{flexShrink:0}}>
      <style>{`
        @keyframes eyePulse{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.25)}}
        @keyframes fireFlicker{0%,100%{opacity:.9}50%{opacity:.4}}
        .ep{animation:eyePulse 2s ease-in-out infinite;transform-origin:50% 50%;transform-box:fill-box}
        .ff{animation:fireFlicker 1s ease-in-out infinite}
        .ff2{animation:fireFlicker 1s ease-in-out infinite;animation-delay:.3s}
      `}</style>
      <path d="M 8 48 Q 10 28 18 20 Q 14 32 16 48 Z" fill={dark?"#1a1020":"#2a1030"}/>
      <path d="M 40 48 Q 38 28 30 20 Q 34 32 32 48 Z" fill={dark?"#1a1020":"#2a1030"}/>
      <ellipse cx="24" cy="22" rx="16" ry="14" fill="#8B2500" opacity=".8"/>
      <ellipse cx="24" cy="22" rx="12" ry="10" fill="#cc3800" opacity=".9"/>
      <ellipse cx="24" cy="22" rx="10" ry="9" fill="#f5f0e8"/>
      <path d="M 16 18 Q 19 22 16 26" fill="none" stroke="#cc2200" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 32 18 Q 29 22 32 26" fill="none" stroke="#cc2200" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17" y1="19" x2="20" y2="20" stroke="#cc2200" strokeWidth="1"/>
      <line x1="17" y1="22" x2="20" y2="22" stroke="#cc2200" strokeWidth="1"/>
      <line x1="17" y1="25" x2="20" y2="24" stroke="#cc2200" strokeWidth="1"/>
      <line x1="31" y1="19" x2="28" y2="20" stroke="#cc2200" strokeWidth="1"/>
      <line x1="31" y1="22" x2="28" y2="22" stroke="#cc2200" strokeWidth="1"/>
      <line x1="31" y1="25" x2="28" y2="24" stroke="#cc2200" strokeWidth="1"/>
      <g className="ep">
        <ellipse cx="24" cy="22" rx="6" ry="4" fill="#ff4400" opacity=".95"/>
        <ellipse cx="24" cy="22" rx="2" ry="4" fill="#0d0000"/>
      </g>
      <circle className="ff" cx="24" cy="10" r="6" fill="#ff4400" opacity=".85"/>
      <circle className="ff2" cx="24" cy="10" r="4" fill="#FFE033" opacity=".9"/>
      <circle cx="24" cy="10" r="2" fill="#fff" opacity=".7"/>
    </svg>
  );
}

function DeathStarSpinner() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={{flexShrink:0}}>
      <style>{`
        @keyframes deathPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}}
        @keyframes laserCharge{0%{opacity:0;r:2px}70%{opacity:1;r:7px}100%{opacity:.3;r:4px}}
        .dp{animation:deathPulse 2.5s ease-in-out infinite;transform-origin:50% 50%;transform-box:fill-box}
        .lc{animation:laserCharge 2.5s ease-in-out infinite}
      `}</style>
      <g className="dp">
        <circle cx="24" cy="24" r="20" fill="#d8d4cc"/>
        <path d="M 24 4 A 20 20 0 0 1 24 44" fill="#b0aca8"/>
        <line x1="4" y1="24" x2="44" y2="24" stroke="#c0bbb4" strokeWidth="1.5"/>
        <path d="M 10 17 Q 16 24 10 31" fill="none" stroke="#cc2200" strokeWidth="2" strokeLinecap="round"/>
        <path d="M 38 17 Q 32 24 38 31" fill="none" stroke="#cc2200" strokeWidth="2" strokeLinecap="round"/>
        <line x1="11" y1="19" x2="15" y2="20" stroke="#cc2200" strokeWidth="1.5"/>
        <line x1="11" y1="23" x2="15" y2="23" stroke="#cc2200" strokeWidth="1.5"/>
        <line x1="11" y1="27" x2="15" y2="26" stroke="#cc2200" strokeWidth="1.5"/>
        <line x1="37" y1="19" x2="33" y2="20" stroke="#cc2200" strokeWidth="1.5"/>
        <line x1="37" y1="23" x2="33" y2="23" stroke="#cc2200" strokeWidth="1.5"/>
        <line x1="37" y1="27" x2="33" y2="26" stroke="#cc2200" strokeWidth="1.5"/>
        <circle cx="18" cy="16" r="6" fill="#c0bbb4" stroke="#989490" strokeWidth="1"/>
        <circle cx="18" cy="16" r="3.5" fill="#b0aba8"/>
        <circle cx="18" cy="16" r="1.5" fill="#555"/>
        <circle className="lc" cx="22" cy="16" r="4" fill="#FFE033" opacity=".8"/>
      </g>
    </svg>
  );
}

function FunLoader({ faction, type, dark }) {
  const f = faction || "sw";
  const msgs = LOADER_MSGS[f]?.[type] || LOADER_MSGS.sw.arc;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx(n => (n + 1) % msgs.length), 2200);
    return () => clearInterval(i);
  }, [f, type]);
  return (
    <div style={{display:"flex",gap:14,alignItems:"center",padding:"4px 0"}}>
      {faction==="lotr" ? <EyeSpinner dark={dark}/> : <DeathStarSpinner/>}
      <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:600,color:dark?"rgba(255,255,255,.5)":"#888",letterSpacing:.3}}>
        {msgs[idx]}
      </span>
    </div>
  );
}

function ShareButton({ text, faction }) {
  const f = FACTIONS[faction||"sw"];
  const url = "https://sports-lore.vercel.app";
  const [open, setOpen] = useState(false);
  const clean = (text||"").replace(/\*\*/g,"").trim();
  const encoded = encodeURIComponent(clean + " " + url);
  const tweetUrl = "https://twitter.com/intent/tweet?text=" + encoded;
  const threadsUrl = "https://www.threads.net/intent/post?text=" + encoded;
  const linkedinUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);

  function copyIt(){
    navigator.clipboard.writeText(clean + "\n" + url).then(()=>{
      setOpen(false);
      alert("Copied!");
    }).catch(()=>{});
  }

  return(
    <div style={{position:"relative",display:"inline-flex",flexShrink:0}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        background:f.accent,border:"2px solid #111",padding:"6px 14px",
        cursor:"pointer",fontFamily:"'Archivo Black',sans-serif",
        fontSize:10,letterSpacing:2,color:"#111",whiteSpace:"nowrap",
        display:"inline-flex",alignItems:"center",gap:5,
      }}>&#x2197; SHARE</button>
      {open&&(
        <>
          <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:998}}/>
          <div style={{position:"absolute",bottom:"110%",left:0,background:"#fff",border:"3px solid #111",zIndex:999,minWidth:200,boxShadow:"4px 4px 0 #111"}}>
            {[
              {label:"✕  Post on X / Twitter", url:tweetUrl},
              {label:"@  Post on Threads", url:threadsUrl},
              {label:"in  Post on LinkedIn", url:linkedinUrl},
            ].map((item,i)=>(
              <button key={i} onClick={()=>{window.open(item.url,"_blank");setOpen(false);}}
                style={{display:"block",width:"100%",padding:"12px 16px",background:"none",border:"none",borderBottom:"2px solid #111",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:700,textAlign:"left",color:"#111"}}
                onMouseOver={e=>e.currentTarget.style.background=f.accent}
                onMouseOut={e=>e.currentTarget.style.background="none"}>
                {item.label}
              </button>
            ))}
            <button onClick={copyIt}
              style={{display:"block",width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:700,textAlign:"left",color:"#111"}}
              onMouseOver={e=>e.currentTarget.style.background=f.accent}
              onMouseOut={e=>e.currentTarget.style.background="none"}>
              ⧉  Copy to clipboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function RotatingPun({ faction }) {
  const puns = faction === "lotr" ? PUNS_LOTR : PUNS_SW;
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * puns.length));
  const f = FACTIONS[faction] || FACTIONS.sw;
  useEffect(() => {
    setIdx(Math.floor(Math.random() * puns.length));
    const i = setInterval(() => setIdx(n => (n + 1) % puns.length), 6000);
    return () => clearInterval(i);
  }, [faction]);
  const p = puns[idx];
  return (
    <div onClick={() => setIdx(n => (n + 1) % puns.length)}
      style={{ background: "#111", border: "3px solid #111", padding: "28px 28px", cursor: "pointer", position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 16, fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "rgba(255,255,255,.2)" }}>
        TAP TO CYCLE ↻
      </div>
      <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 3, color: f.accent, marginBottom: 14, opacity: .8 }}>
        ⚾ WISDOM FROM THE LORE
      </div>
      <p style={{ fontFamily: "'Lora',serif", fontSize: "clamp(15px,2.2vw,20px)", lineHeight: 1.7, color: "rgba(255,255,255,.5)", fontStyle: "italic", marginBottom: 6 }}>
        &ldquo;{p.quote}
      </p>
      <p style={{ fontFamily: "'Lora',serif", fontSize: "clamp(15px,2.2vw,20px)", lineHeight: 1.7, color: f.accent, fontStyle: "italic", fontWeight: 600 }}>
        {p.punchline}&rdquo;
      </p>
    </div>
  );
}

function TeamSearch({value, onChange, results, onSelect, placeholder,}){
  return(
    <div style={{position:"relative"}}>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        autoComplete="off"
        style={{width:"100%",background:"#fff",border:"3px solid #111",color:"#111",padding:"14px 18px",
          fontFamily:"'Space Grotesk',sans-serif",fontSize:16,outline:"none",boxSizing:"border-box",WebkitAppearance:"none",fontWeight:600}}
        onFocus={e=>e.currentTarget.style.borderColor="#FFE033"}
        onBlur={e=>e.currentTarget.style.borderColor="#111"}
      />
      {results.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"3px solid #111",borderTop:"none",zIndex:100,maxHeight:280,overflowY:"auto"}}>
          {results.map(t=>(
            <button key={t.id} onClick={()=>onSelect(t)}
              style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",
                padding:"13px 18px",background:"none",border:"none",borderBottom:"2px solid #111",
                cursor:"pointer",textAlign:"left",minHeight:50,transition:"background .1s"}}
              onMouseOver={e=>e.currentTarget.style.background="#FFE033"}
              onMouseOut={e=>e.currentTarget.style.background="none"}>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:17,fontWeight:700,color:"#111"}}>{t.name}</span>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:500,color:"#555"}}>{t.city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
function Spin(){
  return <div style={{width:20,height:20,border:"3px solid #ddd",borderTopColor:"#FFE033",borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0}}/>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SportsLore(){
  const [phase,setPhase]       = useState("pick");  // pick | landing | team
  const [faction,setFaction]   = useState(null);    // "lotr" | "sw"
  const [team,setTeam]         = useState(null);
  const [search,setSearch]     = useState("");
  const [searchRes,setRes]     = useState([]);
  const [showSearch,setShowSearch] = useState(false);
  const [detecting,setDetecting]   = useState(false);

  // Data
  const [standings,setStandings]   = useState(null);
  const [divRows,setDivRows]       = useState([]);
  const [sched,setSched]           = useState({next:null,last:null,recent:[]});
  const [cd,setCd]                 = useState(null);
  const [richData,setRichData]     = useState(null);

  // Content
  const [talkingPoint,setTalkingPoint] = useState(null);
  const [arc,setArc]                   = useState(null);
  const [episodes,setEpisodes]         = useState([]);
  const [loading,setLoading]           = useState(false);

  // Oracle
  const [msgs,setMsgs]         = useState([]);
  const [oInput,setOInput]     = useState("");
  const [oLoading,setOLoading] = useState(false);

  const [mounted,setMounted] = useState(false);
  const [tick,setTick]       = useState(0);
  const chatEnd    = useRef(null);
  const richRef    = useRef(null);
  richRef.current  = richData;

  // auto-scroll removed

  useEffect(()=>{
    if(search.length>1){const q=search.toLowerCase();setRes(MLB_TEAMS.filter(t=>t.name.toLowerCase().includes(q)||t.city.toLowerCase().includes(q)||t.abbr.toLowerCase().includes(q)).slice(0,8));}
    else setRes([]);
  },[search]);

  useEffect(()=>{
    setDetecting(true);
    if(!navigator.geolocation){setDetecting(false);return;}
    navigator.geolocation.getCurrentPosition(
      ({coords:{latitude:la,longitude:ln}})=>{
        let c=MLB_TEAMS[0],m=Infinity;
        MLB_TEAMS.forEach(t=>{const d=haversine(la,ln,t.lat,t.lng);if(d<m){m=d;c=t;}});
        setDetecting(false);selectTeam(c);
      },
      ()=>setDetecting(false),{timeout:7000}
    );
  },[]);

  useEffect(()=>{if(team)loadTeam(team);},[team?.id]);

  // Re-fire oracle intro when faction changes (without re-fetching MLB data)
  useEffect(()=>{
    if(team && faction && richData){
      const c = buildCtx(team, standings, richData);
      setMsgs([]);
      fireOracleIntro(team, standings, sched.last, richData, faction);
    }
  },[faction]);

  function selectTeam(t){
    window.scrollTo(0,0);
    setTeam(t);setSearch("");setRes([]);setShowSearch(false);setPhase("team");
  }

  // ── DATA LOADING ─────────────────────────────────────────────────────────
  async function loadTeam(t){
    setLoading(true);
    setMsgs([]);setTalkingPoint(null);setArc(null);setEpisodes([]);
    setStandings(null);setDivRows([]);setSched({next:null,last:null,recent:[]});setRichData(null);

    try{
      const enc = encodeURIComponent;
      const [sRes,schRes] = await Promise.all([
        fetch("/api/mlb?path=" + enc("/api/v1/standings?leagueId=103,104&season=2026&standingsTypes=regularSeason")),
        fetch("/api/mlb?path=" + enc("/api/v1/schedule?teamId=" + t.id + "&season=2026&sportId=1&gameType=R")),
      ]);
      const [sData,schData] = await Promise.all([
        sRes.ok ? sRes.json() : Promise.resolve({}),
        schRes.ok ? schRes.json() : Promise.resolve({}),
      ]);

      let st=null, divTeams=[];
      sData.records?.forEach(div=>{
        const found=div.teamRecords?.find(r=>r.team.id===t.id);
        if(found){
          st={...found, divisionName:div.division?.name};
          divTeams=(div.teamRecords||[]).map(r=>({
            id:r.team.id, name:r.team.name, wins:r.wins, losses:r.losses,
            pct:r.winningPercentage, gb:r.gamesBack, isThis:r.team.id===t.id,
          }));
        }
      });
      setStandings(st);
      setDivRows(divTeams);

      const now=new Date();
      const games=schData.dates?.flatMap(d=>d.games||[])||[];
      // Only count games that are actually Final — not just past scheduled dates
      const todayEnd=new Date();todayEnd.setDate(todayEnd.getDate()+1);todayEnd.setHours(6,0,0,0);
      const finished=games.filter(g=>g.status?.abstractGameState==="Final"&&new Date(g.gameDate)<=todayEnd).sort((a,b)=>new Date(b.gameDate)-new Date(a.gameDate));
      const live=games.filter(g=>g.status?.abstractGameState==="Live");
      const upcoming=games.filter(g=>g.status?.abstractGameState==="Preview"||g.status?.detailedState==="Scheduled").sort((a,b)=>new Date(a.gameDate)-new Date(b.gameDate));
      const nextG=upcoming[0]??null;
      const lastG=live[0]??finished[0]??null;
      const recent=finished.slice(0,5);

      setSched({next:nextG, last:lastG, recent});
      if(nextG) setCd(getCD(nextG.gameDate));

      const [boxScores,[batRes,pitRes]] = await Promise.all([
        Promise.all(finished.slice(0,3).map(g=>
          g.gamePk
            ? fetch("/api/mlb?path=" + enc("/api/v1/game/" + g.gamePk + "/boxscore")).then(r=>r.ok?r.json():null).catch(()=>null)
            : Promise.resolve(null)
        )),
        Promise.all([
          fetch("/api/mlb?path=" + enc("/api/v1/teams/" + t.id + "/stats?stats=season&group=hitting&season=2026")).catch(()=>null),
          fetch("/api/mlb?path=" + enc("/api/v1/teams/" + t.id + "/stats?stats=season&group=pitching&season=2026")).catch(()=>null),
        ]),
      ]);

      const gameStories=boxScores.map(box=>extractStory(box,t.id));
      let teamBatting=null, teamPitching=null;
      try{
        if(batRes?.ok){const d=await batRes.json();teamBatting=d.stats?.[0]?.splits?.[0]?.stat??null;}
        if(pitRes?.ok){const d=await pitRes.json();teamPitching=d.stats?.[0]?.splits?.[0]?.stat??null;}
      }catch(e){}

      const rd={gameStories, teamBatting, teamPitching};
      setRichData(rd);
      richRef.current=rd;

      await Promise.all([
        generateContent(t, st, nextG, lastG, recent, rd, faction),
        fireOracleIntro(t, st, nextG, lastG, rd, faction),
      ]);

    }catch(e){
      console.error("loadTeam error:",e);
      const rd={gameStories:[], teamBatting:null, teamPitching:null};
      setRichData(rd);
      richRef.current=rd;
      await Promise.all([
        generateContent(t, null, null, null, [], rd, faction),
        fireOracleIntro(t, null, null, rd, faction),
      ]);
    }
    setLoading(false);
  }

  // ── BUILD CONTEXT ─────────────────────────────────────────────────────────
  function buildCtx(t, st, rd){
    const wins = st?.wins ?? "unknown";
    const losses = st?.losses ?? "unknown";
    const gb = st?.gamesBack;
    const leading = gb === "0" || gb === 0;
    const streak = st?.streak?.streakCode ?? "unknown";
    const stories = rd?.gameStories?.filter(s=>s) || [];
    const lastDetail = stories.length > 0
      ? stories.map((s,i) => {
          const batLine = s.batters.map(b=>`${b.name} ${b.h}-for-${b.ab}${b.hr>0?" "+b.hr+"HR":""}${b.rbi>0?" "+b.rbi+"RBI":""}`).join(", ");
          const pitLine = s.starter ? `SP ${s.starter.name} ${s.starter.ip}IP ${s.starter.er}ER ${s.starter.k}K` : "";
          const svLine = s.closer?.sv>0 ? `SV ${s.closer.name}` : "";
          return `Game ${i+1}: ${batLine}${pitLine?"; "+pitLine:""}${svLine?"; "+svLine:""}`;
        }).join(" | ")
      : "";
    const batS = rd?.teamBatting ? `AVG:${rd.teamBatting.avg} OBP:${rd.teamBatting.obp} HR:${rd.teamBatting.homeRuns} Runs:${rd.teamBatting.runs}` : "";
    const pitS = rd?.teamPitching ? `ERA:${rd.teamPitching.era} WHIP:${rd.teamPitching.whip} K:${rd.teamPitching.strikeOuts}` : "";
    return {wins,losses,leading,gb,streak,lastDetail,batS,pitS};
  }

  // ── GENERATE CONTENT ──────────────────────────────────────────────────────
  async function generateContent(t, st, nextG, lastG, recent, rd, fac){
    const c = buildCtx(t, st, rd);
    const realGames = recent.length > 0 ? recent.map((g,i)=>{
      const isHome=g.teams?.home?.team?.id===t.id;
      const opp=isHome?g.teams?.away?.team?.name:g.teams?.home?.team?.name;
      const ms=isHome?g.teams?.home?.score:g.teams?.away?.score;
      const os=isHome?g.teams?.away?.score:g.teams?.home?.score;
      const won=(ms??0)>(os??0);
      return (won?"W":"L")+" "+(ms??0)+"-"+(os??0)+" vs "+(opp??"?")+" on "+g.gameDate?.slice(0,10);
    }).join("\n") : "No completed games";
    const prompt = `Team: ${t.name} (known in lore as "${t.house}")
Rival: ${t.rival}
Record: ${c.wins}W-${c.losses}L | ${c.leading?"Leading division":(c.gb||"?"+" GB")} | Streak: ${c.streak}
${c.lastDetail}
${c.batS}
${c.pitS}

You are generating content for Sports Lore — a site that translates baseball into Star Wars and LOTR for people who don't watch sports.

Write three things:

TALKING_POINT:
Write TWO versions separated by |||

Version 1 (LORE): One sentence using a LOTR or Star Wars reference as the actual explanation. Only include a player name or stat if it was provided in the real data above — do not invent statistics.
Example: "The bullpen has been pulling a Denethor — brilliant record, self-destructing when it matters most."

Version 2 (SPORTS TALK): The SAME information in plain baseball language someone could actually say at work and sound like a fan. Use real baseball terms (ERA, bullpen, batting average, rotation, walk-off, etc). No nerd references — just confident sports talk.
Example: "The bullpen has been the biggest problem — they keep blowing leads in the late innings when it matters most."

Format exactly: LORE SENTENCE ||| SPORTS SENTENCE

ARC:
3 sentences. Use ONLY the real stats and player data provided above — do not invent stats or player names. If stats are unavailable say so honestly. Translate what you actually know into the nerd reference. End on the next challenge.

EPISODES:
${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} is today. ONLY generate EP lines for these exact games, copying opponent names, scores and dates exactly as shown:
${realGames}
If realGames says No completed games, output NOTHING for this section.
CRITICAL: If the user picked Star Wars mode, every title must use ONLY Star Wars references. If LOTR mode, every title must use ONLY LOTR references. Do NOT mix them.
EP|W or L|score like 4-2|opponent|date like Mar 24|Title using faction-appropriate reference 4-6 words`;

    try{
      const res = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:FACTIONS[fac||faction||'sw'].sys + `\n\nCRITICAL: You are in ${(fac||faction||'sw')==='lotr'?'LORD OF THE RINGS':'STAR WARS'} mode ONLY. Every single reference must be from ${(fac||faction||'sw')==='lotr'?'Lord of the Rings':'Star Wars'} exclusively. Do not mix franchises.`,messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      const text = data.content?.[0]?.text ?? "";
      const tp = text.match(/TALKING_POINT:\s*([\s\S]*?)(?=ARC:|$)/i)?.[1]?.trim();
      const arcT = text.match(/ARC:\s*([\s\S]*?)(?=EPISODES:|$)/i)?.[1]?.trim();
      const epS = text.match(/EPISODES:\s*([\s\S]*?)$/i)?.[1]?.trim();
      if(tp){
        const parts = tp.split("|||");
        const clean = s => (s||"").replace(/\*\*/g,'').replace(/\*/g,'').trim();
        setTalkingPoint({lore: clean(parts[0] ?? tp), sports: clean(parts[1] ?? "")});
      }
      if(arcT) setArc(arcT.replace(/\*\*/g,'').replace(/\*/g,'').trim());
      if(epS && recent.length > 0){
        const eps = epS.split("\n").filter(l=>l.trim().startsWith("EP|")).map((l,i)=>{
          const p = l.split("|");
          return{win:(p[1]??"").trim()==="W",score:p[2]??"?-?",opp:p[3]??"?",date:p[4]??"?",title:(p[5]??"").trim(),num:5-i};
        });
        setEpisodes(eps);
      }
    }catch(e){
      setTalkingPoint("The data scrolls are temporarily sealed. Refresh to try again.");
    }
  }

  // ── ORACLE INTRO ──────────────────────────────────────────────────────────
  async function fireOracleIntro(t, st, lastG, rd, fac){
    const c = buildCtx(t, st, rd);
    const ctx = makeOracleCtx(t, st, rd, c, fac);
    const q = "What happened in the last few battles?";
    setMsgs([{role:"user", content:q}]);
    setOLoading(true);
    try{
      const res = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,system:ctx,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:q}]})
      });
      const data = await res.json();
      const allText2 = data.content?.filter(b=>b.type==="text").map(b=>b.text||"").join(" ").replace(/ +/g," ").trim();
      const reply = allText2 || "The oracle is warming up.";
      setMsgs([{role:"user",content:q},{role:"assistant",content:reply}]);
    }catch{
      setMsgs([{role:"user",content:q},{role:"assistant",content:"The Palantir is clouded. Ask me anything and I'll do my best."}]);
    }
    setOLoading(false);
  }

  function makeOracleCtx(t, st, rd, c, fac){
    const sys = FACTIONS[fac || faction || 'sw'].sys;
    const storyDetail = rd?.gameStories?.filter(s=>s).map((s,i)=>{
      const top = s.batters[0];
      const topLine = top ? `${top.name}: ${top.h}-for-${top.ab}${top.hr>0?" "+top.hr+"HR":""}${top.rbi>0?" "+top.rbi+"RBI":""}` : "";
      const spLine = s.starter ? `SP: ${s.starter.name} ${s.starter.ip}IP ${s.starter.er}ER ${s.starter.k}K` : "";
      return `Game ${i+1} — ${topLine}${spLine?", "+spLine:""}`;
    }).join("\n") || "No individual game data yet";
    return sys + `\n\nYou are in an ongoing conversation about the ${t.name} (known in lore as "${t.house}").
Their rival is the ${t.rival}.
Record: ${c.wins}W-${c.losses}L | Streak: ${c.streak}
${c.batS ? `Team batting: ${c.batS}` : ""}
${c.pitS ? `Team pitching: ${c.pitS}` : ""}
Recent game player data:
${storyDetail}

Keep responses to 3-4 sentences. The reference IS the explanation — never explain it. ALWAYS answer the question first with whatever data you have. Only acknowledge missing data at the END. Never lead with what you don't know. CRITICAL VOICE RULE: Every sentence must sound like a dispatch from inside the universe — never a scouting report or press release. Don't say 'their No. 8 prospect who earned a spot.' Say 'a young rider who wrested his place at the table from a more seasoned knight.' The facts are real. The language is always lore.

CRITICAL DATA RULES:
- Today is ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}.
- The 2026 MLB season just started. Only reference games, stats, and players from the data provided above.
- If someone asks about a specific recent game and you have no data on it, stay in character but be honest. For LOTR mode say something like: "The ravens haven't returned from that campaign yet — the scrolls are still sealed." For Star Wars mode: "That transmission hasn't reached the Holocron yet — the intel is still incoming." Never invent game details.
- Do not reference players or stats from your training data memory. Rosters change every year and you will be wrong. If no player data is provided, speak in general team terms only.
- Never reference events from 2024 or earlier as if they are current.

End every response with one line starting with ⚔️ they can say at work verbatim.`;
  }

  // ── SEND ORACLE MESSAGE ───────────────────────────────────────────────────
  async function sendOracle(){
    const msg = oInput.trim();
    if(!msg || !team || oLoading) return;
    setOInput("");
    const newMsgs = [...msgs, {role:"user",content:msg}];
    setMsgs(newMsgs);
    setOLoading(true);
    const rd = richRef.current;
    const c = buildCtx(team, standings, rd);
    const ctx = makeOracleCtx(team, standings, rd, c, faction);
    try{
      const res = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,system:ctx,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:newMsgs.map(m=>({role:m.role,content:m.content}))})
      });
      if(!res.ok) throw new Error("HTTP "+res.status);
      const data = await res.json();
      if(data.error) throw new Error(data.error.message || "API error");
      const allText = data.content?.filter(b=>b.type==="text").map(b=>b.text||"").join(" ").replace(/ +/g," ").trim();
      const reply = (allText||"The oracle went dark.").replace(/\*\*/g,"").replace(/\*/g,"").replace(/\n\n+/g,"\n\n").trim();
      setMsgs(prev=>[...prev,{role:"assistant",content:reply}]);
    }catch(e){
      console.error("Oracle error:",e);
      setMsgs(prev=>[...prev,{role:"assistant",content:"Signal lost. Try asking again."}]);
    }
    setOLoading(false);
  }

  const baseFaction = FACTIONS[faction||'sw'] || FACTIONS.sw;
  const baseAccent = baseFaction.accent;
  const teamColor = (phase==="team" && team?.color) ? team.color : null;
  const teamColors = teamColor ? getTeamColors(teamColor, baseAccent) : { accent: baseAccent, heroBg: baseAccent, heroText: "#111", useWhiteText: false };
  const f = {...baseFaction, accent: teamColors.accent};
  const heroBg = teamColors.heroBg;
  const heroText = teamColors.heroText;
  const useWhiteText = teamColors.useWhiteText;
  const isLive = !!(sched.last && sched.last?.status?.abstractGameState==="Live");

  const SectionDivider = () => faction==="lotr" ? (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"0 clamp(20px,5vw,48px)",margin:"0 0 0 0"}}>
      <div style={{flex:1,height:1,background:"#C9A84C",opacity:.5}}/>
      <svg width="28" height="18" viewBox="0 0 32 20">
        <line x1="4" y1="16" x2="28" y2="4" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="16" x2="4" y2="4" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
        <rect x="1" y="9" width="7" height="2.5" rx="1" fill="#C9A84C" transform="rotate(-23 4.5 10)"/>
        <rect x="24" y="9" width="7" height="2.5" rx="1" fill="#C9A84C" transform="rotate(23 27.5 10)"/>
      </svg>
      <div style={{flex:1,height:1,background:"#C9A84C",opacity:.5}}/>
    </div>
  ) : (
    <div style={{display:"flex",alignItems:"center",gap:0,padding:"0 clamp(20px,5vw,48px)"}}>
      <div style={{width:20,height:7,background:"#666",borderRadius:2,flexShrink:0}}/>
      <div style={{width:7,height:10,background:"#444",flexShrink:0}}/>
      <div style={{flex:1,height:3,background:"#FFE033"}}/>
      <div style={{width:3,height:3,background:"rgba(255,224,51,0.3)",flexShrink:0}}/>
    </div>
  );
  const nextOppName = sched.next ? getOpp(sched.next, team?.name??"") : "";
  const urgColor = !cd?"#111":cd.days===0?"#FF3B3B":cd.days<=2?"#FF6B00":"#111";
  const lastWon = sched.last ? didWin(sched.last, team?.id??0) : null;
  const formDots = sched.recent.map(g=>didWin(g,team?.id??0));

  const followUps = team ? [
    "Why did they win or lose the last game?",
    "Who is the most important player to watch?",
    "Should I be worried about making the playoffs?",
  ] : [];

  return(
    <div style={{minHeight:"100vh",background:phase==="pick"?"#111":"#F5F2E8",color:"#111",fontFamily:"'Space Grotesk',sans-serif",overflowX:"hidden","--faction-accent":f.accent,"--q-color":f.accent}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{-webkit-font-smoothing:antialiased;}
        .arch{font-family:'Archivo Black',sans-serif;}
        .lora{font-family:'Lora',serif;}
        .sg{font-family:'Space Grotesk',sans-serif;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes pop{from{opacity:0;transform:scale(.96)translateY(10px);}to{opacity:1;transform:scale(1)translateY(0);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .pop{animation:pop .5s cubic-bezier(.16,1,.3,1) both;}
        .s1{animation-delay:.05s;}.s2{animation-delay:.12s;}.s3{animation-delay:.2s;}.s4{animation-delay:.3s;}.s5{animation-delay:.42s;}
        /* Oracle bubbles */
        .bq{background:#FFE033;border:2px solid #111;padding:12px 16px;max-width:85%;align-self:flex-end;font-weight:600;font-size:14px;}
        .ba{background:#fff;border:2px solid #111;padding:14px 18px;max-width:92%;align-self:flex-start;line-height:1.75;}
        /* Follow-up chips */
        .chip{background:#fff;border:2px solid #111;color:#111;padding:10px 14px;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;text-align:left;transition:background .1s;min-height:44px;line-height:1.4;}
        .chip:hover{background:var(--faction-accent,#FFE033);}
        /* Episode rows */
        .ep{display:grid;grid-template-columns:32px 1fr 50px;gap:10px;align-items:start;padding:16px 0;border-bottom:2px solid #111;transition:background .1s;}
        .ep:hover{background:rgba(255,224,51,.15);}
        @media(max-width:460px){.ep{grid-template-columns:26px 1fr 44px;gap:8px;}}
        .tag-w{display:inline-block;background:#111;color:var(--faction-accent,#FFE033);font-family:'Archivo Black',sans-serif;font-size:10px;letter-spacing:1px;padding:3px 8px;}
        .tag-l{display:inline-block;background:#fff;border:2px solid #111;color:#111;font-family:'Archivo Black',sans-serif;font-size:10px;letter-spacing:1px;padding:2px 8px;}
        /* Stat pill */
        .stat-pill{background:rgba(0,0,0,.35);color:#fff;padding:8px 16px;display:inline-flex;flex-direction:column;align-items:center;gap:2px;min-width:64px;}
        /* Div table */
        .div-tr{display:grid;grid-template-columns:1fr 40px 40px 56px 48px;gap:8px;padding:10px 0;border-bottom:2px solid #111;align-items:center;}
        .div-tr.mine{background:var(--faction-accent,#FFE033);padding:10px 12px;margin:0 -12px;}
        /* Input */
        .o-inp{flex:1;background:#fff;border:3px solid #111;border-right:none;color:#111;padding:14px 16px;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:600;outline:none;min-height:52px;WebkitAppearance:none;transition:border-color .15s;}
        .o-inp:focus{border-color:#FFE033;background:#FFFDE7;}
        .o-inp::placeholder{color:#999;font-weight:400;}
        .o-btn{background:#111;border:3px solid #111;border-left:none;color:#FFE033;padding:14px 20px;font-family:'Archivo Black',sans-serif;font-size:14px;cursor:pointer;transition:all .15s;min-height:52px;min-width:70px;flex-shrink:0;letter-spacing:1px;}
        .o-btn:hover{background:var(--faction-accent,#FFE033);color:#111;}
        .o-btn:disabled{opacity:.3;cursor:not-allowed;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#111;}
        @media(min-width:601px){.oracle-sub{display:none !important;}}
        .nav-btn{background:none;border:2px solid #111;color:#111;padding:7px 14px;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;transition:all .15s;min-height:36px;}
        .nav-btn:hover{background:#FFE033;}
        .section-rule{height:3px;background:#111;margin:0;}
      `}</style>

      {/* ══ FACTION PICKER ══ */}
      {phase==="pick"&&(
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px clamp(20px,5vw,48px)",background:"#111"}}>
          <div className="arch" style={{fontSize:11,letterSpacing:5,color:"rgba(255,255,255,.3)",marginBottom:16,textAlign:"center"}}>MLB BASEBALL · SPORTS LORE</div>
          <h1 className="arch" style={{fontSize:"clamp(36px,8vw,72px)",lineHeight:.9,letterSpacing:-2,color:"#fff",marginBottom:12,textAlign:"center"}}>
            CHOOSE YOUR<br/>UNIVERSE.
          </h1>
          <p className="lora" style={{fontSize:"clamp(15px,2vw,19px)",color:"rgba(255,255,255,.45)",fontStyle:"italic",marginBottom:56,textAlign:"center",maxWidth:480}}>
            Pick how you want your team&apos;s season decoded. Everything — the Oracle, the story, the talking point — will speak your language.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:4,width:"100%",maxWidth:640}}>
            {/* LOTR */}
            <button onClick={()=>{setFaction("lotr");setPhase("landing");}}
              style={{background:"#C9A84C",border:"3px solid #C9A84C",cursor:"pointer",padding:0,textAlign:"left",transition:"all .15s",overflow:"hidden"}}
              onMouseOver={e=>{e.currentTarget.style.background="#E8C76A";e.currentTarget.style.borderColor="#E8C76A";}}
              onMouseOut={e=>{e.currentTarget.style.background="#C9A84C";e.currentTarget.style.borderColor="#C9A84C";}}>
              <div style={{padding:"36px 28px"}}>
              <div style={{fontSize:48,marginBottom:16}}>💍</div>
              <div className="arch" style={{fontSize:"clamp(22px,4vw,36px)",letterSpacing:-1,color:"#111",marginBottom:8,lineHeight:1}}>LORD OF<br/>THE RINGS</div>
              <p className="lora" style={{fontSize:15,lineHeight:1.65,color:"rgba(0,0,0,.6)",fontStyle:"italic",marginBottom:16}}>
                The bullpen has been pulling a Denethor. The cleanup hitter is our Aragorn. The rival is Mordor and always has been.
              </p>
              <div className="arch" style={{fontSize:11,letterSpacing:3,color:"rgba(0,0,0,.5)"}}>SELECT THIS UNIVERSE →</div>
              </div>
            </button>
            {/* Star Wars */}
            <button onClick={()=>{setFaction("sw");setPhase("landing");}}
              style={{background:"#FFE033",border:"3px solid #FFE033",cursor:"pointer",padding:0,textAlign:"left",transition:"all .15s",overflow:"hidden"}}
              onMouseOver={e=>{e.currentTarget.style.background="#FFF176";e.currentTarget.style.borderColor="#FFF176";}}
              onMouseOut={e=>{e.currentTarget.style.background="#FFE033";e.currentTarget.style.borderColor="#FFE033";}}>
              <div style={{padding:"36px 28px"}}>
              <div style={{fontSize:48,marginBottom:16}}>🚀</div>
              <div className="arch" style={{fontSize:"clamp(22px,4vw,36px)",letterSpacing:-1,color:"#111",marginBottom:8,lineHeight:1}}>STAR<br/>WARS</div>
              <p className="lora" style={{fontSize:15,lineHeight:1.65,color:"rgba(0,0,0,.6)",fontStyle:"italic",marginBottom:16}}>
                The bullpen has been Order 66-ing every lead since April. The ace is our Ahsoka — quietly the best one out there.
              </p>
              <div className="arch" style={{fontSize:11,letterSpacing:3,color:"rgba(0,0,0,.5)"}}>SELECT THIS UNIVERSE →</div>
              </div>
            </button>
          </div>
          <p className="sg" style={{fontSize:11,color:"rgba(255,255,255,.2)",marginTop:32,letterSpacing:1,fontWeight:600}}>
            YOU CAN SWITCH ANYTIME FROM THE MENU
          </p>
        </div>
      )}

      {/* ══ LANDING ══ */}
      {phase==="landing"&&(
        <div style={{maxWidth:800,margin:"0 auto",padding:"clamp(40px,8vw,80px) clamp(20px,5vw,48px)"}}>

          {/* Header */}
          <div style={{marginBottom:48,borderBottom:"3px solid #111",paddingBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
              <div className="arch" style={{fontSize:11,letterSpacing:4,color:"#888"}}>MLB BASEBALL · FOR PEOPLE WHO DON&apos;T WATCH</div>
              {faction&&(
                <button onClick={()=>setPhase("pick")}
                  style={{background:FACTIONS[faction].accent,border:"2px solid #111",padding:"3px 10px",cursor:"pointer",fontFamily:"'Archivo Black',sans-serif",fontSize:10,letterSpacing:2,color:"#111",display:"flex",alignItems:"center",gap:5}}>
                  {FACTIONS[faction].emoji} {FACTIONS[faction].name.toUpperCase()} ↻
                </button>
              )}
            </div>
            <h1 className="arch" style={{fontSize:"clamp(52px,14vw,120px)",lineHeight:.88,letterSpacing:-2,color:"#111"}}>
              SPORTS<br/>LORE.
            </h1>
            {faction&&<p className="lora" style={{fontSize:16,fontStyle:"italic",color:"#777",marginTop:10}}>{FACTIONS[faction].tagline}</p>}
          </div>

          {/* Value prop — 2 cards + full-width pun quote */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:3,marginBottom:3}}>
            {[
              {icon:faction==="lotr"?"⚔️":"🚀",title:"NERD TRANSLATION",body:faction==="lotr"?"Your team's season decoded entirely through Lord of the Rings. Wins, losses, drama — all of it translated into Middle-earth.":"Your team's season decoded entirely through Star Wars. Wins, losses, drama — all of it translated to a galaxy far, far away."},
              {icon:"💬",title:"ONE TALKING POINT",body:"Walk away with exactly one thing to say at work tomorrow. Real stat. Real reference. Sounds like you watched."},
            ].map(c=>(
              <div key={c.title} style={{background:"#fff",border:"3px solid #111",padding:"24px 22px"}}>
                <div style={{fontSize:28,marginBottom:12}}>{c.icon}</div>
                <div className="arch" style={{fontSize:13,letterSpacing:2,marginBottom:8}}>{c.title}</div>
                <p className="lora" style={{fontSize:15,lineHeight:1.7,color:"#333"}}>{c.body}</p>
              </div>
            ))}
          </div>
          {/* Full-width rotating pun quote — faction aware */}
          <RotatingPun faction={faction||"sw"}/>
          <div style={{marginBottom:48}}/>

          {/* Team search */}
          <div style={{background:faction?FACTIONS[faction].accent:"#FFE033",border:"3px solid #111",padding:"28px 24px",marginBottom:32}}>
            <div className="arch" style={{fontSize:13,letterSpacing:3,marginBottom:14}}>FIND YOUR MLB TEAM</div>
            {detecting?(
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <Spin/>
                <span className="sg" style={{fontSize:14,fontWeight:600,color:"#555"}}>Detecting your city...</span>
              </div>
            ):(
              <TeamSearch value={search} onChange={setSearch} results={searchRes} onSelect={selectTeam}
                placeholder="Type your city or team — e.g. Chicago, Dodgers..."/>
            )}
          </div>

          {/* All teams grid */}
          <div>
            <div className="arch" style={{fontSize:11,letterSpacing:3,color:"#888",marginBottom:12}}>ALL 30 TEAMS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:3}}>
              {MLB_TEAMS.sort((a,b)=>a.abbr.localeCompare(b.abbr)).map(t=>(
                <button key={t.id} onClick={()=>selectTeam(t)}
                  style={{background:"#fff",border:"3px solid #111",cursor:"pointer",padding:"12px 8px",textAlign:"left",transition:"background .1s",minHeight:54}}
                  onMouseOver={e=>e.currentTarget.style.background=faction?FACTIONS[faction].accent:"#FFE033"}
                  onMouseOut={e=>e.currentTarget.style.background="#fff"}>
                  <div className="arch" style={{fontSize:14,color:"#111"}}>{t.abbr}</div>
                  <div className="sg" style={{fontSize:9,color:"#666",marginTop:2,fontWeight:500}}>{t.city}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ TEAM PAGE ══ */}
      {phase==="team"&&team&&(
        <div style={{maxWidth:860,margin:"0 auto"}}>

          {/* NAV */}
          <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px clamp(20px,5vw,48px)",borderBottom:"3px solid #111",background:"#111"}}>
            <button onClick={()=>setPhase("landing")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
              <span className="arch" style={{fontSize:14,letterSpacing:3,color:f.accent}}>SPORTS LORE</span>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setPhase("pick")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:"rgba(255,255,255,.35)",fontWeight:600,letterSpacing:1,padding:"4px 8px",transition:"color .15s"}}
                onMouseOver={e=>e.currentTarget.style.color=f.accent} onMouseOut={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>
                {f.emoji} SWITCH UNIVERSE
              </button>
              {showSearch?(
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:220,position:"relative"}}>
                    <TeamSearch value={search} onChange={setSearch} results={searchRes} onSelect={selectTeam} placeholder="Search team..."/>
                  </div>
                  <button className="nav-btn" onClick={()=>{setShowSearch(false);setSearch("");setRes([]);}}
                    style={{background:"#FFE033",border:"2px solid #FFE033",color:"#111"}}>✕</button>
                </div>
              ):(
                <>
                  <span className="arch" style={{fontSize:13,letterSpacing:2,color:"#FFE033"}}>{team.abbr}</span>
                  <button className="nav-btn" onClick={()=>setShowSearch(true)}
                    style={{border:"2px solid #FFE033",color:"#FFE033"}}>CHANGE</button>
                </>
              )}
            </div>
          </nav>

          {/* ── HERO BAND ── */}
          <div style={{background:heroBg,borderBottom:"3px solid #111",padding:"clamp(28px,5vw,48px) clamp(20px,5vw,48px)"}}>
            {/* Lore name */}
            <div className="lora" style={{fontSize:13,fontStyle:"italic",color:useWhiteText?"rgba(255,255,255,.6)":"#555",marginBottom:8}}>
              Chronicle of {team.house}
            </div>

            {/* Team name — big */}
            <h1 className="arch" style={{fontSize:"clamp(40px,10vw,88px)",lineHeight:.88,letterSpacing:-1,marginBottom:24,color:heroText}}>
              {team.name}
            </h1>

            {/* Stats row */}
            {standings?(
              <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:24}}>
                {[
                  {l:"WINS",v:standings.wins??"—"},
                  {l:"LOSSES",v:standings.losses??"—"},
                  {l:standings.gamesBack==="0"?"RANK":"BACK",v:standings.gamesBack==="0"?"1ST":standings.gamesBack},
                  {l:"STREAK",v:standings.streak?.streakCode??"—"},
                ].map(s=>(
                  <div key={s.l} className="stat-pill">
                    <span className="arch" style={{fontSize:9,letterSpacing:2,opacity:.7}}>{s.l}</span>
                    <span className="arch" style={{fontSize:"clamp(22px,4vw,36px)",letterSpacing:-1,lineHeight:1}}>{s.v}</span>
                  </div>
                ))}
              </div>
            ):loading&&(
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:24}}>
                <Spin/><span className="sg" style={{fontSize:13,fontWeight:600,color:"#555"}}>Loading stats...</span>
              </div>
            )}

            {/* Next / Last game */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
              <div style={{background:"#111",padding:"16px 18px"}}>
                <div className="arch" style={{fontSize:9,letterSpacing:3,color:"#FFE033",marginBottom:6}}>
                  {!cd?"NEXT GAME":(cd.days===0&&new Date(sched.next?.gameDate).toDateString()===new Date().toDateString())?"⚔ GAME DAY — TODAY":cd.days<=2?"🔥 COMING SOON":"NEXT GAME"}
                </div>
                {sched.next?(
                  <>
                    <div className="arch" style={{fontSize:"clamp(16px,3vw,22px)",color:"#fff",lineHeight:1.1,marginBottom:4}}>vs. {nextOppName}</div>
                    <div className="sg" style={{fontSize:11,color:"#aaa"}}>{fmtDate(sched.next.gameDate,{weekday:"short",month:"short",day:"numeric"})}</div>
                    {cd&&<div className="arch" style={{fontSize:"clamp(20px,4vw,32px)",color:"#FFE033",letterSpacing:-1,marginTop:6}}>{cd.days>0&&`${cd.days}d `}{cd.hours}h {cd.mins}m</div>}
                  </>
                ):<div className="sg" style={{fontSize:13,color:"#888",fontWeight:600}}>Schedule TBD</div>}
              </div>
              <div style={{background:"#fff",border:"3px solid #111",borderTop:"none",borderRight:"none",borderBottom:"none",padding:"16px 18px"}}>
                <div className="arch" style={{fontSize:9,letterSpacing:3,color:isLive?"#FF3B3B":"#888",marginBottom:6}}>{isLive?"🔴 LIVE NOW":"LAST GAME"}</div>
                {sched.last?(
                  <>
                    <div className="arch" style={{fontSize:11,letterSpacing:1,color:isLive?"#FF3B3B":lastWon?"#111":"#888",marginBottom:4}}>{isLive?"":lastWon?"✓ WIN":"✗ LOSS"}</div>
                    <div className="arch" style={{fontSize:"clamp(22px,4vw,36px)",letterSpacing:-1,lineHeight:1,marginBottom:4,color:isLive?"#888":lastWon?"#111":"#888"}}>
                      {isLive
                        ? <>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                              <div style={{textAlign:"center"}}>
                                <div className="arch" style={{fontSize:"clamp(18px,3vw,26px)",letterSpacing:-1,color:"#888"}}>{sched.last.teams?.away?.score??0}</div>
                                <div className="sg" style={{fontSize:10,color:"#aaa",fontWeight:600}}>{sched.last.teams?.away?.team?.abbreviation??""}</div>
                              </div>
                              <div className="sg" style={{fontSize:12,color:"#aaa",fontWeight:600}}>—</div>
                              <div style={{textAlign:"center"}}>
                                <div className="arch" style={{fontSize:"clamp(18px,3vw,26px)",letterSpacing:-1,color:"#888"}}>{sched.last.teams?.home?.score??0}</div>
                                <div className="sg" style={{fontSize:10,color:"#aaa",fontWeight:600}}>{sched.last.teams?.home?.team?.abbreviation??""}</div>
                              </div>
                            </div>
                          </>
                        : <>{sched.last.teams?.home?.score??'?'}–{sched.last.teams?.away?.score??'?'}</>
                      }
                    </div>
                    <div className="sg" style={{fontSize:11,color:"#555",fontWeight:600}}>vs. {getOpp(sched.last,team.name)}</div>
                  </>
                ):<div className="sg" style={{fontSize:13,color:"#888",fontWeight:600}}>No recent games</div>}
              </div>
            </div>

            {/* Form dots */}
            {formDots.length>0&&(
              <div style={{display:"flex",gap:4,marginTop:16,flexWrap:"wrap",alignItems:"center"}}>
                {formDots.map((w,i)=>(
                  <div key={i} style={{width:30,height:30,background:w?"#111":"rgba(0,0,0,.25)",border:`2px solid ${useWhiteText?"rgba(0,0,0,.3)":"#111"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span className="arch" style={{fontSize:11,color:w?"#FFE033":"#111"}}>{w?"W":"L"}</span>
                  </div>
                ))}
                <span className="sg" style={{fontSize:10,color:useWhiteText?"rgba(255,255,255,.6)":"#555",fontWeight:600,marginLeft:6}}>LAST {formDots.length} GAMES</span>
              </div>
            )}
          </div>

          {/* ── ORACLE (TOP — AUTO-FIRED) ── */}
          <div style={{borderBottom:"3px solid #111",padding:"clamp(24px,5vw,40px) clamp(20px,5vw,48px)"}}>

            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
              <h2 className="arch" style={{fontSize:"clamp(24px,5vw,44px)",letterSpacing:-1,lineHeight:1,marginBottom:4}}>THE ORACLE</h2>
              <span style={{fontSize:20}}>🔮</span>
            </div>
            {faction==="lotr" ? (
              <div style={{position:"relative",background:"#f5edd6",border:"2px solid #8B6914",padding:"14px 32px",marginBottom:20,maxWidth:600}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:16,background:"#c4a35a",borderRight:"2px solid #8B6914"}}/>
                <div style={{position:"absolute",right:0,top:0,bottom:0,width:16,background:"#c4a35a",borderLeft:"2px solid #8B6914"}}/>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <svg width="18" height="18" viewBox="0 0 20 20" style={{flexShrink:0}}>
                    <path d="M10 2 C7 2 5 4 5 6 C5 7 5.5 8 6 8.5 L4 10 C3 11 3 12 4 12.5 L6 11.5 L5 14 C5 15 6 16 7 15.5 L8.5 13 L9 16 C9 17 10 18 11 17 L11 14 C12 15 13 15 14 14 C15 13 15 12 14 11 L12 9 C13 8 13 6 12 5 C11 3 10 2 10 2Z" fill="#3d2b00"/>
                    <circle cx="8" cy="6" r="1" fill="#c4a35a"/>
                  </svg>
                  <p className="lora" style={{margin:0,fontSize:15,fontStyle:"italic",color:"#3d2b00",fontWeight:600}}>Return daily as ravens bring fresh dispatches from the front.</p>
                </div>
              </div>
            ) : (
              <div style={{position:"relative",background:"#001830",border:"1px solid #0066aa",padding:"14px 24px",marginBottom:20,maxWidth:600,overflow:"hidden"}}>
                <div style={{position:"absolute",top:4,left:4,width:10,height:10,borderTop:"2px solid #0099ff",borderLeft:"2px solid #0099ff"}}/>
                <div style={{position:"absolute",top:4,right:4,width:10,height:10,borderTop:"2px solid #0099ff",borderRight:"2px solid #0099ff"}}/>
                <div style={{position:"absolute",bottom:4,left:4,width:10,height:10,borderBottom:"2px solid #0099ff",borderLeft:"2px solid #0099ff"}}/>
                <div style={{position:"absolute",bottom:4,right:4,width:10,height:10,borderBottom:"2px solid #0099ff",borderRight:"2px solid #0099ff"}}/>
                <p className="lora" style={{margin:0,fontSize:15,fontStyle:"italic",color:"#66ccff",fontWeight:600,letterSpacing:.5}}>▶ Return daily. Fresh transmissions across the galaxy arrive after every game.</p>
              </div>
            )}

            {/* Chat */}
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {/* Chat bubbles on LEFT */}
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,marginBottom:16,minHeight:60}}>
              {msgs.map((m,i)=>(
                <div key={i} ref={m.role==="assistant"&&i===msgs.length-1?(el=>el&&i>1&&setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"start"}),100)):null} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",gap:6}}>
                  {m.role==="assistant" ? (
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{position:"relative",flex:1}}>
                      {/* Speech bubble with right-pointing tail toward character */}
                      <div style={{
                        background:faction==="lotr"?"#f0e6c8":"#001220",
                        border:faction==="lotr"?"2px solid #8B6914":"2px solid #0077cc",
                        borderRadius:faction==="lotr"?"4px":"2px",
                        padding:"16px 20px",
                        position:"relative",
                      }}>
                        <p className="lora" style={{margin:0,fontSize:16,lineHeight:1.75,whiteSpace:"pre-wrap",color:faction==="lotr"?"#3d2400":"#66ccff",fontStyle:"italic"}}>{m.content}</p>
                        <div style={{
                          position:"absolute",right:-14,top:"50%",transform:"translateY(-50%)",
                          width:0,height:0,
                          borderTop:"12px solid transparent",
                          borderBottom:"12px solid transparent",
                          borderLeft:faction==="lotr"?"14px solid #f0e6c8":"14px solid #001220",
                        }}/>
                      </div>
                      <ShareButton text={m.content} faction={faction}/>
                    </div>
                    {i===msgs.length-1&&(
                      <div style={{flexShrink:0,alignSelf:"center",width:"clamp(140px,16vw,220px)"}}>
                        <img src={faction==="lotr"?"/gandalf-funko.png":"/vader-funko.png"} alt="" style={{width:"100%",height:"auto",display:"block"}}/>
                      </div>
                    )}
                    </div>
                  ) : (
                    <div className="bq" style={{maxWidth:"75%",display:msgs.indexOf(m)===0?"none":"block"}}>
                      <p className="sg" style={{margin:0,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.content}</p>
                    </div>
                  )}
                </div>
              ))}
              {oLoading&&(
                <div style={{padding:"20px 0",minHeight:100,alignSelf:"flex-start"}}>
                  <div style={{transform:"scale(1.6)",transformOrigin:"left center",marginLeft:8}}>
                    <FunLoader faction={faction} type="arc" dark={false}/>
                  </div>
                </div>
              )}
              <div ref={chatEnd}/>
              </div>
            </div>

            {/* Follow-up chips */}
            {msgs.length>=2&&!oLoading&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6,marginBottom:14}}>
                {followUps.map(q=>(
                  <button key={q} className="chip" onClick={async()=>{
                    const newMsgs=[...msgs,{role:"user",content:q}];
                    setMsgs(newMsgs);setOLoading(true);
                    const rd=richRef.current,c=buildCtx(team,standings,rd),ctx=makeOracleCtx(team,standings,rd,c,faction);
                    try{
                      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:ctx,messages:newMsgs.map(m=>({role:m.role,content:m.content}))})});
                      const d=await res.json();
                      const txt=d.content?.filter(b=>b.type==="text").map(b=>b.text||"").join("").replace(/ {2,}/g," ").trim();
                      setMsgs(prev=>[...prev,{role:"assistant",content:txt||"The oracle went silent."}]);
                    }catch(e){
                      setMsgs(prev=>[...prev,{role:"assistant",content:"Signal lost."}]);
                    }finally{setOLoading(false);}
                  }}>{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{display:"flex"}}>
              <input className="o-inp" ref={null}
                placeholder={`Ask anything about the ${team.name}...`}
                value={oInput} onChange={e=>setOInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendOracle();}}}
              />
              <button className="o-btn" onClick={sendOracle} disabled={oLoading||!oInput.trim()}>ASK</button>
            </div>
          </div>

          {/* ── TALKING POINT ── */}
          <SectionDivider/>
          <div style={{background:"#111",padding:"clamp(28px,5vw,48px) clamp(20px,5vw,48px)",borderBottom:"3px solid #111"}}>
            <div className="arch" style={{fontSize:11,letterSpacing:4,color:f.accent,marginBottom:16}}>{f.saySectionTitle}</div>
            {loading&&!talkingPoint?(
              <div style={{display:"flex",gap:10,alignItems:"center"}}><Spin/><span className="sg" style={{fontSize:13,color:"#aaa",fontWeight:600}}>Writing your talking point...</span></div>
            ):talkingPoint?(
              <>
                {/* Lore translation — big and dramatic */}
                <div style={{marginBottom:10,fontSize:10,fontFamily:"'Archivo Black',sans-serif",letterSpacing:3,color:"#FFE033"}}>
                  {faction==="lotr"?"⚔️ IN MIDDLE-EARTH":"🚀 IN A GALAXY FAR AWAY"}
                </div>
                <blockquote className="lora" style={{fontSize:"clamp(20px,3vw,34px)",lineHeight:1.3,fontStyle:"italic",fontWeight:600,color:f.accent,borderLeft:`5px solid ${f.accent}`,paddingLeft:24,marginBottom:32}}>
                  &ldquo;{typeof talkingPoint==="object"?talkingPoint.lore:talkingPoint}&rdquo;
                </blockquote>
                {/* Sports translation — casual, like a text */}
                {typeof talkingPoint==="object"&&talkingPoint.sports&&(
                  <div style={{background:"rgba(255,255,255,.06)",borderRadius:0,padding:"20px 24px",borderLeft:"3px solid rgba(255,255,255,.15)"}}>
                    <div style={{marginBottom:10,fontSize:10,fontFamily:"'Archivo Black',sans-serif",letterSpacing:3,color:"#FFE033"}}>
                      ⚾ SAY THIS AT WORK
                    </div>
                    <p className="sg" style={{fontSize:"clamp(15px,2vw,20px)",lineHeight:1.6,color:"rgba(255,255,255,.8)",fontWeight:600,marginBottom:0}}>
                      &ldquo;{talkingPoint.sports}&rdquo;
                    </p>
                  </div>
                )}
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginTop:8}}><p className="sg" style={{fontSize:11,color:"#555",fontWeight:600,letterSpacing:1}}>NOW YOU SOUND LIKE YOU WATCHED.</p><ShareButton text={typeof talkingPoint==="object"?talkingPoint.sports||talkingPoint.lore:talkingPoint} faction={faction}/></div>
              </>
            ):null}
          </div>

          {/* ── THE STORY ── */}
          {(arc||loading)&&(
            <div style={{padding:"clamp(28px,5vw,48px) clamp(20px,5vw,48px)",borderBottom:"3px solid #111",background:"#fff"}}>
              <div className="arch" style={{fontSize:11,letterSpacing:4,color:"#888",marginBottom:16}}>{f.storyTitle}</div>
              {loading&&!arc?(
                <FunLoader faction={faction} type="arc"/>
              ):(
                <p className="lora" style={{fontSize:"clamp(16px,2.2vw,20px)",lineHeight:1.9,color:"#111"}}>
                  <span className="arch" style={{float:"left",fontSize:"clamp(52px,9vw,76px)",lineHeight:.82,marginRight:10,marginTop:8,color:teamColor||f.accent,WebkitTextStroke:"2px #111"}}>{arc?.[0]}</span>
                  {arc?.slice(1)}
                </p>
              )}
            </div>
          )}

          {/* ── EPISODE LOG ── */}
          {(episodes.length>0||loading)&&sched.recent.length>0&&(
            <div style={{padding:"clamp(28px,5vw,48px) clamp(20px,5vw,48px)",borderBottom:"3px solid #111"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",borderBottom:"3px solid #111",paddingBottom:10,marginBottom:0}}>
                <h2 className="arch" style={{fontSize:"clamp(22px,5vw,40px)",letterSpacing:-1,lineHeight:1}}>{f.battleTitle}</h2>
                <span className="sg" style={{fontSize:11,color:"#888",fontWeight:600}}>LAST 5 GAMES</span>
              </div>
              {loading&&!episodes.length?(
                <div style={{paddingTop:20}}><FunLoader faction={faction} type="episodes"/></div>
              ):(
                episodes.map((ep,i)=>(
                  <div key={i} className="ep">
                    <div className="sg" style={{fontSize:11,color:"#888",fontWeight:700,paddingTop:2}}>#{ep.num}</div>
                    <div>
                      <span className={ep.win?"tag-w":"tag-l"} style={{display:"inline-block",marginBottom:5}}>{ep.win?"WIN":"LOSS"}</span>
                      <div className="lora" style={{fontSize:"clamp(14px,2.2vw,18px)",fontWeight:600,lineHeight:1.3,marginBottom:3}}>{faction==="lotr"?"⚔ ":"⚡ "}{ep.title}</div>
                      <div className="sg" style={{fontSize:11,color:"#777",fontWeight:500}}>vs. {ep.opp} · {ep.date}</div>
                    </div>
                    <div className="arch" style={{fontSize:"clamp(15px,3vw,22px)",letterSpacing:-0.5,textAlign:"right",color:ep.win?"#111":"#bbb",paddingTop:2}}>{ep.score}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── DIVISION STANDINGS ── */}
          {divRows.length>0&&(
            <div style={{padding:"clamp(28px,5vw,48px) clamp(20px,5vw,48px)",borderBottom:"3px solid #111"}}>
              <div className="arch" style={{fontSize:11,letterSpacing:4,color:"#888",marginBottom:16}}>THE DIVISION — {standings?.divisionName}</div>
              <div>
                <div className="div-tr" style={{borderBottom:"3px solid #111",paddingBottom:8}}>
                  {["TEAM","W","L","PCT","GB"].map(h=><div key={h} className="arch" style={{fontSize:9,letterSpacing:2,color:"#888",textAlign:h==="TEAM"?"left":"center"}}>{h}</div>)}
                </div>
                {divRows.map((d,i)=>(
                  <div key={i} className={`div-tr${d.isThis?" mine":""}`}>
                    <div className="sg" style={{fontWeight:700,fontSize:14}}>{d.isThis?"▶ ":""}{d.name}</div>
                    <div className="arch" style={{fontSize:16,textAlign:"center"}}>{d.wins}</div>
                    <div className="arch" style={{fontSize:16,textAlign:"center"}}>{d.losses}</div>
                    <div className="sg" style={{fontSize:13,textAlign:"center",fontWeight:600}}>{d.pct}</div>
                    <div className="sg" style={{fontSize:13,textAlign:"center",fontWeight:600,color:d.isThis?"#111":"#888"}}>{d.gb==="0"?"—":d.gb}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{padding:"20px clamp(20px,5vw,48px)",background:"#111",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <span className="arch" style={{fontSize:11,letterSpacing:4,color:"#444"}}>SPORTS LORE</span>
            <span className="sg" style={{fontSize:10,color:"#444",fontWeight:500}}>MLB · CLAUDE · FOR PEOPLE WHO SAW THE EXTENDED EDITIONS</span>
          </div>
        </div>
      )}
    </div>
  );
}
