import { useState, useEffect, useRef } from "react";

// ─── TEAMS ────────────────────────────────────────────────────────────────────
const MLB_TEAMS = [
  { id:108, name:"Los Angeles Angels",    city:"Anaheim",       abbr:"LAA", lat:33.8003, lng:-117.8827, rival:"Houston Astros",        house:"The Angels of Anaheim" },
  { id:109, name:"Arizona Diamondbacks",  city:"Phoenix",       abbr:"ARI", lat:33.4484, lng:-112.0740, rival:"Los Angeles Dodgers",    house:"House Serpent of the Desert" },
  { id:110, name:"Baltimore Orioles",     city:"Baltimore",     abbr:"BAL", lat:39.2904, lng:-76.6122,  rival:"New York Yankees",      house:"The Orange Watch of the Chesapeake" },
  { id:111, name:"Boston Red Sox",        city:"Boston",        abbr:"BOS", lat:42.3601, lng:-71.0589,  rival:"New York Yankees",      house:"The Crimson Fellowship of Fenway" },
  { id:112, name:"Chicago Cubs",          city:"Chicago",       abbr:"CHC", lat:41.8781, lng:-87.6298,  rival:"St. Louis Cardinals",   house:"The Wrigley Keep" },
  { id:113, name:"Cincinnati Reds",       city:"Cincinnati",    abbr:"CIN", lat:39.1031, lng:-84.5120,  rival:"St. Louis Cardinals",   house:"The Red Legion of the Ohio" },
  { id:114, name:"Cleveland Guardians",   city:"Cleveland",     abbr:"CLE", lat:41.4993, lng:-81.6944,  rival:"Chicago White Sox",     house:"Guardians of the North Shore" },
  { id:115, name:"Colorado Rockies",      city:"Denver",        abbr:"COL", lat:39.7392, lng:-104.9903, rival:"Arizona Diamondbacks",  house:"The Mountain Realm of Coors" },
  { id:116, name:"Detroit Tigers",        city:"Detroit",       abbr:"DET", lat:42.3314, lng:-83.0458,  rival:"Cleveland Guardians",   house:"The Tigers of Motor City" },
  { id:117, name:"Houston Astros",        city:"Houston",       abbr:"HOU", lat:29.7604, lng:-95.3698,  rival:"Texas Rangers",         house:"The Star Seekers of the South" },
  { id:118, name:"Kansas City Royals",    city:"Kansas City",   abbr:"KC",  lat:39.0997, lng:-94.5786,  rival:"St. Louis Cardinals",   house:"The Royal Court of the Heartland" },
  { id:119, name:"Los Angeles Dodgers",   city:"Los Angeles",   abbr:"LAD", lat:34.0522, lng:-118.2437, rival:"San Francisco Giants",  house:"The Blue Empire of Chavez Ravine" },
  { id:120, name:"Washington Nationals",  city:"Washington",    abbr:"WSH", lat:38.9072, lng:-77.0369,  rival:"Atlanta Braves",        house:"The Capitol Guard" },
  { id:121, name:"New York Mets",         city:"New York",      abbr:"NYM", lat:40.7128, lng:-74.0060,  rival:"New York Yankees",      house:"The Amazin Order of Queens" },
  { id:133, name:"Oakland Athletics",     city:"Oakland",       abbr:"OAK", lat:37.8044, lng:-122.2712, rival:"San Francisco Giants",  house:"The Wandering Mercenaries" },
  { id:134, name:"Pittsburgh Pirates",    city:"Pittsburgh",    abbr:"PIT", lat:40.4406, lng:-79.9959,  rival:"St. Louis Cardinals",   house:"The Buccaneers of Three Rivers" },
  { id:135, name:"San Diego Padres",      city:"San Diego",     abbr:"SD",  lat:32.7157, lng:-117.1611, rival:"Los Angeles Dodgers",   house:"The Friars of Petco" },
  { id:136, name:"Seattle Mariners",      city:"Seattle",       abbr:"SEA", lat:47.6062, lng:-122.3321, rival:"Houston Astros",        house:"The Mariners of the Emerald North" },
  { id:137, name:"San Francisco Giants",  city:"San Francisco", abbr:"SF",  lat:37.7749, lng:-122.4194, rival:"Los Angeles Dodgers",   house:"The Giants of Oracle Bay" },
  { id:138, name:"St. Louis Cardinals",   city:"St. Louis",     abbr:"STL", lat:38.6270, lng:-90.1994,  rival:"Chicago Cubs",          house:"The Cardinal Lords of the Gateway" },
  { id:139, name:"Tampa Bay Rays",        city:"Tampa",         abbr:"TB",  lat:27.9506, lng:-82.4572,  rival:"New York Yankees",      house:"The Rays of the Suncoast" },
  { id:140, name:"Texas Rangers",         city:"Dallas",        abbr:"TEX", lat:32.7767, lng:-96.7970,  rival:"Houston Astros",        house:"The Rangers of the Lone Star" },
  { id:141, name:"Toronto Blue Jays",     city:"Toronto",       abbr:"TOR", lat:43.6532, lng:-79.3832,  rival:"New York Yankees",      house:"The Northern Crown" },
  { id:142, name:"Minnesota Twins",       city:"Minneapolis",   abbr:"MIN", lat:44.9778, lng:-93.2650,  rival:"Cleveland Guardians",   house:"The Twin Guardians of the North" },
  { id:143, name:"Philadelphia Phillies", city:"Philadelphia",  abbr:"PHI", lat:39.9526, lng:-75.1652,  rival:"New York Mets",         house:"The Liberty Realm" },
  { id:144, name:"Atlanta Braves",        city:"Atlanta",       abbr:"ATL", lat:33.7490, lng:-84.3880,  rival:"New York Mets",         house:"The Southern Dominion" },
  { id:145, name:"Chicago White Sox",     city:"Chicago",       abbr:"CWS", lat:41.8827, lng:-87.6233,  rival:"Chicago Cubs",          house:"The White Guard of the South Side" },
  { id:146, name:"Miami Marlins",         city:"Miami",         abbr:"MIA", lat:25.7617, lng:-80.1918,  rival:"Atlanta Braves",        house:"The Marlins of the Deep" },
  { id:147, name:"New York Yankees",      city:"New York",      abbr:"NYY", lat:40.6892, lng:-74.0445,  rival:"Boston Red Sox",        house:"The Pinstripe Empire of the Bronx" },
  { id:158, name:"Milwaukee Brewers",     city:"Milwaukee",     abbr:"MIL", lat:43.0389, lng:-87.9065,  rival:"Chicago Cubs",          house:"The Brewers of the Great Lake" },
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
- Write like you're texting a friend who owns all three extended editions.
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
- Write like you're texting a friend who has strong prequel opinions.
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

function FunLoader({ faction, type, dark }) {
  const f = faction || "sw";
  const msgs = LOADER_MSGS[f]?.[type] || LOADER_MSGS.sw.arc;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx(n => (n + 1) % msgs.length), 2200);
    return () => clearInterval(i);
  }, [f, type]);
  const accent = faction === "lotr" ? "#C9A84C" : "#FFE033";
  return (
    <div style={{display:"flex",gap:12,alignItems:"center",padding:"4px 0"}}>
      <div style={{width:20,height:20,border:`3px solid ${dark?"rgba(255,255,255,.15)":"#ddd"}`,borderTopColor:dark?accent:accent,borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0}}/>
      <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:600,color:dark?"rgba(255,255,255,.5)":"#888",transition:"opacity .3s",letterSpacing:.3}}>
        {msgs[idx]}
      </span>
    </div>
  );
}

