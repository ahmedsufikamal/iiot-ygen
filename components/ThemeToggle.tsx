'use client';
export default function ThemeToggle(){
  function setTheme(next:'light'|'dark'){
    document.cookie=`theme=${next}; path=/; max-age=${60*60*24*365}`;
    document.documentElement.setAttribute('data-theme', next);
    document.body.classList.remove('dark-gradient','light-gradient');
    document.body.classList.add(next==='dark'?'dark-gradient':'light-gradient');
  }
  return (
    <div className="row" style={{justifyContent:'space-between'}}>
      <button className="btn" onClick={()=>setTheme('light')}>Light</button>
      <button className="btn" onClick={()=>setTheme('dark')}>Dark</button>
    </div>
  );
}
