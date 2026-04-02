import { useState, useEffect } from "react";

const ICONS = { Streaming:"🎬",SaaS:"💻",Fitness:"💪",News:"📰",Gaming:"🎮",Food:"🍔",Music:"🎵",Other:"📦" };
const CAT_COLORS = { Streaming:"#FF4757",SaaS:"#1A56FF",Fitness:"#2ED573",News:"#FFB800",Gaming:"#A55EEA",Food:"#FF6B81",Music:"#00D4FF",Other:"#8892A4" };

export default function App() {
  const [page,setPage]=useState("home");
  const [file,setFile]=useState(null);
  const [drag,setDrag]=useState(false);
  const [data,setData]=useState(null);
  const [error,setError]=useState("");

  useEffect(()=>{
    const st=document.createElement("style");
    st.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Inter',sans-serif;background:#060B1F;overflow-x:hidden;}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes moveBlob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,10px) scale(.95)}}
      .fade-up{animation:fadeUp .6s ease forwards;}
      .float{animation:float 3s ease-in-out infinite;}
      .hover-card{transition:all .25s ease;}
      .hover-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(26,86,255,.2);}
      .btn-primary{transition:all .2s ease;}
      .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(26,86,255,.5);}
    `;
    document.head.appendChild(st);
    document.body.style.cssText="background:#060B1F;margin:0;";
  },[]);

  function pickFile(f){
    if(!f) return;
    if(!f.type.includes("pdf")&&!f.name.endsWith(".csv")){setError("Only PDF or CSV!");return;}
    setError("");setFile(f);
  }

  async function scan(){
    if(!file) return;
    setPage("scanning");setError("");
    const form=new FormData();form.append("file",file);
    try{
      const res=await fetch("http://localhost:3001/api/scan",{method:"POST",body:form});
      const json=await res.json();
      if(json.error) throw new Error(json.error);
      setData(json);setPage("results");
    }catch(e){setError(e.message||"Something went wrong!");setPage("home");}
  }

  function reset(){setPage("home");setFile(null);setData(null);setError("");}

  if(page==="scanning") return <Scanning/>;
  if(page==="results") return <Results data={data} onReset={reset}/>;
  return <Home file={file} drag={drag} error={error} onPick={pickFile} onScan={scan} onDrag={setDrag}/>;
}

// ══════════════════════════════════════════
// HOME
// ══════════════════════════════════════════
function Home({file,drag,error,onPick,onScan,onDrag}){
  return(
    <div style={{minHeight:"100vh",background:"#060B1F",display:"flex",flexDirection:"column",alignItems:"center",position:"relative",overflow:"hidden"}}>

      {/* BG BLOBS */}
      <div style={{position:"fixed",top:"10%",left:"15%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,86,255,.18) 0%,transparent 65%)",animation:"moveBlob 8s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"40%",right:"10%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,255,.12) 0%,transparent 65%)",animation:"moveBlob 10s ease-in-out infinite reverse",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"10%",left:"30%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(165,94,234,.1) 0%,transparent 65%)",animation:"moveBlob 12s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none",zIndex:0}}/>

      {/* NAV */}
      <nav style={{width:"100%",maxWidth:900,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 32px",position:"relative",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,background:"linear-gradient(135deg,#1A56FF,#00D4FF)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 4px 16px rgba(26,86,255,.4)"}}>🔍</div>
          <span style={{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:"-0.5px"}}>Sub<span style={{color:"#00D4FF"}}>Scan</span></span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{background:"rgba(0,212,255,.08)",border:"1px solid rgba(0,212,255,.2)",color:"#00D4FF",fontSize:12,fontWeight:700,padding:"6px 14px",borderRadius:20}}>✨ AI-Powered</div>
          <div style={{background:"rgba(46,213,115,.08)",border:"1px solid rgba(46,213,115,.2)",color:"#2ED573",fontSize:12,fontWeight:700,padding:"6px 14px",borderRadius:20}}>🌍 Global</div>
          <div style={{background:"rgba(255,184,0,.08)",border:"1px solid rgba(255,184,0,.2)",color:"#FFB800",fontSize:12,fontWeight:700,padding:"6px 14px",borderRadius:20}}>🆓 Free</div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{textAlign:"center",padding:"40px 32px 20px",maxWidth:780,width:"100%",position:"relative",zIndex:10}} className="fade-up">

        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,184,0,.08)",border:"1px solid rgba(255,184,0,.2)",color:"#FFB800",fontSize:12,fontWeight:700,padding:"7px 16px",borderRadius:30,marginBottom:28}}>
          🔥 People worldwide waste $300 Billion/year on forgotten subscriptions
        </div>

        <h1 style={{fontSize:56,fontWeight:900,color:"#fff",letterSpacing:"-2px",lineHeight:1.05,marginBottom:20}}>
          Find Every Hidden<br/>
          <span style={{background:"linear-gradient(135deg,#1A56FF 0%,#00D4FF 50%,#A55EEA 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Subscription
          </span>
          <span style={{color:"#fff"}}> in </span>
          <span style={{color:"#2ED573"}}>60s</span>
        </h1>

        <p style={{fontSize:17,color:"#8892A4",lineHeight:1.7,marginBottom:20,maxWidth:560,margin:"0 auto 20px"}}>
          Upload your bank statement — AI instantly detects every recurring charge.<br/>
          <span style={{color:"#fff",fontWeight:600}}>No bank login. No data stored. Supports all currencies. 🌍</span>
        </p>

        {/* CURRENCY BADGES */}
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
          {["$ USD","€ EUR","£ GBP","₹ INR","¥ JPY","A$ AUD","C$ CAD","S$ SGD","د.إ AED","₩ KRW"].map(c=>(
            <span key={c} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#8892A4",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20}}>{c}</span>
          ))}
        </div>

        {/* STATS */}
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:48}}>
          {[["$300B","Global annual waste","#FF4757"],["86%","People overpaying","#FFB800"],["8-12","Avg subs per person","#00D4FF"],["60s","Time to find all subs","#2ED573"]].map(([n,l,c])=>(
            <div key={n} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,padding:"18px 24px",minWidth:140,backdropFilter:"blur(10px)",textAlign:"center"}} className="hover-card">
              <div style={{fontSize:26,fontWeight:900,color:c,letterSpacing:"-1px",marginBottom:4}}>{n}</div>
              <div style={{fontSize:11,color:"#8892A4",fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div style={{width:"100%",maxWidth:560,padding:"0 20px",position:"relative",zIndex:10}} className="fade-up">
        <div style={{background:"rgba(255,255,255,.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:28,padding:"32px",boxShadow:"0 32px 80px rgba(0,0,0,.4)"}}>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <h2 style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>Upload Bank Statement</h2>
              <p style={{fontSize:13,color:"#8892A4"}}>PDF or CSV · Any bank · Any currency · Deleted after scan</p>
            </div>
            <div style={{background:"rgba(46,213,115,.1)",border:"1px solid rgba(46,213,115,.25)",color:"#2ED573",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,whiteSpace:"nowrap"}}>🔒 Secure</div>
          </div>

          {/* DROP ZONE */}
          <label
            style={{display:"block",border:`2px dashed ${drag?"#1A56FF":file?"#2ED573":"rgba(255,255,255,.12)"}`,borderRadius:20,padding:"40px 20px",textAlign:"center",cursor:"pointer",marginBottom:20,transition:"all .25s",background:drag?"rgba(26,86,255,.06)":file?"rgba(46,213,115,.04)":"rgba(255,255,255,.02)"}}
            onDragOver={e=>{e.preventDefault();onDrag(true);}}
            onDragLeave={()=>onDrag(false)}
            onDrop={e=>{e.preventDefault();onDrag(false);onPick(e.dataTransfer.files[0]);}}
          >
            <input type="file" accept=".pdf,.csv" onChange={e=>onPick(e.target.files[0])} style={{display:"none"}}/>
            {file?(
              <div>
                <div style={{fontSize:52,marginBottom:12}}>✅</div>
                <div style={{color:"#2ED573",fontWeight:800,fontSize:16,marginBottom:4}}>{file.name}</div>
                <div style={{color:"#8892A4",fontSize:13,marginBottom:12}}>{(file.size/1024).toFixed(1)} KB</div>
                <span style={{background:"rgba(46,213,115,.15)",border:"1px solid rgba(46,213,115,.3)",color:"#2ED573",fontSize:12,fontWeight:700,padding:"5px 14px",borderRadius:20}}>✓ Ready to scan</span>
              </div>
            ):(
              <div>
                <div style={{fontSize:52,marginBottom:12}} className="float">📄</div>
                <div style={{color:"#fff",fontWeight:700,fontSize:16,marginBottom:6}}>Drop your file here</div>
                <div style={{color:"#8892A4",fontSize:13,marginBottom:16}}>or click to browse</div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  {["PDF","CSV"].map(f=>(
                    <span key={f} style={{background:"rgba(26,86,255,.2)",color:"#00D4FF",border:"1px solid rgba(0,212,255,.3)",borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:800}}>{f}</span>
                  ))}
                </div>
              </div>
            )}
          </label>

          {error&&<div style={{background:"rgba(255,71,87,.1)",border:"1px solid rgba(255,71,87,.25)",borderRadius:12,padding:"12px 16px",color:"#FF4757",fontSize:13,marginBottom:16,textAlign:"center"}}>⚠️ {error}</div>}

          <button onClick={onScan} disabled={!file} style={{width:"100%",padding:"17px",fontSize:16,fontWeight:800,border:"none",borderRadius:16,cursor:file?"pointer":"not-allowed",marginBottom:16,background:file?"linear-gradient(135deg,#1A56FF,#00D4FF)":"rgba(255,255,255,.06)",color:file?"#fff":"#8892A4"}} className={file?"btn-primary":""}>
            {file?(
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                🚀 Scan My Subscriptions
                <span style={{background:"rgba(255,255,255,.25)",borderRadius:12,padding:"3px 10px",fontSize:12,fontWeight:700}}>FREE</span>
              </span>
            ):"Upload a file to start"}
          </button>

          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
            {["🔒 Encrypted","🗑️ Auto-deleted","🚫 No login","🌍 All currencies","⚡ 60 seconds"].map(t=>(
              <span key={t} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#8892A4",fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:20}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{width:"100%",maxWidth:700,padding:"60px 24px 20px",position:"relative",zIndex:10}} className="fade-up">
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{color:"#00D4FF",fontSize:12,fontWeight:700,letterSpacing:2,marginBottom:8}}>HOW IT WORKS</div>
          <h2 style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>3 Steps to Save Money</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[["📤","Upload","Drop your PDF or CSV bank statement — any bank, any country","#1A56FF"],["🤖","AI Scans","Advanced AI detects every recurring transaction in any currency","#00D4FF"],["💰","Save Money","See all hidden subs with exact annual cost in your currency","#2ED573"]].map(([ic,t,d,c],i)=>(
            <div key={t} style={{background:"rgba(255,255,255,.03)",border:`1px solid ${c}20`,borderRadius:20,padding:"28px 20px",textAlign:"center",position:"relative"}} className="hover-card">
              <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",width:28,height:28,background:`linear-gradient(135deg,${c},${c}99)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",boxShadow:`0 4px 16px ${c}40`}}>{i+1}</div>
              <div style={{fontSize:36,margin:"8px 0 12px"}}>{ic}</div>
              <div style={{fontWeight:800,color:"#fff",fontSize:15,marginBottom:8}}>{t}</div>
              <div style={{fontSize:12,color:"#8892A4",lineHeight:1.6}}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{color:"#1E2847",fontSize:12,padding:"32px 0 16px",position:"relative",zIndex:10,textAlign:"center"}}>
        SubScan · AI-Powered · Free Forever · No Bank Login · Global Support 🌍
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// SCANNING
// ══════════════════════════════════════════
function Scanning(){
  const steps=["Extracting transactions...","Detecting recurring patterns...","Classifying merchants...","Detecting currency...","Generating your report..."];
  const [step,setStep]=useState(0);
  const [pct,setPct]=useState(0);
  useEffect(()=>{
    const iv=setInterval(()=>{setStep(p=>p<steps.length-1?p+1:p);setPct(p=>Math.min(p+19,95));},1600);
    return()=>clearInterval(iv);
  },[]);
  return(
    <div style={{minHeight:"100vh",background:"#060B1F",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:28,padding:"44px 40px",width:"100%",maxWidth:440,textAlign:"center",backdropFilter:"blur(20px)"}} className="fade-up">
        <div style={{position:"relative",width:110,height:110,margin:"0 auto 28px"}}>
          <div style={{position:"absolute",inset:0,border:"3px solid rgba(255,255,255,.08)",borderRadius:"50%"}}/>
          <div style={{position:"absolute",inset:0,border:"3px solid transparent",borderTopColor:"#00D4FF",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
          <div style={{position:"absolute",inset:10,border:"3px solid transparent",borderTopColor:"#1A56FF",borderRadius:"50%",animation:"spin .7s linear infinite reverse"}}/>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🔍</div>
        </div>
        <h2 style={{color:"#fff",fontSize:22,fontWeight:800,marginBottom:8}}>Analyzing Statement</h2>
        <p style={{color:"#00D4FF",fontSize:14,fontWeight:600,marginBottom:24,minHeight:20}}>{steps[step]}</p>
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:10,height:6,marginBottom:28,overflow:"hidden"}}>
          <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,#1A56FF,#00D4FF)",borderRadius:10,transition:"width .5s ease"}}/>
        </div>
        {steps.map((st,i)=>(
          <div key={st} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 14px",borderRadius:12,background:i===step?"rgba(26,86,255,.12)":"transparent",marginBottom:4,transition:"all .3s"}}>
            <span style={{fontSize:14}}>{i<step?"✅":i===step?"⏳":"⬜"}</span>
            <span style={{fontSize:13,color:i<=step?"#fff":"#8892A4",fontWeight:i===step?700:400}}>{st}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// RESULTS
// ══════════════════════════════════════════
function Results({data,onReset}){
  const subs=data?.subscriptions||[];
  const mo=data?.total_monthly||0;
  const yr=data?.total_annual||0;
  const currency=data?.currency||"$";

  return(
    <div style={{minHeight:"100vh",background:"#060B1F",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 0 40px"}}>
      <div style={{position:"fixed",top:"5%",right:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,71,87,.1) 0%,transparent 65%)",pointerEvents:"none"}}/>

      {/* NAV */}
      <nav style={{width:"100%",maxWidth:680,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"linear-gradient(135deg,#1A56FF,#00D4FF)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🔍</div>
          <span style={{fontSize:20,fontWeight:900,color:"#fff"}}>Sub<span style={{color:"#00D4FF"}}>Scan</span></span>
        </div>
        <button onClick={onReset} style={{background:"rgba(26,86,255,.15)",border:"1px solid rgba(26,86,255,.3)",color:"#00D4FF",fontSize:13,fontWeight:700,padding:"8px 18px",borderRadius:12,cursor:"pointer"}}>
          + New Scan
        </button>
      </nav>

      <div style={{width:"100%",maxWidth:600,padding:"0 20px"}}>

        {/* HERO RESULT */}
        <div style={{background:"linear-gradient(135deg,rgba(255,71,87,.1),rgba(255,184,0,.06))",border:"1px solid rgba(255,71,87,.2)",borderRadius:24,padding:"32px",textAlign:"center",marginBottom:20}} className="fade-up">
          <div style={{fontSize:12,color:"#FF4757",fontWeight:700,letterSpacing:2,marginBottom:10}}>⚠️ ANNUAL WASTE DETECTED</div>
          <div style={{fontSize:58,fontWeight:900,color:"#FF4757",letterSpacing:"-2px",marginBottom:6}}>{currency}{yr.toFixed(2)}</div>
          <div style={{color:"#8892A4",fontSize:14}}>you could save this much per year by cancelling unused subscriptions</div>
        </div>

        {/* SUMMARY */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}} className="fade-up">
          {[["Monthly Spend",currency+mo.toFixed(2),"#FF4757"],["Annual Total",currency+yr.toFixed(2),"#FFB800"],["Subs Found",subs.length+" found","#00D4FF"]].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,padding:"18px 14px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:c,letterSpacing:"-0.5px"}}>{v}</div>
              <div style={{fontSize:11,color:"#8892A4",marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>

        {/* SUB LIST */}
        <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:24,padding:"24px",marginBottom:16}} className="fade-up">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{color:"#fff",fontWeight:800,fontSize:17}}>Your Subscriptions</h3>
            <span style={{background:"rgba(255,71,87,.12)",color:"#FF4757",border:"1px solid rgba(255,71,87,.2)",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700}}>{subs.length} detected</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {subs.map((sub,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.03)",border:`1px solid ${CAT_COLORS[sub.category]||"#1E2847"}25`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,transition:"all .2s"}} className="hover-card">
                <div style={{width:46,height:46,borderRadius:14,background:`${CAT_COLORS[sub.category]||"#1A56FF"}20`,border:`1px solid ${CAT_COLORS[sub.category]||"#1A56FF"}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  {ICONS[sub.category]||"📦"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#fff",fontSize:14,marginBottom:3}}>{sub.name}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:11,color:CAT_COLORS[sub.category]||"#8892A4",fontWeight:700,background:`${CAT_COLORS[sub.category]||"#1A56FF"}15`,padding:"2px 8px",borderRadius:6}}>{sub.category}</span>
                    <span style={{fontSize:11,color:"#8892A4"}}>{sub.frequency}</span>
                    {sub.currency&&<span style={{fontSize:11,color:"#FFB800",fontWeight:600}}>{sub.currency}</span>}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:"#FF4757",fontWeight:900,fontSize:16}}>{sub.currency||currency}{sub.amount}<span style={{fontSize:11,fontWeight:400,color:"#8892A4"}}>/mo</span></div>
                  <div style={{color:"#8892A4",fontSize:11,marginTop:2}}>{sub.currency||currency}{sub.annual}/yr</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div style={{display:"flex",flexDirection:"column",gap:10}} className="fade-up">
          <button onClick={onReset} style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#1A56FF,#00D4FF)",color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:800,cursor:"pointer"}} className="btn-primary">
            🔄 Scan Another Statement
          </button>
          <button style={{width:"100%",padding:"16px",background:"rgba(255,255,255,.04)",color:"#8892A4",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,fontSize:14,fontWeight:600,cursor:"pointer"}}>
            ⭐ Upgrade to Pro — Unlimited Scans
          </button>
        </div>
      </div>
    </div>
  );
}