function ShareButton({ text, faction }) {
  const f = FACTIONS[faction||"sw"];
  const url = "https://sports-lore.vercel.app";
  function handleShare(){
    const shareText = (text||"").replace(/\*\*/g,"").trim() + " — Sports Lore: " + url;
    if(navigator.share){
      navigator.share({title:"Sports Lore",text:shareText,url:url}).catch(()=>{});
    } else {
      navigator.clipboard.writeText(shareText).then(()=>{
        alert("Copied! Paste it anywhere.");
      }).catch(()=>{
        window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(shareText),"_blank");
      });
    }
  }
  return(
    <button onClick={handleShare} style={{
      background:f.accent,border:"2px solid #111",padding:"6px 14px",
      cursor:"pointer",fontFamily:"'Archivo Black',sans-serif",
      fontSize:10,letterSpacing:2,color:"#111",whiteSpace:"nowrap",
      display:"inline-flex",alignItems:"center",gap:5,flexShrink:0,
    }}>&#x2197; SHARE</button>
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
      const upcoming=games.filter(g=>new Date(g.gameDate)>now).sort((a,b)=>new Date(a.gameDate)-new Date(b.gameDate));
      const past=games.filter(g=>new Date(g.gameDate)<=now).sort((a,b)=>new Date(b.gameDate)-new Date(a.gameDate));
      const nextG=upcoming[0]??null, lastG=past[0]??null, recent=past.slice(0,5);
      setSched({next:nextG, last:lastG, recent});
      if(nextG) setCd(getCD(nextG.gameDate));

      const [boxScores,[batRes,pitRes]] = await Promise.all([
        Promise.all(past.slice(0,3).map(g=>
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
    const s0 = rd?.gameStories?.[0];
    const lastDetail = s0
      ? `Last game players: ${s0.batters.map(b=>`${b.name} ${b.h}-for-${b.ab}${b.hr>0?` ${b.hr}HR`:""}${b.rbi>0?` ${b.rbi}RBI`:""}`).join(", ")}${s0.starter?`; SP ${s0.starter.name} ${s0.starter.ip}IP ${s0.starter.er}ER ${s0.starter.k}K`:""}`
      : "";
    const batS = rd?.teamBatting ? `AVG:${rd.teamBatting.avg} OBP:${rd.teamBatting.obp} HR:${rd.teamBatting.homeRuns} Runs:${rd.teamBatting.runs}` : "";
    const pitS = rd?.teamPitching ? `ERA:${rd.teamPitching.era} WHIP:${rd.teamPitching.whip} K:${rd.teamPitching.strikeOuts}` : "";
    return {wins,losses,leading,gb,streak,lastDetail,batS,pitS};
  }

  // ── GENERATE CONTENT ──────────────────────────────────────────────────────
  async function generateContent(t, st, nextG, lastG, recent, rd, fac){
    const c = buildCtx(t, st, rd);
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
${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} is today. For each of the last 5 games, use ONLY dates before today. If you have real game data use it. If there is NO real game data, output NOTHING — do not invent any games.
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
    const q = "Who do I need to know on this team, and what is everyone talking about right now?";
    setMsgs([{role:"user", content:q}]);
    setOLoading(true);
    try{
      const res = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:350,system:ctx,messages:[{role:"user",content:q}]})
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "The oracle is warming up.";
      setMsgs([{role:"user",content:q},{role:"assistant",content:reply}]);
    }catch{
      setMsgs([{role:"user",content:q},{role:"assistant",content:"The Palantir is clouded. Ask me anything and I'll do my best."}]);
    }
    setOLoading(false);
  }

  function makeOracleCtx(t, st, rd, c, fac){
    const sys = FACTIONS[fac || faction || 'sw'].sys;
    return sys + `\n\nYou are in an ongoing conversation about the ${t.name} (known in lore as "${t.house}").
Their rival is the ${t.rival}.
Record: ${c.wins}W-${c.losses}L | Streak: ${c.streak}
${c.lastDetail}
${c.batS ? `Batting: ${c.batS}` : ""}
${c.pitS ? `Pitching: ${c.pitS}` : ""}

Keep responses to 3-4 sentences. The reference IS the explanation — never explain it. IMPORTANT: Your training data on MLB rosters is outdated. Only reference players and stats that appear in the data provided above. Do not reference players from memory — rosters change constantly and you will be wrong. If no player data is available, speak in general team terms. End every response with one line starting with ⚔️ they can say at work verbatim.`;
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
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:350,system:ctx,
          messages:newMsgs.map(m=>({role:m.role,content:m.content}))})
      });
      if(!res.ok) throw new Error("HTTP "+res.status);
      const data = await res.json();
      if(data.error) throw new Error(data.error.message || "API error");
      const reply = (data.content?.[0]?.text??"The oracle went dark.").replace(/\*\*/g,'').replace(/\*/g,'').trim();
      setMsgs(prev=>[...prev,{role:"assistant",content:reply}]);
    }catch(e){
      console.error("Oracle error:",e);
      setMsgs(prev=>[...prev,{role:"assistant",content:"Signal lost. Try asking again."}]);
    }
    setOLoading(false);
  }

  const f = FACTIONS[faction||'sw'];
  const nextOppName = sched.next ? getOpp(sched.next, team?.name??"") : "";
  const urgColor = !cd?"#111":cd.days===0?"#FF3B3B":cd.days<=2?"#FF6B00":"#111";
  const lastWon = sched.last ? didWin(sched.last, team?.id??0) : null;
  const formDots = sched.recent.map(g=>didWin(g,team?.id??0));

  const followUps = team ? [
    "Why did they win or lose the last game?",
    "Who is the most important player to watch?",
    "Should I be worried about making the playoffs?",
    "What should I actually say if someone brings this up at work?",
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
        .stat-pill{background:#111;color:var(--faction-accent,#FFE033);padding:8px 16px;display:inline-flex;flex-direction:column;align-items:center;gap:2px;min-width:64px;}
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
              style={{background:"#C9A84C",border:"3px solid #C9A84C",cursor:"pointer",padding:"36px 28px",textAlign:"left",transition:"all .15s"}}
              onMouseOver={e=>{e.currentTarget.style.background="#E8C76A";e.currentTarget.style.borderColor="#E8C76A";}}
              onMouseOut={e=>{e.currentTarget.style.background="#C9A84C";e.currentTarget.style.borderColor="#C9A84C";}}>
              <div style={{fontSize:48,marginBottom:16}}>💍</div>
              <div className="arch" style={{fontSize:"clamp(22px,4vw,36px)",letterSpacing:-1,color:"#111",marginBottom:8,lineHeight:1}}>LORD OF<br/>THE RINGS</div>
              <p className="lora" style={{fontSize:15,lineHeight:1.65,color:"rgba(0,0,0,.6)",fontStyle:"italic",marginBottom:16}}>
                The bullpen has been pulling a Denethor. The cleanup hitter is our Aragorn. The rival is Mordor and always has been.
              </p>
              <div className="arch" style={{fontSize:11,letterSpacing:3,color:"rgba(0,0,0,.5)"}}>SELECT THIS UNIVERSE →</div>
            </button>
            {/* Star Wars */}
            <button onClick={()=>{setFaction("sw");setPhase("landing");}}
              style={{background:"#FFE033",border:"3px solid #FFE033",cursor:"pointer",padding:"36px 28px",textAlign:"left",transition:"all .15s"}}
              onMouseOver={e=>{e.currentTarget.style.background="#FFF176";e.currentTarget.style.borderColor="#FFF176";}}
              onMouseOut={e=>{e.currentTarget.style.background="#FFE033";e.currentTarget.style.borderColor="#FFE033";}}>
              <div style={{fontSize:48,marginBottom:16}}>🚀</div>
              <div className="arch" style={{fontSize:"clamp(22px,4vw,36px)",letterSpacing:-1,color:"#111",marginBottom:8,lineHeight:1}}>STAR<br/>WARS</div>
              <p className="lora" style={{fontSize:15,lineHeight:1.65,color:"rgba(0,0,0,.6)",fontStyle:"italic",marginBottom:16}}>
                The bullpen has been Order 66-ing every lead since April. The ace is our Ahsoka — quietly the best one out there.
              </p>
              <div className="arch" style={{fontSize:11,letterSpacing:3,color:"rgba(0,0,0,.5)"}}>SELECT THIS UNIVERSE →</div>
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
          <div style={{background:f.accent,borderBottom:"3px solid #111",padding:"clamp(28px,5vw,48px) clamp(20px,5vw,48px)"}}>
            {/* Lore name */}
            <div className="lora" style={{fontSize:13,fontStyle:"italic",color:"#555",marginBottom:8}}>
              Chronicle of {team.house}
            </div>

            {/* Team name — big */}
            <h1 className="arch" style={{fontSize:"clamp(40px,10vw,88px)",lineHeight:.88,letterSpacing:-1,marginBottom:24,color:"#111"}}>
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
                  {!cd?"NEXT GAME":cd.days===0?"⚔ GAME DAY — TODAY":cd.days<=2?"🔥 COMING SOON":"NEXT GAME"}
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
                <div className="arch" style={{fontSize:9,letterSpacing:3,color:"#888",marginBottom:6}}>LAST GAME</div>
                {sched.last?(
                  <>
                    <div className="arch" style={{fontSize:11,letterSpacing:1,color:lastWon?"#111":"#888",marginBottom:4}}>{lastWon?"✓ WIN":"✗ LOSS"}</div>
                    <div className="arch" style={{fontSize:"clamp(22px,4vw,36px)",letterSpacing:-1,lineHeight:1,marginBottom:4,color:lastWon?"#111":"#888"}}>
                      {sched.last.teams?.home?.score??'?'}–{sched.last.teams?.away?.score??'?'}
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
                  <div key={i} style={{width:30,height:30,background:w?"#111":"rgba(0,0,0,.04)",border:"2px solid #111",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span className="arch" style={{fontSize:11,color:w?"#FFE033":"#111"}}>{w?"W":"L"}</span>
                  </div>
                ))}
                <span className="sg" style={{fontSize:10,color:"#555",fontWeight:600,marginLeft:6}}>LAST {formDots.length} GAMES</span>
              </div>
            )}
          </div>

          {/* ── ORACLE (TOP — AUTO-FIRED) ── */}
          <div style={{borderBottom:"3px solid #111",padding:"clamp(24px,5vw,40px) clamp(20px,5vw,48px)"}}>

            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
              <h2 className="arch" style={{fontSize:"clamp(24px,5vw,44px)",letterSpacing:-1,lineHeight:1}}>THE ORACLE</h2>
              <span style={{fontSize:20}}>🔮</span>
            </div>
            <p className="lora" style={{fontSize:14,fontStyle:"italic",color:"#555",marginBottom:20}}>
              Translates your team into Star Wars and LOTR. Ask anything — it answers like a fan who has also watched every extended edition.
            </p>

            {/* Chat */}
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16,minHeight:60}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:m.role==="user"?"flex-end":"flex-start"}}><div className={m.role==="user"?"bq":"ba"}>
                    <p className={m.role==="user"?"sg":"lora"} style={{margin:0,fontSize:m.role==="user"?13:16,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{m.content}</p>
                  </div>
                  {m.role==="assistant"&&<ShareButton text={m.content} faction={faction}/>}
                </div>
              ))}
              {oLoading&&(
                <div style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0"}}>
                  <Spin/>
                  <span className="sg" style={{fontSize:13,color:"#555",fontWeight:600}}>Consulting the archive...</span>
                </div>
              )}
              <div ref={chatEnd}/>
            </div>

            {/* Follow-up chips */}
            {msgs.length>=2&&!oLoading&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6,marginBottom:14}}>
                {followUps.map(q=>(
                  <button key={q} className="chip" onClick={()=>{
                    const newMsgs=[...msgs,{role:"user",content:q}];
                    setMsgs(newMsgs);setOLoading(true);
                    const rd=richRef.current,c=buildCtx(team,standings,rd),ctx=makeOracleCtx(team,standings,rd,c,faction);
                    fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
                      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:350,system:ctx,messages:newMsgs.map(m=>({role:m.role,content:m.content}))})})
                      .then(r=>r.json()).then(d=>setMsgs(prev=>[...prev,{role:"assistant",content:d.content?.[0]?.text??"..."}]))
                      .catch(()=>setMsgs(prev=>[...prev,{role:"assistant",content:"Signal lost."}]))
                      .finally(()=>setOLoading(false));
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
          <div style={{background:"#111",padding:"clamp(28px,5vw,48px) clamp(20px,5vw,48px)",borderBottom:"3px solid #111"}}>
            <div className="arch" style={{fontSize:11,letterSpacing:4,color:f.accent,marginBottom:16}}>{f.saySectionTitle}</div>
            {loading&&!talkingPoint?(
              <div style={{display:"flex",gap:10,alignItems:"center"}}><Spin/><span className="sg" style={{fontSize:13,color:"#aaa",fontWeight:600}}>Writing your talking point...</span></div>
            ):talkingPoint?(
              <>
                {/* Lore translation */}
                <div style={{marginBottom:6,fontSize:10,fontFamily:"'Archivo Black',sans-serif",letterSpacing:3,color:f.accent,opacity:.7}}>
                  {faction==="lotr"?"⚔️ IN MIDDLE-EARTH":"🚀 IN A GALAXY FAR AWAY"}
                </div>
                <blockquote className="lora" style={{fontSize:"clamp(17px,2.8vw,28px)",lineHeight:1.35,fontStyle:"italic",fontWeight:600,color:f.accent,borderLeft:`4px solid ${f.accent}`,paddingLeft:20,marginBottom:24}}>
                  &ldquo;{typeof talkingPoint==="object"?talkingPoint.lore:talkingPoint}&rdquo;
                </blockquote>
                {/* Sports translation */}
                {typeof talkingPoint==="object"&&talkingPoint.sports&&(
                  <>
                    <div style={{marginBottom:6,fontSize:10,fontFamily:"'Archivo Black',sans-serif",letterSpacing:3,color:"#888"}}>
                      ⚾ SAY THIS AT WORK
                    </div>
                    <blockquote className="lora" style={{fontSize:"clamp(15px,2.2vw,22px)",lineHeight:1.5,fontStyle:"italic",fontWeight:600,color:"#fff",borderLeft:"4px solid #fff",paddingLeft:20,marginBottom:16,opacity:.9}}>
                      &ldquo;{talkingPoint.sports}&rdquo;
                    </blockquote>
                  </>
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
                  <span className="arch" style={{float:"left",fontSize:"clamp(52px,9vw,76px)",lineHeight:.82,marginRight:10,marginTop:8,color:f.accent,WebkitTextStroke:"2px #111"}}>{arc?.[0]}</span>
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
                      <div className="lora" style={{fontSize:"clamp(14px,2.2vw,18px)",fontWeight:600,lineHeight:1.3,marginBottom:3}}>{ep.title}</div>
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
